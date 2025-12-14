import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCustomerPolicies } from '../../services/policyService';
import { createClaim } from '../../services/claimService';
import ClaimForm from '../../components/claim/ClaimForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { toast } from 'react-toastify';

const RaiseClaim = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const customerId = user?.customerId || user?.username;
        if (customerId) {
          const data = await getCustomerPolicies(customerId);
          // Only show active policies
          const activePolicies = data.filter(p => p.status === 'Active');
          setPolicies(activePolicies);
        }
      } catch (err) {
        setError('Failed to load policies. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [user]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError('');
      
      const customerId = user?.customerId || user?.username;
      const claimData = {
        ...formData,
        customerId
      };

      await createClaim(claimData);
      toast.success('Claim submitted successfully!');
      navigate('/customer/claims');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit claim. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

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

