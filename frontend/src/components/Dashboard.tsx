import { UptimeMonitoring } from './monitoring/UptimeMonitoring';
import type { Domain } from '../types';

type DashboardProps = { domains: Domain[] };

export const Dashboard: React.FC<DashboardProps> = ({ domains }) => (
  <div className="space-y-8">
    {domains.map((domain) => (
      <div key={domain.id} className="border rounded-lg p-4">
        <h4 className="text-xl font-semibold">{domain.name}</h4>
        <p className="text-sm text-muted-foreground">{domain.url}</p>
        {/* Pass `domainId` as number */}
        <UptimeMonitoring domainId={Number(domain.id)} />
      </div>
    ))}
  </div>
);
