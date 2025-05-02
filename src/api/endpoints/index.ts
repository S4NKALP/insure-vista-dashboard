// This file exports the API functions that will be used throughout the application
// We import from the mock API now, but this can be easily switched to real API implementation
// without changing any component code

import * as mockApi from '../mock/api';

// Export the mock implementations for now
// To switch to real API implementation, replace these with imports from a real API module
export const getBranches = mockApi.getBranches;
export const getBranchById = mockApi.getBranchById;
export const addBranch = mockApi.addBranch;
export const updateBranch = mockApi.updateBranch;
export const deleteBranch = mockApi.deleteBranch;

export const getPolicyHolders = mockApi.getPolicyHolders;
export const getPolicyHolderById = mockApi.getPolicyHolderById;
export const getPolicyHoldersByBranch = mockApi.getPolicyHoldersByBranch;

export const getAgents = mockApi.getAgents;
export const getAgentById = mockApi.getAgentById;
export const getAgentsByBranch = mockApi.getAgentsByBranch;

export const getAgentReports = mockApi.getAgentReports;
export const getAgentReportsByBranch = mockApi.getAgentReportsByBranch;

export const getCustomers = mockApi.getCustomers;
export const getCustomerById = mockApi.getCustomerById;

export const login = mockApi.login;

export const getCompanies = mockApi.getCompanies;
export const getPolicies = mockApi.getPolicies;

export const getDashboardStats = mockApi.getDashboardStats;

// When implementing real API endpoints, you can create a file like:
// src/api/real/api.ts with real API implementations
// Then update imports here to switch from mock to real 