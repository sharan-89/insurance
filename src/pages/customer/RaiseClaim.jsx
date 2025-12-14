import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCustomerPoliciesData } from '../../utils/customerDummyData';
import ClaimForm from '../../components/claim/ClaimForm';
import Alert from '../../components/common/Alert';
import { toast } from 'react-toastify';

const RaiseClaim = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get dummy data directly - no API calls, no storage
    const customerId = user?.customerId || 'cust_1';
    const data = getCustomerPoliciesData(customerId);
    // Only show active policies
    const activePolicies = (data || []).filter(p => p.status === 'Active');
    setPolicies(activePolicies);
  }, [user]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError('');
      
      // Simulate claim submission - no actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Claim submitted successfully!');
      navigate('/customer/claims');
    } catch (err) {
      const errorMsg = 'Failed to submit claim. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (policies.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Raise Claim</h1>
            <p className="text-[10px] text-gray-600 font-medium mt-0.5">Submit a new claim request</p>
          </div>
        </div>
        <Alert type="info" message="You need at least one active policy to raise a claim." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Raise Claim</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">Submit a new claim request</p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      <div className="max-w-2xl">
        <ClaimForm
          policies={policies}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/customer/claims')}
        />
      </div>
    </div>
  );
};

export default RaiseClaim;

