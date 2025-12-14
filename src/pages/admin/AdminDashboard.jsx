import React, { useState, useEffect } from 'react';
import { Users, FileText, ClipboardList, Clock, DollarSign, XCircle, CheckCircle2, TrendingUp, BarChart3 } from 'lucide-react';
import { getAllPolicies } from '../../services/policyService';
import { getAllClaims } from '../../services/claimService';
import { getAllCustomers } from '../../services/customerService';
import { Card, CardContent } from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalPolicies: 0,
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    totalCoverageAmount: 0,
    totalClaimAmount: 0,
    totalApprovedAmount: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customers, policies, claims] = await Promise.all([
          getAllCustomers().catch(() => []),
          getAllPolicies().catch(() => []),
          getAllClaims().catch(() => [])
        ]);

        const totalCoverage = policies.reduce((sum, p) => sum + (parseFloat(p.coverageAmount) || 0), 0);
        const totalClaimAmount = claims.reduce((sum, c) => sum + (parseFloat(c.claimAmount) || 0), 0);
        const approvedClaims = claims.filter(c => c.status === 'Approved');
        const totalApprovedAmount = approvedClaims.reduce((sum, c) => sum + (parseFloat(c.claimAmount) || 0), 0);

        setStats({
          totalCustomers: customers.length || 0,
          totalPolicies: policies.length || 0,
          totalClaims: claims.length || 0,
          pendingClaims: claims.filter(c => c.status === 'Submitted' || c.status === 'In Review').length || 0,
          approvedClaims: approvedClaims.length || 0,
          rejectedClaims: claims.filter(c => c.status === 'Rejected').length || 0,
          totalCoverageAmount: totalCoverage,
          totalClaimAmount: totalClaimAmount,
          totalApprovedAmount: totalApprovedAmount
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  // Monthly claims data (last 6 months)
  const monthlyClaimsData = [
    { month: 'Jul', submitted: 12, approved: 8, rejected: 2 },
    { month: 'Aug', submitted: 15, approved: 10, rejected: 3 },
    { month: 'Sep', submitted: 18, approved: 12, rejected: 4 },
    { month: 'Oct', submitted: 22, approved: 15, rejected: 5 },
    { month: 'Nov', submitted: 25, approved: 18, rejected: 4 },
    { month: 'Dec', submitted: 30, approved: 20, rejected: 6 }
  ];

  // Claims by status
  const claimsByStatus = [
    { name: 'Approved', value: stats.approvedClaims, color: '#10b981' },
    { name: 'Pending', value: stats.pendingClaims, color: '#f59e0b' },
    { name: 'Rejected', value: stats.rejectedClaims, color: '#ef4444' }
  ];

  // Policy types distribution
  const policyTypesData = [
    { name: 'Health', value: 25, color: '#6366f1' },
    { name: 'Life', value: 20, color: '#8b5cf6' },
    { name: 'Auto', value: 15, color: '#ec4899' },
    { name: 'Home', value: 10, color: '#f59e0b' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Total Policies',
      value: stats.totalPolicies,
      icon: FileText,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Coverage',
      value: formatCurrency(stats.totalCoverageAmount),
      icon: DollarSign,
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
      title: 'Approved Claims',
      value: stats.approvedClaims,
      icon: CheckCircle2,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Rejected Claims',
      value: stats.rejectedClaims,
      icon: XCircle,
      iconBgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      title: 'Pending Claims',
      value: stats.pendingClaims,
      icon: Clock,
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Claim Amount',
      value: formatCurrency(stats.totalClaimAmount),
      icon: DollarSign,
      iconBgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">Comprehensive overview of insurance management</p>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims Trend Chart */}
        <Card className="border border-gray-200 shadow-md">
          <CardContent className="pt-6 pb-5 px-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Claims Trend</h2>
                  <p className="text-[10px] text-gray-600 font-medium">Last 6 months</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyClaimsData}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ fontSize: '10px', padding: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="submitted" 
                  stackId="1"
                  stroke="#6366f1" 
                  fill="#6366f1" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="approved" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="rejected" 
                  stackId="1"
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Claims Status Distribution */}
        <Card className="border border-gray-200 shadow-md">
          <CardContent className="pt-6 pb-5 px-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Claims Status</h2>
                  <p className="text-[10px] text-gray-600 font-medium">Distribution by status</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={claimsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {claimsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ fontSize: '10px', padding: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Claims Bar Chart */}
        <Card className="border border-gray-200 shadow-md">
          <CardContent className="pt-6 pb-5 px-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Monthly Claims</h2>
                  <p className="text-[10px] text-gray-600 font-medium">Submitted, approved, and rejected</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyClaimsData}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ fontSize: '10px', padding: '8px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                />
                <Bar dataKey="submitted" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Policy Types Distribution */}
        <Card className="border border-gray-200 shadow-md">
          <CardContent className="pt-6 pb-5 px-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Policy Types</h2>
                  <p className="text-[10px] text-gray-600 font-medium">Distribution by type</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={policyTypesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {policyTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ fontSize: '10px', padding: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
