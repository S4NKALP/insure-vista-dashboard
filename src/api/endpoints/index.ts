/**
 * API Endpoints index file that re-exports all API functions.
 * This helps ensure we have a consistent API interface.
 */

import * as mockApi from '../mock/api';

export const {
  // Auth
  login,
  logout,
  
  // User Management
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  
  // Branch Management
  getBranches,
  getBranchById,
  addBranch,
  updateBranch,
  deleteBranch,
  
  // Agent Management
  getAgents,
  getAgentById,
  getAgentsByBranch,
  addAgent,
  updateAgent,
  deleteAgent,
  
  // Agent Applications
  getAgentApplications,
  getAgentApplicationsByBranch,
  addAgentApplication,
  updateAgentApplicationStatus,
  
  // Agent Reports
  getAgentReports,
  getAgentReportsByBranch,
  
  // Customer Management
  getCustomers,
  getCustomerById,
  
  // Policy Management
  getPolicies,
  getPolicyHolders,
  getPolicyHolderById,
  getPolicyHoldersByBranch,
  
  // Premium Payments
  getPremiumPayments,
  addPremiumPayment,
  updatePremiumPayment,
  
  // KYC
  getKYC,
  
  // Claims
  getClaimRequests,
  getClaimProcessing,
  
  // Loans
  getLoans,
  getLoanRepayments,
  
  // Dashboard
  getDashboardStats,
  
  // Underwriting
  getUnderwritingData,
  
  // Companies
  getCompanies
} = mockApi;

// When implementing real API endpoints, create a file like:
// src/api/real/api.ts with real API implementations
// Then update this file to export from the real API instead 

// Export everything from mock API
export * from '../mock/api'; 