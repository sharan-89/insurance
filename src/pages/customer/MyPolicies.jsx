import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCustomerPoliciesData } from '../../utils/customerDummyData';
import PolicyList from '../../components/policy/PolicyList';
import PolicyDetailsModal from '../../components/policy/PolicyDetailsModal';
import Alert from '../../components/common/Alert';
import SearchInput from '../../components/common/SearchInput';
import AdvancedFilter from '../../components/common/AdvancedFilter';

const MyPolicies = () => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Get dummy data directly - no API calls, no storage
    const customerId = user?.customerId || 'cust_1';
    const data = getCustomerPoliciesData(customerId);
    setPolicies(data || []);
    setFilteredPolicies(data || []);
  }, [user]);

  useEffect(() => {
    filterPolicies();
  }, [policies, searchQuery, filters]);

  const filterPolicies = () => {
    let filtered = [...policies];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(policy =>
        policy.policyNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.policyType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.policyName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Advanced filters
    if (filters.policyType) {
      filtered = filtered.filter(policy => policy.policyType === filters.policyType);
    }
    if (filters.status) {
      filtered = filtered.filter(policy => policy.status === filters.status);
    }

    setFilteredPolicies(filtered);
  };

  const handleView = (id) => {
    const policy = policies.find(p => p.id === id);
    if (policy) {
      setSelectedPolicy(policy);
      setShowDetailsModal(true);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters({});
  };


  const policyTypes = [...new Set(policies.map(p => p.policyType))].map(type => ({
    value: type,
    label: type
  }));

  const filterOptions = [
    {
      key: 'policyType',
      label: 'Policy Type',
      type: 'select',
      options: policyTypes,
      placeholder: 'Select type'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Expired', label: 'Expired' }
      ],
      placeholder: 'Select status'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Policies</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">View all your insurance policies</p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Search and Filter */}
      <div className="flex items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search policies by number, type, or name..."
        />
        <AdvancedFilter
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleFilterReset}
        />
      </div>

      <PolicyList
        policies={filteredPolicies}
        onView={handleView}
      />

      {/* Policy Details Modal */}
      <PolicyDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPolicy(null);
        }}
        policy={selectedPolicy}
      />
    </div>
  );
};

export default MyPolicies;
