import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { POLICY_TYPES, POLICY_STATUS } from '../../utils/constants';
import { validateForm } from '../../utils/validators';

const PolicyForm = ({ policy, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    policyNumber: '',
    policyType: '',
    premiumAmount: '',
    startDate: '',
    endDate: '',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (policy) {
      setFormData({
        policyNumber: policy.policyNumber || '',
        policyType: policy.policyType || '',
        premiumAmount: policy.premiumAmount || '',
        startDate: policy.startDate ? policy.startDate.split('T')[0] : '',
        endDate: policy.endDate ? policy.endDate.split('T')[0] : '',
        status: policy.status || 'Active'
      });
    }
  }, [policy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData, {
      policyNumber: { required: true, minLength: 5 },
      policyType: { required: true },
      premiumAmount: { required: true, amount: true },
      startDate: { required: true, date: true },
      endDate: { required: true, date: true }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  const policyTypeOptions = POLICY_TYPES.map(type => ({
    value: type,
    label: type
  }));

  const statusOptions = POLICY_STATUS.map(status => ({
    value: status,
    label: status
  }));

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Policy Number"
        name="policyNumber"
        value={formData.policyNumber}
        onChange={handleChange}
        error={errors.policyNumber}
        required
      />

      <Select
        label="Policy Type"
        name="policyType"
        value={formData.policyType}
        onChange={handleChange}
        options={policyTypeOptions}
        error={errors.policyType}
        required
      />

      <Input
        label="Premium Amount"
        name="premiumAmount"
        type="number"
        step="0.01"
        value={formData.premiumAmount}
        onChange={handleChange}
        error={errors.premiumAmount}
        required
      />

      <Input
        label="Start Date"
        name="startDate"
        type="date"
        value={formData.startDate}
        onChange={handleChange}
        error={errors.startDate}
        required
      />

      <Input
        label="End Date"
        name="endDate"
        type="date"
        value={formData.endDate}
        onChange={handleChange}
        error={errors.endDate}
        required
      />

      <Select
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={statusOptions}
        required
      />

      <div className="form-actions">
        <Button type="submit" variant="primary">
          {policy ? 'Update' : 'Create'} Policy
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default PolicyForm;

