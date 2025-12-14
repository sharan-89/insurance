import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCustomerDashboardStats } from '../../utils/customerDummyData';
import { Card, CardContent } from '../../components/common/Card';
import { FileText, CheckCircle2, ClipboardList, Clock } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPolicies: 0,
    activePolicies: 0,
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0
  });

  useEffect(() => {
    // Get dummy data directly - no API calls, no storage
    const customerId = user?.customerId || 'cust_1';
    const dashboardStats = getCustomerDashboardStats(customerId);
    setStats(dashboardStats);
  }, [user]);

  const statCards = [
    {
      title: 'Total Policies',
      value: stats.totalPolicies,
      icon: FileText,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Policies',
      value: stats.activePolicies,
      icon: CheckCircle2,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Claims',
      value: stats.totalClaims,
      icon: ClipboardList,
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Pending Claims',
      value: stats.pendingClaims,
      icon: Clock,
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">Welcome back, {user?.username}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="border border-gray-200 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <CardContent className="px-4 pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${stat.iconBgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-medium mb-1">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerDashboard;

