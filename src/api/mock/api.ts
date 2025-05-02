import appData from './data';
import { ApiResponse, Branch, PolicyHolder, SalesAgent, AgentReport, Customer, User, Company, Policy } from '@/types';

// Delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic success response creator
const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  data,
  status: 200,
  message: "Success",
  success: true
});

// Error response creator
const createErrorResponse = <T>(message: string, status = 400): ApiResponse<T> => ({
  data: null as any,
  status,
  message,
  success: false
});

// ======== BRANCH API ========
export const getBranches = async (): Promise<ApiResponse<Branch[]>> => {
  await delay(500);
  return createSuccessResponse(appData.branches);
};

export const getBranchById = async (id: number): Promise<ApiResponse<Branch>> => {
  await delay(500);
  const branch = appData.branches.find(b => b.id === id);
  
  if (!branch) {
    return createErrorResponse<Branch>("Branch not found", 404);
  }
  
  return createSuccessResponse(branch);
};

export const addBranch = async (branch: Omit<Branch, 'id'>): Promise<ApiResponse<Branch>> => {
  await delay(800);
  
  // Validate required fields
  if (!branch.name || !branch.branch_code || !branch.location || !branch.company) {
    return createErrorResponse<Branch>("Missing required fields");
  }
  
  // Create new branch with auto-incremented ID
  const newId = Math.max(...appData.branches.map(b => b.id), 0) + 1;
  const newBranch: Branch = {
    ...branch,
    id: newId
  };
  
  // Add to data store (would be API call in real app)
  appData.branches.push(newBranch);
  
  return createSuccessResponse(newBranch);
};

export const updateBranch = async (branch: Branch): Promise<ApiResponse<Branch>> => {
  await delay(800);
  
  const index = appData.branches.findIndex(b => b.id === branch.id);
  if (index === -1) {
    return createErrorResponse<Branch>("Branch not found", 404);
  }
  
  // Update branch in data store
  appData.branches[index] = branch;
  
  return createSuccessResponse(branch);
};

export const deleteBranch = async (id: number): Promise<ApiResponse<boolean>> => {
  await delay(800);
  
  const index = appData.branches.findIndex(b => b.id === id);
  if (index === -1) {
    return createErrorResponse<boolean>("Branch not found", 404);
  }
  
  // Delete branch from data store
  appData.branches.splice(index, 1);
  
  return createSuccessResponse(true);
};

// ======== POLICY HOLDER API ========
export const getPolicyHolders = async (branchId?: number): Promise<ApiResponse<PolicyHolder[]>> => {
  await delay(500);
  
  // If branchId is provided, filter by branch
  if (branchId) {
    return createSuccessResponse(appData.policy_holders.filter(p => p.branch?.id === branchId));
  }
  
  return createSuccessResponse(appData.policy_holders);
};

export const getPolicyHolderById = async (id: number): Promise<ApiResponse<PolicyHolder>> => {
  await delay(500);
  const policyHolder = appData.policy_holders.find(p => p.id === id);
  
  if (!policyHolder) {
    return createErrorResponse<PolicyHolder>("Policy holder not found", 404);
  }
  
  return createSuccessResponse(policyHolder);
};

export const getPolicyHoldersByBranch = async (branchId: number): Promise<ApiResponse<PolicyHolder[]>> => {
  await delay(500);
  const policyHolders = appData.policy_holders.filter(p => p.branch?.id === branchId);
  return createSuccessResponse(policyHolders);
};

// ======== AGENT API ========
export const getAgents = async (): Promise<ApiResponse<SalesAgent[]>> => {
  await delay(500);
  return createSuccessResponse(appData.sales_agents);
};

export const getAgentById = async (id: number): Promise<ApiResponse<SalesAgent>> => {
  await delay(500);
  const agent = appData.sales_agents.find(a => a.id === id);
  
  if (!agent) {
    return createErrorResponse<SalesAgent>("Agent not found", 404);
  }
  
  return createSuccessResponse(agent);
};

export const getAgentsByBranch = async (branchId: number): Promise<ApiResponse<SalesAgent[]>> => {
  await delay(500);
  const agents = appData.sales_agents.filter(a => a.branch === branchId);
  return createSuccessResponse(agents);
};

// ======== AGENT REPORTS API ========
export const getAgentReports = async (): Promise<ApiResponse<AgentReport[]>> => {
  await delay(500);
  return createSuccessResponse(appData.agent_reports);
};

export const getAgentReportsByBranch = async (branchId: number): Promise<ApiResponse<AgentReport[]>> => {
  await delay(500);
  const reports = appData.agent_reports.filter(r => r.branch === branchId);
  return createSuccessResponse(reports);
};

// ======== CUSTOMER API ========
export const getCustomers = async (): Promise<ApiResponse<Customer[]>> => {
  await delay(500);
  return createSuccessResponse(appData.customers);
};

export const getCustomerById = async (id: number): Promise<ApiResponse<Customer>> => {
  await delay(500);
  const customer = appData.customers.find(c => c.id === id);
  
  if (!customer) {
    return createErrorResponse<Customer>("Customer not found", 404);
  }
  
  return createSuccessResponse(customer);
};

// ======== AUTH API ========
export const login = async (username: string, password: string): Promise<ApiResponse<User>> => {
  await delay(800);
  
  const user = appData.users.find(u => u.username === username);
  
  if (!user) {
    return createErrorResponse<User>("Invalid username or password", 401);
  }
  
  // In a real implementation, we would check the password hash
  // For mock purposes, we'll just return the user
  return createSuccessResponse(user);
};

// ======== COMPANY API ========
export const getCompanies = async (): Promise<ApiResponse<Company[]>> => {
  await delay(500);
  return createSuccessResponse(appData.companies);
};

// ======== POLICY API ========
export const getPolicies = async (): Promise<ApiResponse<Policy[]>> => {
  await delay(500);
  return createSuccessResponse(appData.insurance_policies);
};

// ======== DASHBOARD STATISTICS API ========
export const getDashboardStats = async (): Promise<ApiResponse<any>> => {
  await delay(700);
  
  // Calculate summary statistics
  const totalBranches = appData.branches.length;
  const totalAgents = appData.sales_agents.length;
  const totalPolicies = appData.policy_holders.length;
  const totalCustomers = appData.customers.length;
  
  const totalPremium = appData.premium_payments?.reduce((sum, payment) => 
    sum + parseFloat(payment.annual_premium), 0) || 0;
    
  const totalClaims = appData.claim_requests?.length || 0;
  
  return createSuccessResponse({
    totalBranches,
    totalAgents,
    totalPolicies,
    totalCustomers,
    totalPremium,
    totalClaims,
    recentPolicies: appData.policy_holders.slice(0, 5),
    recentClaims: appData.claim_requests?.slice(0, 5) || []
  });
}; 