import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCustomerPolicies } from '../../services/policyService';
import { getCustomerClaims } from '../../services/claimService';
import { Card, CardContent } from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FileText, CheckCircle2, ClipboardList, Clock } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPolicies: 0,
    activePolicies: 0,
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const customerId = user?.customerId || user?.username;
        
        if (customerId) {
          const [policies, claims] = await Promise.all([
            getCustomerPolicies(customerId).catch(() => []),
            getCustomerClaims(customerId).catch(() => [])
          ]);

          setStats({
            totalPolicies: policies.length || 0,
            activePolicies: policies.filter(p => p.status === 'Active').length || 0,
            totalClaims: claims.length || 0,
            pendingClaims: claims.filter(c => c.status === 'Submitted' || c.status === 'In Review').length || 0,
            approvedClaims: claims.filter(c => c.status === 'Approved').length || 0
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

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

