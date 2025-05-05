import { usePermissions } from '@/contexts/PermissionsContext';
import { ApiResponse } from '@/types';
import * as API from '@/api/endpoints';

/**
 * Hook to get branch-aware API functions
 * 
 * This will automatically filter data by branch for branch admins
 */
export const useBranchAwareAPI = () => {
  const { isSuperAdmin, userBranchId } = usePermissions();
  
  /**
   * Get policy holders with branch filtering for branch admins
   */
  const getPolicyHolders = async (): Promise<ApiResponse<any>> => {
    if (!isSuperAdmin && userBranchId) {
      return API.getPolicyHolders(userBranchId);
    }
    return API.getPolicyHolders();
  };
  /**
   * Get agents with branch filtering for branch admins
   */
  const getAgents = async (): Promise<ApiResponse<any>> => {
    if (!isSuperAdmin && userBranchId) {
      return API.getAgentsByBranch(userBranchId);
    }
    return API.getAgents();
  };
  /**
   * Get agent reports with branch filtering for branch admins
   */
  const getAgentReports = async (): Promise<ApiResponse<any>> => {
    if (!isSuperAdmin && userBranchId) {
      return API.getAgentReportsByBranch(userBranchId);
    }
    return API.getAgentReports();
  };
  
  /**
   * Get dashboard stats with branch filtering for branch admins
   */
  const getDashboardStats = async (): Promise<ApiResponse<any>> => {
    // We assume that the real implementation of getDashboardStats would
    // accept a branchId parameter. For now, we just return the stats.
    return API.getDashboardStats();
  };
  
  return {
    getPolicyHolders,
    getAgents,
    getAgentReports,
    getDashboardStats,
    
    // Pass-through functions that don't need branch filtering
    getBranches: API.getBranches,
    getBranchById: API.getBranchById,
    addBranch: API.addBranch,
    updateBranch: API.updateBranch,
    deleteBranch: API.deleteBranch,
    getPolicyHolderById: API.getPolicyHolderById,
    getPolicyHoldersByBranch: API.getPolicyHoldersByBranch,
    getAgentById: API.getAgentById,
    getAgentsByBranch: API.getAgentsByBranch,
    getAgentReportsByBranch: API.getAgentReportsByBranch,
    getCustomers: API.getCustomers,
    getCustomerById: API.getCustomerById,
    login: API.login,
    getCompanies: API.getCompanies,
    getPolicies: API.getPolicies,
  };
}; 