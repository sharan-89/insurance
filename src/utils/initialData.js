// Initial dummy data for the application - Enhanced with more data

export const getInitialCustomers = () => [
  {
    id: 'cust_1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '555-0101',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cust_2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '555-0102',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cust_3',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '555-0103',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cust_4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '555-0104',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cust_5',
    name: 'David Wilson',
    email: 'david.w@email.com',
    phone: '555-0105',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cust_6',
    name: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    phone: '555-0106',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cust_7',
    name: 'Robert Taylor',
    email: 'robert.t@email.com',
    phone: '555-0107',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cust_8',
    name: 'Jennifer Martinez',
    email: 'jennifer.m@email.com',
    phone: '555-0108',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const getInitialPolicies = () => [
  {
    id: 'pol_1',
    policyNumber: 'POL-2024-001',
    policyType: 'Health',
    premiumAmount: 450.00,
    startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pol_2',
    policyNumber: 'POL-2024-002',
    policyType: 'Auto',
    premiumAmount: 320.50,
    startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pol_3',
    policyNumber: 'POL-2024-003',
    policyType: 'Life',
    premiumAmount: 1250.00,
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pol_4',
    policyNumber: 'POL-2024-004',
    policyType: 'Home',
    premiumAmount: 680.75,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pol_5',
    policyNumber: 'POL-2024-005',
    policyType: 'Travel',
    premiumAmount: 150.00,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pol_6',
    policyNumber: 'POL-2024-006',
    policyType: 'Health',
    premiumAmount: 520.00,
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pol_7',
    policyNumber: 'POL-2024-007',
    policyType: 'Auto',
    premiumAmount: 380.25,
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 345 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pol_8',
    policyNumber: 'POL-2024-008',
    policyType: 'Life',
    premiumAmount: 980.50,
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pol_9',
    policyNumber: 'POL-2023-101',
    policyType: 'Auto',
    premiumAmount: 280.00,
    startDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Expired',
    createdAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pol_10',
    policyNumber: 'POL-2023-102',
    policyType: 'Health',
    premiumAmount: 420.00,
    startDate: new Date(Date.now() - 380 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Expired',
    createdAt: new Date(Date.now() - 380 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const getInitialCustomerPolicies = () => [
  { id: 'cp_1', policyId: 'pol_1', customerId: 'cust_1', assignedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'cp_2', policyId: 'pol_2', customerId: 'cust_1', assignedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'cp_3', policyId: 'pol_3', customerId: 'cust_2', assignedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'cp_4', policyId: 'pol_4', customerId: 'cust_2', assignedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'cp_5', policyId: 'pol_5', customerId: 'cust_3', assignedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'cp_6', policyId: 'pol_6', customerId: 'cust_4', assignedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'cp_7', policyId: 'pol_7', customerId: 'cust_5', assignedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'cp_8', policyId: 'pol_8', customerId: 'cust_6', assignedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() }
];

export const getInitialClaims = () => [
  {
    id: 'claim_1',
    claimNumber: 'CLM-2024-001',
    customerId: 'cust_1',
    policyId: 'pol_1',
    claimDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claimAmount: 2500.00,
    status: 'Approved',
    description: 'Medical expenses for emergency surgery. All documents submitted.',
    remarks: 'Claim approved after review. Payment processed.',
    evidenceUrl: 'https://example.com/evidence1.pdf',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_2',
    claimNumber: 'CLM-2024-002',
    customerId: 'cust_1',
    policyId: 'pol_2',
    claimDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claimAmount: 3500.00,
    status: 'In Review',
    description: 'Vehicle accident on highway. Police report attached.',
    remarks: 'Under review by claims department.',
    evidenceUrl: 'https://example.com/evidence2.pdf',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_3',
    claimNumber: 'CLM-2024-003',
    customerId: 'cust_2',
    policyId: 'pol_3',
    claimDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claimAmount: 15000.00,
    status: 'Submitted',
    description: 'Life insurance claim. Beneficiary documentation provided.',
    remarks: '',
    evidenceUrl: 'https://example.com/evidence3.pdf',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_4',
    claimNumber: 'CLM-2024-004',
    customerId: 'cust_2',
    policyId: 'pol_4',
    claimDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claimAmount: 8500.00,
    status: 'Approved',
    description: 'Home damage due to storm. Inspection completed.',
    remarks: 'Approved. Settlement amount processed.',
    evidenceUrl: 'https://example.com/evidence4.pdf',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_5',
    claimNumber: 'CLM-2024-005',
    customerId: 'cust_3',
    policyId: 'pol_5',
    claimDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claimAmount: 1200.00,
    status: 'Rejected',
    description: 'Travel insurance claim for cancelled trip.',
    remarks: 'Claim rejected. Trip cancellation not covered under policy terms.',
    evidenceUrl: 'https://example.com/evidence5.pdf',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_6',
    claimNumber: 'CLM-2024-006',
    customerId: 'cust_4',
    policyId: 'pol_6',
    claimDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claimAmount: 3200.00,
    status: 'In Review',
    description: 'Health insurance claim for hospital stay.',
    remarks: 'Medical records under review.',
    evidenceUrl: 'https://example.com/evidence6.pdf',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_7',
    claimNumber: 'CLM-2024-007',
    customerId: 'cust_5',
    policyId: 'pol_7',
    claimDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claimAmount: 4500.00,
    status: 'Submitted',
    description: 'Auto insurance claim for vehicle damage.',
    remarks: '',
    evidenceUrl: 'https://example.com/evidence7.pdf',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_8',
    claimNumber: 'CLM-2024-008',
    customerId: 'cust_6',
    policyId: 'pol_8',
    claimDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claimAmount: 9500.00,
    status: 'Approved',
    description: 'Life insurance claim processed successfully.',
    remarks: 'All documentation verified. Payment approved.',
    evidenceUrl: 'https://example.com/evidence8.pdf',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const getInitialActivityLogs = () => [
  {
    id: 'act_1',
    action: 'Policy Created',
    entityType: 'Policy',
    entityId: 'pol_1',
    userId: 'admin_1',
    timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_2',
    action: 'Claim Submitted',
    entityType: 'Claim',
    entityId: 'claim_1',
    userId: 'cust_1',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_3',
    action: 'Claim Approved',
    entityType: 'Claim',
    entityId: 'claim_1',
    userId: 'admin_1',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_4',
    action: 'Customer Created',
    entityType: 'Customer',
    entityId: 'cust_1',
    userId: 'admin_1',
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_5',
    action: 'Policy Assigned',
    entityType: 'Policy',
    entityId: 'pol_1',
    userId: 'admin_1',
    timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_6',
    action: 'Claim Submitted',
    entityType: 'Claim',
    entityId: 'claim_2',
    userId: 'cust_1',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_7',
    action: 'Policy Updated',
    entityType: 'Policy',
    entityId: 'pol_3',
    userId: 'admin_1',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_8',
    action: 'Customer Updated',
    entityType: 'Customer',
    entityId: 'cust_2',
    userId: 'admin_1',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];
