// Mock authentication - accepts any credentials (no backend required)
// Static user data - no storage access
const staticUsers = [
  { id: 'user_1', username: 'admin', role: 'Admin' },
  { id: 'user_2', username: 'john', role: 'Customer' },
  { id: 'user_3', username: 'sarah', role: 'Customer' },
  { id: 'user_4', username: 'michael', role: 'Customer' },
  { id: 'user_5', username: 'emily', role: 'Customer' },
  { id: 'user_6', username: 'david', role: 'Customer' },
  { id: 'user_7', username: 'lisa', role: 'Customer' },
  { id: 'user_8', username: 'robert', role: 'Customer' },
  { id: 'user_9', username: 'jennifer', role: 'Customer' }
];

const staticCustomers = [
  { id: 'cust_1', name: 'John Smith', linked_user_id: 'user_2' },
  { id: 'cust_2', name: 'Sarah Johnson', linked_user_id: 'user_3' },
  { id: 'cust_3', name: 'Michael Brown', linked_user_id: 'user_4' },
  { id: 'cust_4', name: 'Emily Davis', linked_user_id: 'user_5' },
  { id: 'cust_5', name: 'David Wilson', linked_user_id: 'user_6' },
  { id: 'cust_6', name: 'Lisa Anderson', linked_user_id: 'user_7' },
  { id: 'cust_7', name: 'Robert Taylor', linked_user_id: 'user_8' },
  { id: 'cust_8', name: 'Jennifer Martinez', linked_user_id: 'user_9' }
];

export const login = async (username, password, role) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Use static data - no storage access
  const users = staticUsers;
  const customers = staticCustomers;
  
  // Find user by username and role
  let user = users.find(u => 
    u.username.toLowerCase() === username.toLowerCase() && u.role === role
  );
  
  // If user not found but role matches, try to find by customer name
  if (!user && role === 'Customer') {
    const customer = customers.find(c => {
      const customerName = c.name.toLowerCase();
      return customerName.includes(username.toLowerCase()) || 
             username.toLowerCase() === customerName.split(' ')[0];
    });
    
    if (customer) {
      // Find the linked user
      user = users.find(u => u.id === customer.linked_user_id);
    }
  }
  
  // If still not found, create a mock user (accepts any credentials)
  if (!user) {
    user = {
      id: `user_${Date.now()}`,
      username: username,
      role: role,
      password_hash: '$2b$10$mock_hash'
    };
  }
  
  // For customers, find the linked customer
  let customerId = null;
  let linkedUserId = null;
  if (user && user.role === 'Customer') {
    // First try: find customer by linked_user_id
    const customer = customers.find(c => c.linked_user_id === user.id);
    if (customer) {
      customerId = customer.id;
      linkedUserId = user.id;
    } else {
      // Fallback: try to find customer by username match
      const usernameLower = username.toLowerCase();
      const customerByName = customers.find(c => {
        const customerName = c.name.toLowerCase();
        return customerName.includes(usernameLower) || 
               usernameLower === customerName.split(' ')[0];
      });
      if (customerByName) {
        customerId = customerByName.id;
        linkedUserId = customerByName.linked_user_id;
      } else {
        // Last resort: assign to first available customer (for testing)
        // This ensures customerId is always set
        if (customers.length > 0) {
          // Map common usernames to customer IDs
          const usernameMap = {
            'john': 'cust_1',
            'sarah': 'cust_2',
            'michael': 'cust_3',
            'emily': 'cust_4',
            'david': 'cust_5',
            'lisa': 'cust_6',
            'robert': 'cust_7',
            'jennifer': 'cust_8'
          };
          customerId = usernameMap[usernameLower] || customers[0].id;
          linkedUserId = customers.find(c => c.id === customerId)?.linked_user_id || user.id;
        }
      }
    }
  }
  
  // Generate mock token
  const mockToken = `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Build user response matching API structure
  const userResponse = {
    id: user.id,
    username: user.username,
    role: user.role,
    status: 'Active',
    lastLogin: new Date().toISOString(),
    createdAt: user.createdAt || new Date().toISOString(),
    ...(customerId && { customerId, linkedUserId })
  };
  
  // Debug log
  if (user.role === 'Customer') {
    console.log('Customer Login Debug:', {
      username,
      userId: user.id,
      customerId,
      linkedUserId,
      userResponse
    });
  }
  
  localStorage.setItem('token', mockToken);
  localStorage.setItem('user', JSON.stringify(userResponse));
  
  return {
    success: true,
    token: mockToken,
    user: userResponse
  };
};

export const logout = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  } catch (e) {
    // Ignore storage errors
  }
};

export const getCurrentUser = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
  } catch (e) {
    // Ignore storage errors
  }
  return null;
};

export const getToken = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
  } catch (e) {
    // Ignore storage errors
  }
  return null;
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getMe = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return current user from localStorage (no backend call)
  const user = getCurrentUser();
  if (!user) {
    return null;
  }
  
  // Return in API response format
  return {
    success: true,
    user: user
  };
};

