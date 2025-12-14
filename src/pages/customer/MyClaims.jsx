import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCustomerClaims } from '../../services/claimService';
import ClaimList from '../../components/claim/ClaimList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import SearchInput from '../../components/common/SearchInput';
import AdvancedFilter from '../../components/common/AdvancedFilter';
import { CLAIM_STATUS } from '../../utils/constants';

const MyClaims = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        const customerId = user?.customerId || user?.username;
        if (customerId) {
          const data = await getCustomerClaims(customerId);
          setClaims(data);
          setFilteredClaims(data);
        }
      } catch (err) {
        setError('Failed to load claims. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
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
    console.log('View claim:', id);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

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
    </div>
  );
};

export default MyClaims;
