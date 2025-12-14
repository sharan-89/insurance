import React, { useState, useEffect } from 'react';
import { getActivityLogs } from '../../services/activityService';
import ActivityLogComponent from '../../components/activity/ActivityLog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import SearchInput from '../../components/common/SearchInput';
import AdvancedFilter from '../../components/common/AdvancedFilter';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchQuery, filters]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await getActivityLogs();
      setActivities(data);
      setFilteredActivities(data);
    } catch (err) {
      setError('Failed to load activity logs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = [...activities];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(activity =>
        activity.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.entityType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.entityId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Advanced filters
    if (filters.entityType) {
      filtered = filtered.filter(activity => activity.entityType === filters.entityType);
    }
    if (filters.startDate) {
      filtered = filtered.filter(activity => new Date(activity.timestamp) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(activity => new Date(activity.timestamp) <= new Date(filters.endDate));
    }

    setFilteredActivities(filtered);
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

  const entityTypes = [...new Set(activities.map(a => a.entityType))].map(type => ({
    value: type,
    label: type
  }));

  const filterOptions = [
    {
      key: 'entityType',
      label: 'Entity Type',
      type: 'select',
      options: entityTypes,
      placeholder: 'Select type'
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
          <h1 className="text-xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">View system activity and audit trail</p>
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
          placeholder="Search activities by action, entity type, or ID..."
        />
        <AdvancedFilter
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleFilterReset}
        />
      </div>

      <ActivityLogComponent activities={filteredActivities} />
    </div>
  );
};

export default ActivityLog;

