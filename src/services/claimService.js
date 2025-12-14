// Mock claim service using localStorage (no backend)
import { getStorageData, setStorageData, generateId, addActivityLog, STORAGE_KEYS } from '../utils/storage';
import { getCurrentUser } from './authService';

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generate claim number
const generateClaimNumber = () => {
  const claims = getStorageData(STORAGE_KEYS.CLAIMS);
  const year = new Date().getFullYear();
  const existingNumbers = claims
    .filter(c => c.claimNumber && c.claimNumber.startsWith(`CLM-${year}-`))
    .map(c => {
      const match = c.claimNumber.match(/CLM-\d{4}-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
  const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
  return `CLM-${year}-${String(nextNumber).padStart(3, '0')}`;
};

export const getAllClaims = async () => {
  await delay();
  const claims = getStorageData(STORAGE_KEYS.CLAIMS);
  // Enrich with policy numbers and ensure claimNumber exists
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  return claims.map(claim => {
    const policy = policies.find(p => p.id === claim.policyId);
    return {
      ...claim,
      claimNumber: claim.claimNumber || `CLM-${claim.id.replace('claim_', '')}`,
      policyNumber: policy?.policyNumber || 'N/A'
    };
  });
};

export const getClaimById = async (id) => {
  await delay();
  const claims = getStorageData(STORAGE_KEYS.CLAIMS);
  const claim = claims.find(c => c.id === id);
  if (!claim) return null;
  return {
    ...claim,
    claimNumber: claim.claimNumber || `CLM-${claim.id.replace('claim_', '')}`
  };
};

export const getCustomerClaims = async (customerId) => {
  await delay();
  const claims = getStorageData(STORAGE_KEYS.CLAIMS);
  const customerClaims = claims.filter(c => 
    c.customerId === customerId || String(c.customerId) === String(customerId)
  );
  
  // Enrich with policy numbers and ensure claimNumber exists
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  return customerClaims.map(claim => {
    const policy = policies.find(p => p.id === claim.policyId);
    return {
      ...claim,
      claimNumber: claim.claimNumber || `CLM-${claim.id.replace('claim_', '')}`,
      policyNumber: policy?.policyNumber || 'N/A'
    };
  });
};

export const createClaim = async (claimData) => {
  await delay();
  const claims = getStorageData(STORAGE_KEYS.CLAIMS);
  const newClaim = {
    id: generateId(),
    claimNumber: generateClaimNumber(),
    ...claimData,
    status: 'Submitted',
    createdAt: new Date().toISOString()
  };
  claims.push(newClaim);
  setStorageData(STORAGE_KEYS.CLAIMS, claims);
  
  const user = getCurrentUser();
  if (user) {
    addActivityLog('Claim Submitted', 'Claim', newClaim.id, user.id);
  }
  
  return newClaim;
};

export const updateClaimStatus = async (id, status, remarks) => {
  await delay();
  const claims = getStorageData(STORAGE_KEYS.CLAIMS);
  const index = claims.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Claim not found');
  
  claims[index] = {
    ...claims[index],
    status,
    remarks: remarks || claims[index].remarks,
    updatedAt: new Date().toISOString()
  };
  setStorageData(STORAGE_KEYS.CLAIMS, claims);
  
  const user = getCurrentUser();
  if (user) {
    addActivityLog(`Claim ${status}`, 'Claim', id, user.id);
  }
  
  return claims[index];
};

export const filterClaims = async (filters) => {
  await delay();
  let claims = getStorageData(STORAGE_KEYS.CLAIMS);
  
  if (filters.status) {
    claims = claims.filter(c => c.status === filters.status);
  }
  if (filters.startDate) {
    claims = claims.filter(c => new Date(c.claimDate) >= new Date(filters.startDate));
  }
  if (filters.endDate) {
    claims = claims.filter(c => new Date(c.claimDate) <= new Date(filters.endDate));
  }
  
  // Enrich with policy numbers and ensure claimNumber exists
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  return claims.map(claim => {
    const policy = policies.find(p => p.id === claim.policyId);
    return {
      ...claim,
      claimNumber: claim.claimNumber || `CLM-${claim.id.replace('claim_', '')}`,
      policyNumber: policy?.policyNumber || 'N/A'
    };
  });
};
