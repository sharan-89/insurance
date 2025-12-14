// Mock policy service using localStorage (no backend)
import { getStorageData, setStorageData, generateId, addActivityLog, STORAGE_KEYS } from '../utils/storage';
import { getCurrentUser } from './authService';

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllPolicies = async () => {
  await delay();
  return getStorageData(STORAGE_KEYS.POLICIES);
};

export const getPolicyById = async (id) => {
  await delay();
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  return policies.find(p => p.id === id) || null;
};

export const getCustomerPolicies = async (customerId) => {
  await delay();
  const customerPolicies = getStorageData(STORAGE_KEYS.CUSTOMER_POLICIES);
  const policyIds = customerPolicies
    .filter(cp => cp.customerId === customerId || String(cp.customerId) === String(customerId))
    .map(cp => cp.policyId);
  
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  return policies.filter(p => policyIds.includes(p.id));
};

export const createPolicy = async (policyData) => {
  await delay();
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  const newPolicy = {
    id: generateId(),
    ...policyData,
    createdAt: new Date().toISOString()
  };
  policies.push(newPolicy);
  setStorageData(STORAGE_KEYS.POLICIES, policies);
  
  const user = getCurrentUser();
  if (user) {
    addActivityLog('Policy Created', 'Policy', newPolicy.id, user.id);
  }
  
  return newPolicy;
};

export const updatePolicy = async (id, policyData) => {
  await delay();
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  const index = policies.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Policy not found');
  
  policies[index] = {
    ...policies[index],
    ...policyData,
    updatedAt: new Date().toISOString()
  };
  setStorageData(STORAGE_KEYS.POLICIES, policies);
  
  const user = getCurrentUser();
  if (user) {
    addActivityLog('Policy Updated', 'Policy', id, user.id);
  }
  
  return policies[index];
};

export const assignPolicyToCustomer = async (policyId, customerId) => {
  await delay();
  const customerPolicies = getStorageData(STORAGE_KEYS.CUSTOMER_POLICIES);
  
  // Check if already assigned
  const exists = customerPolicies.some(
    cp => cp.policyId === policyId && cp.customerId === customerId
  );
  
  if (!exists) {
    customerPolicies.push({
      id: generateId(),
      policyId,
      customerId,
      assignedAt: new Date().toISOString()
    });
    setStorageData(STORAGE_KEYS.CUSTOMER_POLICIES, customerPolicies);
    
    const user = getCurrentUser();
    if (user) {
      addActivityLog('Policy Assigned', 'Policy', policyId, user.id);
    }
  }
  
  return { success: true };
};

export const searchPolicies = async (query) => {
  await delay();
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  if (!query) return policies;
  
  const lowerQuery = query.toLowerCase();
  return policies.filter(
    policy =>
      policy.policyNumber?.toLowerCase().includes(lowerQuery) ||
      policy.policyType?.toLowerCase().includes(lowerQuery)
  );
};
