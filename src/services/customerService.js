// Mock customer service using localStorage (no backend)
import { getStorageData, setStorageData, generateId, addActivityLog, STORAGE_KEYS } from '../utils/storage';
import { getCurrentUser } from './authService';

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllCustomers = async () => {
  await delay();
  return getStorageData(STORAGE_KEYS.CUSTOMERS);
};

export const getCustomerById = async (id) => {
  await delay();
  const customers = getStorageData(STORAGE_KEYS.CUSTOMERS);
  return customers.find(c => c.id === id) || null;
};

export const createCustomer = async (customerData) => {
  await delay();
  const customers = getStorageData(STORAGE_KEYS.CUSTOMERS);
  const newCustomer = {
    id: generateId(),
    ...customerData,
    createdAt: new Date().toISOString()
  };
  customers.push(newCustomer);
  setStorageData(STORAGE_KEYS.CUSTOMERS, customers);
  
  const user = getCurrentUser();
  if (user) {
    addActivityLog('Customer Created', 'Customer', newCustomer.id, user.id);
  }
  
  return newCustomer;
};

export const updateCustomer = async (id, customerData) => {
  await delay();
  const customers = getStorageData(STORAGE_KEYS.CUSTOMERS);
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Customer not found');
  
  customers[index] = {
    ...customers[index],
    ...customerData,
    updatedAt: new Date().toISOString()
  };
  setStorageData(STORAGE_KEYS.CUSTOMERS, customers);
  
  const user = getCurrentUser();
  if (user) {
    addActivityLog('Customer Updated', 'Customer', id, user.id);
  }
  
  return customers[index];
};

export const deleteCustomer = async (id) => {
  await delay();
  const customers = getStorageData(STORAGE_KEYS.CUSTOMERS);
  const filtered = customers.filter(c => c.id !== id);
  setStorageData(STORAGE_KEYS.CUSTOMERS, filtered);
  
  const user = getCurrentUser();
  if (user) {
    addActivityLog('Customer Deleted', 'Customer', id, user.id);
  }
  
  return { success: true };
};
