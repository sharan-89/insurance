import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../services/customerService';
import CustomerList from '../../components/customer/CustomerList';
import CustomerForm from '../../components/customer/CustomerForm';
import CustomerDetailsModal from '../../components/customer/CustomerDetailsModal';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import SearchInput from '../../components/common/SearchInput';
import AdvancedFilter from '../../components/common/AdvancedFilter';
import { toast } from 'react-toastify';

const CustomersManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchQuery, filters]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (err) {
      setError('Failed to load customers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = [...customers];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(customer =>
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.includes(searchQuery)
      );
    }

    // Advanced filters
    if (filters.status) {
      // Add status filter if needed
    }

    setFilteredCustomers(filtered);
  };

  const handleCreate = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleView = (id) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setSelectedCustomer(customer);
      setShowDetailsModal(true);
    }
  };

  const handleEdit = (id) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setEditingCustomer(customer);
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      await deleteCustomer(id);
      toast.success('Customer deleted successfully');
      fetchCustomers();
    } catch (err) {
      toast.error('Failed to delete customer');
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
        toast.success('Customer updated successfully');
      } else {
        await createCustomer(formData);
        toast.success('Customer created successfully');
      }
      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      toast.error('Failed to save customer');
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

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customers Management</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">Manage customer information</p>
        </div>
        <Button variant="default" size="sm" onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700 text-white h-8 px-3 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search customers by name, email, or phone..."
        />
        <AdvancedFilter
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleFilterReset}
        />
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      <CustomerList
        customers={filteredCustomers}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCustomer ? 'Edit Customer' : 'Create Customer'}
      >
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CustomersManagement;
