import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCustomerClaimsData } from '../../utils/customerDummyData';
import ClaimList from '../../components/claim/ClaimList';
import ClaimDetailsModal from '../../components/claim/ClaimDetailsModal';
import Alert from '../../components/common/Alert';
import SearchInput from '../../components/common/SearchInput';
import AdvancedFilter from '../../components/common/AdvancedFilter';
import { CLAIM_STATUS } from '../../utils/constants';

const MyClaims = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Get dummy data directly - no API calls, no storage
    const customerId = user?.customerId || 'cust_1';
    const data = getCustomerClaimsData(customerId);
    setClaims(data || []);
    setFilteredClaims(data || []);
  }, [user]);

  useEffect(() => {
    filterClaims();
  }, [claims, searchQuery, filters]);

  const filterClaims = () => {
    let filtered = [...claims];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(claim =>
        claim.claimNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.policyNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Advanced filters
    if (filters.status) {
      filtered = filtered.filter(claim => claim.status === filters.status);
    }
    if (filters.startDate) {
      filtered = filtered.filter(claim => new Date(claim.claimDate) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(claim => new Date(claim.claimDate) <= new Date(filters.endDate));
    }

    setFilteredClaims(filtered);
  };

  const handleView = (id) => {
    const claim = claims.find(c => c.id === id);
    if (claim) {
      setSelectedClaim(claim);
      setShowDetailsModal(true);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters({});
  };


  const statusOptions = Object.values(CLAIM_STATUS).map(s => ({
    value: s,
    label: s
  }));

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions,
      placeholder: 'Select status'
    },
    {
      key: 'startDate',
      label: 'From Date',
      type: 'date'
    },
    {
      key: 'endDate',
      label: 'To Date',
      type: 'date'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Claims</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">Track all your claim requests</p>
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
          placeholder="Search claims by number, policy, or description..."
        />
        <AdvancedFilter
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleFilterReset}
        />
      </div>

      <ClaimList
        claims={filteredClaims}
        onView={handleView}
      />

      {/* Claim Details Modal */}
      <ClaimDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedClaim(null);
        }}
        claim={selectedClaim}
      />
    </div>
  );
};

export default MyClaims;
