// Mock customer service using localStorage (no backend)
import { getStorageData, setStorageData, generateId, addActivityLog, STORAGE_KEYS } from '../utils/storage';
import { getCurrentUser } from './authService';
import { toCamelCase, toSnakeCase } from '../utils/dataMapper';

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllCustomers = async () => {
  await delay();
  const customers = getStorageData(STORAGE_KEYS.CUSTOMERS);
  return customers.map(toCamelCase);
};

export const getCustomerById = async (id) => {
  await delay();
  const customers = getStorageData(STORAGE_KEYS.CUSTOMERS);
  const customer = customers.find(c => c.id === id);
  return customer ? toCamelCase(customer) : null;
};

export const createCustomer = async (customerData) => {
  await delay();
  const customers = getStorageData(STORAGE_KEYS.CUSTOMERS);
  const snakeData = toSnakeCase(customerData);
  const newCustomer = {
    id: generateId(),
    ...snakeData
  };
  customers.push(newCustomer);
  setStorageData(STORAGE_KEYS.CUSTOMERS, customers);
  
  const user = getCurrentUser();
  if (user) {
    addActivityLog('Customer Created', 'Customer', newCustomer.id, user.id);
  }
  
  return toCamelCase(newCustomer);
};

export const updateCustomer = async (id, customerData) => {
  await delay();
  const customers = getStorageData(STORAGE_KEYS.CUSTOMERS);
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Customer not found');
  
  const snakeData = toSnakeCase(customerData);
  customers[index] = {
    ...customers[index],
    ...snakeData
  };
  setStorageData(STORAGE_KEYS.CUSTOMERS, customers);
  
  const user = getCurrentUser();
  if (user) {
    addActivityLog('Customer Updated', 'Customer', id, user.id);
  }
  
  return toCamelCase(customers[index]);
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
