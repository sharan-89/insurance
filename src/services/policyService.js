// Mock policy service using localStorage (no backend)
import { getStorageData, setStorageData, generateId, addActivityLog, STORAGE_KEYS } from '../utils/storage';
import { getCurrentUser } from './authService';
import { toCamelCase, toSnakeCase } from '../utils/dataMapper';

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllPolicies = async () => {
  await delay();
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  return policies.map(toCamelCase);
};

export const getPolicyById = async (id) => {
  await delay();
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  const policy = policies.find(p => p.id === id);
  return policy ? toCamelCase(policy) : null;
};

export const getCustomerPolicies = async (customerId) => {
  await delay();
  const customerPolicies = getStorageData(STORAGE_KEYS.CUSTOMER_POLICIES);
  const customers = getStorageData(STORAGE_KEYS.CUSTOMERS);
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  
  if (!customerId) {
    console.warn('getCustomerPolicies: No customerId provided');
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
  
  const policyIds = customerPolicies
    .filter(cp => {
      const cpId = String(cp.customer_id);
      const searchId = String(actualCustomerId);
      return cpId === searchId;
    })
    .map(cp => cp.policy_id);
  
  const matchedPolicies = policies.filter(p => policyIds.includes(p.id)).map(toCamelCase);
  
  console.log('getCustomerPolicies:', {
    customerId,
    actualCustomerId,
    policyIds,
    matchedPoliciesCount: matchedPolicies.length
  });
  
  return matchedPolicies;
};

export const createPolicy = async (policyData) => {
  await delay();
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  // Generate policy_number if not provided
  const year = new Date().getFullYear();
  const existingNumbers = policies
    .filter(p => p.policy_number && p.policy_number.startsWith(`POL-${year}-`))
    .map(p => {
      const match = p.policy_number.match(/POL-\d{4}-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
  const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
  const policyNumber = policyData.policyNumber || `POL-${year}-${String(nextNumber).padStart(3, '0')}`;
  
  const snakeData = toSnakeCase({
    ...policyData,
    policyNumber
  });
  const newPolicy = {
    id: generateId(),
    ...snakeData
  };
  policies.push(newPolicy);
  setStorageData(STORAGE_KEYS.POLICIES, policies);
  
  const user = getCurrentUser();
  if (user) {
    addActivityLog('Policy Created', 'Policy', newPolicy.id, user.id);
  }
  
  return toCamelCase(newPolicy);
};

export const updatePolicy = async (id, policyData) => {
  await delay();
  const policies = getStorageData(STORAGE_KEYS.POLICIES);
  const index = policies.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Policy not found');
  
  const snakeData = toSnakeCase(policyData);
  policies[index] = {
    ...policies[index],
    ...snakeData
  };
  setStorageData(STORAGE_KEYS.POLICIES, policies);
  
  const user = getCurrentUser();
  if (user) {
    addActivityLog('Policy Updated', 'Policy', id, user.id);
  }
  
  return toCamelCase(policies[index]);
};

export const assignPolicyToCustomer = async (policyId, customerId) => {
  await delay();
  const customerPolicies = getStorageData(STORAGE_KEYS.CUSTOMER_POLICIES);
  
  // Check if already assigned
  const exists = customerPolicies.some(
    cp => cp.policy_id === policyId && cp.customer_id === customerId
  );
  
  if (!exists) {
    customerPolicies.push({
      id: generateId(),
      policy_id: policyId,
      customer_id: customerId
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
  if (!query) return policies.map(toCamelCase);
  
  const lowerQuery = query.toLowerCase();
  return policies.filter(
    policy =>
      policy.policy_number?.toLowerCase().includes(lowerQuery) ||
      policy.policy_type?.toLowerCase().includes(lowerQuery)
  ).map(toCamelCase);
};
