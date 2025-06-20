
import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardHome } from '../components/dashboard/DashboardHome';
import { DomainManagement } from '../components/domains/DomainManagement';
import { UptimeMonitoring } from '../components/monitoring/UptimeMonitoring';
import { SSLMonitoring } from '../components/ssl/SSLMonitoring';

export const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'domains':
        return <DomainManagement />;
      case 'monitoring':
        return <UptimeMonitoring />;
      case 'ssl':
        return <SSLMonitoring />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </DashboardLayout>
  );
};
