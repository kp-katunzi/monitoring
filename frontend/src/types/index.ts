
export interface User {
  id: string;
  username: string;
  email: string;
  phone_number?: string;
  is_admin: boolean;
}

export interface Domain {
  id: string;
  name: string;
  url: string;
  user_id: string;
  created_at: string;
  ssl_info?: SSLInfo;
  uptime_events?: UptimeEvent[];
  domain_expiry?: DomainExpiry;
}
export interface SSLInfo {
  id: string;
  domain_id: string;
  issuer: string;
  start_date: string;
  end_date: string;
  days_remaining: number;
  last_checked: string;
}
// export interface UptimeEvent {
//   id: number;
//   domain_id: number;
//   status: 'UP' | 'DOWN';
//   response_time: number | null;
//   checked_at: string;  // ISO format date string
// }
export interface UptimeEvent {
  checked_at: string;
  status: 'UP' | 'DOWN';
  response_time: number;
}

export interface DomainExpiry {
  id: string;
  domain_id: string;
  registrar: string;
  creation_date: string;
  expiration_date: string;
  last_checked: string;
}

// export interface DomainStats {
//   domain: string;
//   domain_id: number;
//   uptime: number;
//   avgResponseTime: number;
//   lastCheck: string;
//   status: 'UP' | 'DOWN';
//   incidentsToday: number;
//   sslExpiry?: string; // Add this line to include sslExpiry
// }


export type DomainStats = {
  id: string;
  domain: string;
  uptime: number;
  avgResponseTime: number;
  lastCheck: string;
  status: 'UP' | 'DOWN';
};
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  phone_number?: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
