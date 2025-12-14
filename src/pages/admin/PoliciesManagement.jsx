import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getAllPolicies, createPolicy, updatePolicy, assignPolicyToCustomer } from '../../services/policyService';
import { getAllCustomers } from '../../services/customerService';
import PolicyList from '../../components/policy/PolicyList';
import PolicyForm from '../../components/policy/PolicyForm';
import PolicyDetailsModal from '../../components/policy/PolicyDetailsModal';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import SearchInput from '../../components/common/SearchInput';
import AdvancedFilter from '../../components/common/AdvancedFilter';
import { toast } from 'react-toastify';

const PoliciesManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [assigningPolicyId, setAssigningPolicyId] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterPolicies();
  }, [policies, searchQuery, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [policiesData, customersData] = await Promise.all([
        getAllPolicies().catch(() => []),
        getAllCustomers().catch(() => [])
      ]);
      setPolicies(policiesData);
      setFilteredPolicies(policiesData);
      setCustomers(customersData);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    if (filters.status) {
      filtered = filtered.filter(policy => policy.status === filters.status);
    }
    if (filters.policyType) {
      filtered = filtered.filter(policy => policy.policyType === filters.policyType);
    }

    setFilteredPolicies(filtered);
  };

  const handleCreate = () => {
    setEditingPolicy(null);
    setShowModal(true);
  };

  const handleView = (id) => {
    const policy = policies.find(p => p.id === id);
    if (policy) {
      setSelectedPolicy(policy);
      setShowDetailsModal(true);
    }
  };

  const handleEdit = (id) => {
    // Only edit when explicitly clicking edit button, not view
    const policy = policies.find(p => p.id === id);
    if (policy) {
      setEditingPolicy(policy);
      setShowModal(true);
    }
  };

  const handleAssign = (id) => {
    setAssigningPolicyId(id);
    setSelectedCustomerId('');
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedCustomerId) {
      toast.error('Please select a customer');
      return;
    }

    try {
      await assignPolicyToCustomer(assigningPolicyId, selectedCustomerId);
      toast.success('Policy assigned successfully');
      setShowAssignModal(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to assign policy');
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingPolicy) {
        await updatePolicy(editingPolicy.id, formData);
        toast.success('Policy updated successfully');
      } else {
        await createPolicy(formData);
        toast.success('Policy created successfully');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to save policy');
      console.error(err);
    }
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

  const customerOptions = customers.map(customer => ({
    value: customer.id,
    label: `${customer.name} (${customer.email})`
  }));

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
          <h1 className="text-xl font-bold text-gray-900">Policies Management</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">Manage insurance policies</p>
        </div>
        <Button variant="default" size="sm" onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700 text-white h-8 px-3 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Create Policy
        </Button>
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
        onEdit={handleEdit}
        onAssign={handleAssign}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPolicy ? 'Edit Policy' : 'Create Policy'}
      >
        <PolicyForm
          policy={editingPolicy}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Policy to Customer"
      >
        <div className="space-y-4">
          <Select
            label="Customer"
            name="customerId"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            options={customerOptions}
            required
          />
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAssignModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleAssignSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Assign
            </Button>
          </div>
        </div>
      </Modal>

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

export default PoliciesManagement;
