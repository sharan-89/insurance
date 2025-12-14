// Mock authentication - accepts any credentials (no backend required)
export const login = async (username, password, role) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Accept any login credentials - no backend required
  const mockToken = `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  // For customers, map to existing customer IDs
  let customerId = null;
  if (role === 'Customer') {
    // Map username to existing customer IDs (cust_1 to cust_8)
    // Use first customer by default, or map based on username
    const usernameLower = username.toLowerCase();
    // Try to match existing customers
    const customerMap = {
      'john': 'cust_1',
      'john smith': 'cust_1',
      'sarah': 'cust_2',
      'sarah johnson': 'cust_2',
      'michael': 'cust_3',
      'michael brown': 'cust_3',
      'emily': 'cust_4',
      'emily davis': 'cust_4',
      'david': 'cust_5',
      'david wilson': 'cust_5',
      'lisa': 'cust_6',
      'lisa anderson': 'cust_6',
      'robert': 'cust_7',
      'robert taylor': 'cust_7',
      'jennifer': 'cust_8',
      'jennifer martinez': 'cust_8'
    };
    // Find matching customer or use first one
    customerId = customerMap[usernameLower] || 'cust_1';
  }
  
  const mockUser = {
    id: Math.floor(Math.random() * 1000),
    username: username,
    role: role,
    customerId: customerId
  };
  
  localStorage.setItem('token', mockToken);
  localStorage.setItem('user', JSON.stringify(mockUser));
  
  return {
    token: mockToken,
    user: mockUser
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getMe = async () => {
  // Return current user from localStorage (no backend call)
  return getCurrentUser();
};

