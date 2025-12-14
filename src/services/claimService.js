// Mock claim service using localStorage (no backend)
import { getStorageData, setStorageData, generateId, addActivityLog, STORAGE_KEYS } from '../utils/storage';
import { getCurrentUser } from './authService';
import { toCamelCase, toSnakeCase } from '../utils/dataMapper';

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generate claim number (not stored in DB, but used for display)
const generateClaimNumber = () => {
  const claims = getStorageData(STORAGE_KEYS.CLAIMS);
  const year = new Date().getFullYear();
  const existingNumbers = claims
    .filter(c => {
      // Check if claim has a generated number in id or use index
      return c.id && c.id.includes('claim');
    })
    .map((c, index) => index + 1);
  const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
  return `CLM-${year}-${String(nextNumber).padStart(3, '0')}`;
};

export const getAllClaims = async () => {
  await delay();
  const claims = getStorageData(STORAGE_KEYS.CLAIMS);
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  return claims.map(claim => {
    const camelClaim = toCamelCase(claim);
    const policy = policies.find(p => p.id === claim.policy_id);
    return {
      ...camelClaim,
      claimNumber: generateClaimNumber(), // Generate for display
      policyNumber: policy?.policy_number || 'N/A',
      createdAt: claim.created_at || new Date().toISOString()
    };
  });
};

export const getClaimById = async (id) => {
  await delay();
  const claims = getStorageData(STORAGE_KEYS.CLAIMS);
  const claim = claims.find(c => c.id === id);
  if (!claim) return null;
  const camelClaim = toCamelCase(claim);
  return {
    ...camelClaim,
    claimNumber: generateClaimNumber(),
    createdAt: claim.created_at || new Date().toISOString()
  };
};

export const getCustomerClaims = async (customerId) => {
  await delay();
  const claims = getStorageData(STORAGE_KEYS.CLAIMS);
  const customers = getStorageData(STORAGE_KEYS.CUSTOMERS);
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  
  if (!customerId) {
    console.warn('getCustomerClaims: No customerId provided');
    return [];
  }
  
  // If customerId is a username, try to find the actual customer ID
  let actualCustomerId = customerId;
  if (customerId && !customerId.startsWith('cust_')) {
    const customer = customers.find(c => {
      const nameMatch = c.name.toLowerCase().includes(customerId.toLowerCase());
      const emailMatch = c.email.toLowerCase().includes(customerId.toLowerCase());
      return nameMatch || emailMatch;
    });
    if (customer) {
      actualCustomerId = customer.id;
    }
  }
  
  const customerClaims = claims.filter(c => {
    const cId = String(c.customer_id);
    const searchId = String(actualCustomerId);
    return cId === searchId;
  });
  
  const mappedClaims = customerClaims.map(claim => {
    const camelClaim = toCamelCase(claim);
    const policy = policies.find(p => p.id === claim.policy_id);
    return {
      ...camelClaim,
      claimNumber: generateClaimNumber(),
      policyNumber: policy?.policy_number || 'N/A',
      createdAt: claim.created_at || new Date().toISOString()
    };
  });
  
  console.log('getCustomerClaims:', {
    customerId,
    actualCustomerId,
    claimsCount: customerClaims.length,
    mappedClaimsCount: mappedClaims.length
  });
  
  return mappedClaims;
};

export const createClaim = async (claimData) => {
  await delay();
  const claims = getStorageData(STORAGE_KEYS.CLAIMS);
  const snakeData = toSnakeCase({
    ...claimData,
    status: 'Submitted'
  });
  const newClaim = {
    id: generateId(),
    ...snakeData,
    created_at: new Date().toISOString()
  };
  claims.push(newClaim);
  setStorageData(STORAGE_KEYS.CLAIMS, claims);
  
  const user = getCurrentUser();
  if (user) {
    addActivityLog('Claim Submitted', 'Claim', newClaim.id, user.id);
  }
  
  return {
    ...toCamelCase(newClaim),
    claimNumber: generateClaimNumber(),
    createdAt: newClaim.created_at
  };
};

export const updateClaimStatus = async (id, status, remarks) => {
  await delay();
  const claims = getStorageData(STORAGE_KEYS.CLAIMS);
  const index = claims.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Claim not found');
  
  claims[index] = {
    ...claims[index],
    status,
    remarks: remarks || claims[index].remarks || ''
  };
  setStorageData(STORAGE_KEYS.CLAIMS, claims);
  
  const user = getCurrentUser();
  if (user) {
    addActivityLog(`Claim ${status}`, 'Claim', id, user.id);
  }
  
  return {
    ...toCamelCase(claims[index]),
    claimNumber: generateClaimNumber(),
    createdAt: claims[index].created_at || new Date().toISOString()
  };
};

export const filterClaims = async (filters) => {
  await delay();
  let claims = getStorageData(STORAGE_KEYS.CLAIMS);
  
  if (filters.status) {
    claims = claims.filter(c => c.status === filters.status);
  }
  if (filters.startDate) {
    claims = claims.filter(c => new Date(c.claim_date) >= new Date(filters.startDate));
  }
  if (filters.endDate) {
    claims = claims.filter(c => new Date(c.claim_date) <= new Date(filters.endDate));
  }
  
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  return claims.map(claim => {
    const camelClaim = toCamelCase(claim);
    const policy = policies.find(p => p.id === claim.policy_id);
    return {
      ...camelClaim,
      claimNumber: generateClaimNumber(),
      policyNumber: policy?.policy_number || 'N/A',
      createdAt: claim.created_at || new Date().toISOString()
    };
  });
};
