import json
from celery import Celery
from datetime import datetime
from urllib.parse import urlparse
import ssl
import socket
import whois
import requests
import csv
import os
import smtplib
from email.message import EmailMessage
import time
import urllib3

from models import User, Domain

# ----------------------- Configurable Settings ------------------------
EMAIL_ALERTS = True
EMAIL_SENDER = "paulkatunzi10@gmail.com"
EMAIL_PASSWORD = "cbxt ugsr cxob ryyx"
EMAIL_RECEIVER = "kaihulapaul@gmail.com"
ALERT_SSL_DAYS_LEFT = 7
LOG_FILE = "website_monitor_log.csv"
link = (
    "https://hooks.slack.com/services/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"
)
WEBSITES = [
    "https://www.google.com",
    "https://expired.badssl.com",
    "https://example.com",
]
# ----------------------------------------------------------------------
SEND_SLACK_ALERTS = True
SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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"  # <-- Replace with your actual webhook URL

# Celery config
celery = Celery(__name__, broker="redis://localhost:6379/0")
celery.conf.beat_schedule = {
    "monitor-every-5-minutes": {
        "task": "tasks.run_monitoring_all",
        "schedule": 300.0,  # every 5 minutes
    }
}
celery.conf.timezone = "UTC"

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


@celery.task(bind=True)
def monitor_website_task(self, url):
    """Celery task with retry logic"""
    try:
        result = monitor_website(url)
        if result.get('status') == 'DOWN':
            self.retry(countdown=60, max_retries=3)  # Retry after 1 minute
        return result
    except Exception as e:
        self.retry(exc=e, countdown=60, max_retries=3)

def monitor_website(url):
    parsed_url = urlparse(url)
    hostname = parsed_url.hostname

    print(f"\nMonitoring: {url}")
    print("=" * 60)

    status = check_website(url)
    ssl_info = get_ssl_info(hostname)
    domain_expiry = get_domain_expiry(hostname)

    # Console
    for k, v in status.items():
        print(f"{k.replace('_', ' ').capitalize():25}: {v}")
    for k, v in ssl_info.items():
        print(f"{k.replace('_', ' ').capitalize():25}: {v}")
    print(f"{'Domain expiry':25}: {domain_expiry}")

    # Alerts
    if status.get("status") == "DOWN":
        send_email(
            f"ALERT: {url} is DOWN", f"Website {url} is currently not reachable."
        )


    if isinstance(ssl_info.get("valid_until"), datetime):
        days_left = (ssl_info["valid_until"] - datetime.utcnow()).days
        if days_left < ALERT_SSL_DAYS_LEFT:
            send_email(
                f"ALERT: SSL Expiring Soon for {hostname}",
                f"The SSL certificate for {hostname} expires in {days_left} days.",
            )

    # Log
    log_data = {
        "url": url,
        "status": status.get("status"),
        "status_code": status.get("status_code"),
        "response_time_ms": status.get("response_time_ms"),
        "ssl_valid_until": ssl_info.get("valid_until"),
        "domain_expiry": domain_expiry,
        "timestamp": datetime.utcnow(),
    }
    log_to_csv(log_data)



def check_website(url):
    """Improved website availability checker with better error handling"""
    try:
        # Ensure URL has scheme
        if not urlparse(url).scheme:
            url = f"http://{url}"
            
        # Configure session with longer timeout and redirect handling
        session = requests.Session()
        session.max_redirects = 5  # Limit redirects
        session.verify = False  # Disable SSL verification (use with caution)
        
        # Custom headers to simulate browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.5',
        }
        
        start_time = time.time()
        response = session.get(
            url,
            headers=headers,
            timeout=(3.05, 10)  # Connect timeout 3.05s, read timeout 10s
        )
        response_time = (time.time() - start_time) * 1000  # Convert to ms
        
        # Consider any status code under 500 as "UP"
        status = "UP" if response.status_code < 500 else "DOWN"
        
        return {
            "status": status,
            "status_code": response.status_code,
            "response_time_ms": round(response_time, 2),
            "server": response.headers.get("Server", "Unknown"),
            "content_length": len(response.content),
            "final_url": response.url  # Show final URL after redirects
        }
        
    except requests.exceptions.SSLError as e:
        return {
            "status": "DOWN",
            "error": f"SSL Error: {str(e)}",
            "response_time_ms": None
        }
    except requests.exceptions.Timeout as e:
        return {
            "status": "DOWN",
            "error": f"Timeout: {str(e)}",
            "response_time_ms": None
        }
    except requests.exceptions.TooManyRedirects as e:
        return {
            "status": "DOWN",
            "error": f"Too many redirects: {str(e)}",
            "response_time_ms": None
        }
    except requests.exceptions.RequestException as e:
        return {
            "status": "DOWN",
            "error": f"Connection Error: {str(e)}",
            "response_time_ms": None
        }

def get_ssl_info(hostname):
    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                start_date = datetime.strptime(
                    cert["notBefore"], "%b %d %H:%M:%S %Y %Z"
                )
                expire_date = datetime.strptime(
                    cert["notAfter"], "%b %d %H:%M:%S %Y %Z"
                )
                return {"valid_from": start_date, "valid_until": expire_date}
    except Exception as e:
        return {"error": f"SSL check failed: {e}"}



def get_domain_expiry(hostname):
    try:
        domain_info = whois.whois(hostname)
        return domain_info.expiration_date
    except Exception as e:
        return f"WHOIS failed: {e}"


def send_email(subject, body):
    if not EMAIL_ALERTS:
        return
    try:
        msg = EmailMessage()
        msg.set_content(body)
        msg["Subject"] = subject
        msg["From"] = EMAIL_SENDER
        msg["To"] = EMAIL_RECEIVER

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
            smtp.send_message(msg)
    except Exception as e:
        print(f"Failed to send email: {e}")


def send_slack_alert(message):
    if not SEND_SLACK_ALERTS or not SLACK_WEBHOOK_URL:
        return
    try:
        payload = {"text": message}
        response = requests.post(
            SLACK_WEBHOOK_URL,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"},
        )
        if response.status_code != 200:
            print(f"Slack alert failed: {response.status_code}, {response.text}")
    except Exception as e:
        print(f"Slack alert exception: {e}")


def log_to_csv(data):
    file_exists = os.path.isfile(LOG_FILE)
    with open(LOG_FILE, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=data.keys())
        if not file_exists:
            writer.writeheader()
        writer.writerow(data)
