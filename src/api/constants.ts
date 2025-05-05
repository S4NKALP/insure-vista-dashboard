// API Constants
// export const API_URL =  'http://192.168.1.80:8000/api';
export const API_URL =  'http://192.168.1.80:8000/api';

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/login/',
  LOGOUT: '/logout/',
  
  // User Management
  USERS: '/user/',
  
  // Branch Management
  BRANCHES: '/branches/',
  
  // Agent Management
  AGENTS: '/agents/',
  AGENT_APPLICATIONS: '/agent-applications/',
  AGENT_REPORTS: '/agent-reports/',
  
  // Customer Management
  CUSTOMERS: '/customers/',
  
  // Policy Management
  POLICIES: '/insurance-policies/',
  POLICY_HOLDERS: '/policy-holders/',
  
  // Claims
  CLAIM_REQUESTS: '/claim-requests/',
  CLAIM_PROCESSING: '/claim-processing/',
  
  // Others
  COMPANIES: '/companies/',
  DASHBOARD: '/home/',
};

// Other API settings
export const API_TIMEOUT = 30000; // 30 seconds
export const RETRY_COUNT = 2;

// API endpoint constants

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login/',
    LOGOUT: '/auth/logout/',
    REFRESH: '/auth/refresh-token/',
  },
  
  // Users
  USERS: {
    LIST: '/users/',
    DETAIL: (id: number) => `/users/${id}/`,
    CREATE: '/users/',
    UPDATE: (id: number) => `/users/${id}/`,
    DELETE: (id: number) => `/users/${id}/`,
  },
  
  // Branch
  BRANCHES: {
    LIST: '/branches/',
    DETAIL: (id: number) => `/branches/${id}/`,
    CREATE: '/branches/',
    UPDATE: (id: number) => `/branches/${id}/`,
    DELETE: (id: number) => `/branches/${id}/`,
  },
  
  // Companies
  COMPANIES: {
    LIST: '/companies/',
    DETAIL: (id: number) => `/companies/${id}/`,
    CREATE: '/companies/',
    UPDATE: (id: number) => `/companies/${id}/`,
    DELETE: (id: number) => `/companies/${id}/`,
  },
  
  // Policies
  POLICIES: {
    LIST: '/policies/',
    DETAIL: (id: number) => `/policies/${id}/`,
    CREATE: '/policies/',
    UPDATE: (id: number) => `/policies/${id}/`,
    DELETE: (id: number) => `/policies/${id}/`,
  },
  
  // Policy Holders
  POLICY_HOLDERS: {
    LIST: '/policy-holders/',
    BY_BRANCH: (branchId: number) => `/policy-holders/?branch=${branchId}`,
    DETAIL: (id: number) => `/policy-holders/${id}/`,
    CREATE: '/policy-holders/',
    UPDATE: (id: number) => `/policy-holders/${id}/`,
    DELETE: (id: number) => `/policy-holders/${id}/`,
  },
  
  // Agents
  AGENTS: {
    LIST: '/sales-agents/',
    BY_BRANCH: (branchId: number) => `/sales-agents/branch=${branchId}`,
    DETAIL: (id: number) => `/sales-agents/${id}/`,
    CREATE: '/sales-agents/',
    UPDATE: (id: number) => `/sales-agents/${id}/`,
    DELETE: (id: number) => `/salles-agents/${id}/`,
  },
  
  // Agent Applications
  AGENT_APPLICATIONS: {
    LIST: '/agent-applications/',
    BY_BRANCH: (branchId: number) => `/agent-applications/?branch=${branchId}`,
    DETAIL: (id: number) => `/agent-applications/${id}/`,
    CREATE: '/agent-applications/',
    UPDATE: (id: number) => `/agent-applications/${id}/`,
    UPDATE_STATUS: (id: number) => `/agent-applications/${id}/status/`,
    DELETE: (id: number) => `/agent-applications/${id}/`,
  },
  
  // Agent Reports
  AGENT_REPORTS: {
    LIST: '/agent-reports/',
    BY_BRANCH: (branchId: number) => `/agent-reports/?branch=${branchId}`,
    DETAIL: (id: number) => `/agent-reports/${id}/`,
    CREATE: '/agent-reports/',
    UPDATE: (id: number) => `/agent-reports/${id}/`,
    DELETE: (id: number) => `/agent-reports/${id}/`,
  },
  
  // Customers
  CUSTOMERS: {
    LIST: '/customers/',
    DETAIL: (id: number) => `/customers/${id}/`,
    CREATE: '/customers/',
    UPDATE: (id: number) => `/customers/${id}/`,
    DELETE: (id: number) => `/customers/${id}/`,
  },

  // Premium Payments
  PREMIUM_PAYMENTS: {
    LIST: '/premium-payments/',
    DETAIL: (id: number) => `/premium-payments/${id}/`,
    CREATE: '/premium-payments/',
    UPDATE: (id: number) => `/premium-payments/${id}/`,
    DELETE: (id: number) => `/premium-payments/${id}/`,
  },
  
  // KYC
  KYC: {
    LIST: '/kyc/',
    DETAIL: (id: number) => `/kyc/${id}/`,
    CREATE: '/kyc/',
    UPDATE: (id: number) => `/kyc/${id}/`,
    DELETE: (id: number) => `/kyc/${id}/`,
  },
  
  // Claims
  CLAIMS: {
    REQUESTS: '/claim-requests/',
    REQUEST_DETAIL: (id: number) => `/claim-requests/${id}/`,
    PROCESSING: '/claim-processing/',
    PROCESSING_DETAIL: (id: number) => `/claim-processing/${id}/`,
  },
  
  // Loans
  LOANS: {
    LIST: '/loans/',
    DETAIL: (id: number) => `/loans/${id}/`,
    CREATE: '/loans/',
    UPDATE: (id: number) => `/loans/${id}/`,
    DELETE: (id: number) => `/loans/${id}/`,
    REPAYMENTS: '/loan-repayments/',
    REPAYMENT_DETAIL: (id: number) => `/loan-repayments/${id}/`,
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/home/',
    UNDERWRITING: '/underwriting/',
  },
  
  // Miscellaneous
  MORTALITY_RATES: '/mortality-rates/',
  OCCUPATIONS: '/occupations/',
}; 