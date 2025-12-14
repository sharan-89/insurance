// Mock activity service using localStorage (no backend)
import { getStorageData, STORAGE_KEYS } from '../utils/storage';

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const getActivityLogs = async () => {
  await delay();
  return getStorageData(STORAGE_KEYS.ACTIVITY_LOGS);
};

export const getActivityLogsByType = async (type) => {
  await delay();
  const logs = getStorageData(STORAGE_KEYS.ACTIVITY_LOGS);
  return logs.filter(log => log.entityType === type);
};
