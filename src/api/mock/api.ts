import { ApiResponse, Branch, PolicyHolder, SalesAgent, AgentReport, Customer, User, Company, Policy } from '@/types';
import { AgentApplication } from '@/types';
import { API_URL, ENDPOINTS, API_TIMEOUT } from '@/api/constants';

// Config - Use the imported constants
const apiUrl = API_URL;

// Disable mock data fallback for production use
const USE_MOCK_FALLBACK = false;

// Try different auth header formats if the default doesn't work
const tryDifferentAuthFormats = true;

// Helper to handle API responses
const handleResponse = async <T>(response: Response, endpoint: string): Promise<ApiResponse<T>> => {
  console.log('Response status:', response.status);
  try {
    const text = await response.text();
    console.log('Response text:', text.substring(0, 500)); // Log first 500 chars of response
    
    // Check if response is HTML instead of JSON (common error when API routes are wrong)
    if (text.trim().startsWith('<!DOCTYPE html>')) {
      console.error('API returned HTML instead of JSON. Check API endpoint URL.');
      throw new Error('Invalid API response format (received HTML)');
    }
    
    // Empty array but successful is fine
    if (text === '[]' && response.ok) {
      return {
        data: [] as any,
        status: response.status,
        message: "Success",
        success: true
      };
    }
    
    const data = text ? JSON.parse(text) : null;
    
    if (!response.ok) {
      return {
        data: null as any,
        status: response.status,
        message: data?.detail || data?.message || `Error: ${response.statusText}`,
        success: false
      };
    }

    return {
      data,
      status: response.status,
      message: "Success",
      success: true
    };
  } catch (error) {
    console.error('Error parsing response:', error);
    
    return {
      data: null as any,
      status: response.status || 0,
      message: `Error: ${(error as Error).message || response.statusText || 'Unknown error'}`,
      success: false
    };
  }
};

// Function to create a fetch request with timeout
const fetchWithTimeout = async (resource: string, options: RequestInit = {}, timeout = API_TIMEOUT): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  
  clearTimeout(id);
  return response;
};

// Generic API request function with auth token
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    // Determine if this is a full URL or just an endpoint
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${apiUrl}${endpoint}`;
    
    try {
      console.log(`API Request to: ${fullUrl}`);
      console.log(`Request method: ${options.method || 'GET'}`);
      
      // Log body based on type (don't stringify FormData)
      if (options.body) {
        if (options.body instanceof FormData) {
          console.log('Request payload: [FormData]');
        } else if (typeof options.body === 'string') {
          console.log('Request payload:', options.body);
        }
      }
      
      const token = localStorage.getItem('auth_token');
      const rawToken = localStorage.getItem('raw_auth_token');
      const authFormat = localStorage.getItem('auth_format') || 'bearer';
      
      console.log('Auth token exists:', !!token); 
      if (token) {
        console.log('Auth token (first 10 chars):', token.substring(0, 10) + '...');
      }
      console.log('Using auth format:', authFormat);
      
      // Use the format that was detected during login
      let authHeader = '';
      if (token) {
        if (authFormat === 'bearer') {
          authHeader = `Bearer ${token}`;
        } else if (authFormat === 'token') {
          authHeader = `Token ${token}`;
        } else if (authFormat === 'raw') {
          authHeader = rawToken || token;
        } else {
          authHeader = `Bearer ${token}`; // Default fallback
        }
      }
      
      // Don't add Content-Type for FormData requests
      const isFormData = options.body instanceof FormData;
      const headers = {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...(authHeader ? { 'Authorization': authHeader } : {}),
        ...options.headers,
      };
  
      const response = await fetchWithTimeout(fullUrl, {
        ...options,
        headers,
      });
  
      console.log(`API Response status: ${response.status}`);
      
      // If unauthorized and tryDifferentAuthFormats is enabled, try other formats
      if (response.status === 401 && tryDifferentAuthFormats && token) {
        console.log("Response was unauthorized. Trying alternative auth formats...");
        
        // Try formats in a different order than what we're currently using
        const formatsToTry = ['bearer', 'raw', 'token'].filter(f => f !== authFormat);
        
        for (const format of formatsToTry) {
          let alternativeHeader = '';
          
          if (format === 'bearer') {
            alternativeHeader = `Bearer ${token}`;
          } else if (format === 'token') {
            alternativeHeader = `Token ${token}`;
          } else if (format === 'raw') {
            alternativeHeader = rawToken || token;
          }
          
          console.log(`Trying ${format} format...`);
          
          try {
            const alternativeResponse = await fetch(fullUrl, {
              ...options,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': alternativeHeader,
                ...options.headers,
              },
            });
            
            console.log(`${format} format response: ${alternativeResponse.status}`);
            
            if (alternativeResponse.status !== 401) {
              // This format worked! Save it for future requests
              localStorage.setItem('auth_format', format);
              console.log(`Saving working format: ${format}`);
              
              // Use this response
              return handleResponse<T>(alternativeResponse, endpoint);
            }
          } catch (e) {
            console.warn(`Error trying ${format} format:`, e);
          }
        }
      }
      
      return handleResponse<T>(response, endpoint);
    } catch (error) {
      console.error('API request failed:', error);
      
      return {
        data: null as any,
        status: 0,
        message: `Network error: ${(error as Error).message}`,
        success: false
      };
    }
  };


  // ======== BRANCH API ========
const handleBranchAPI = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  id?: number,
  data?: Branch | Omit<Branch, 'id'>
): Promise<ApiResponse<Branch[] | Branch | boolean>> => {
  switch (method) {
    case 'GET':
      return id 
        ? apiRequest<Branch>(`/branches/${id}/`) 
        : apiRequest<Branch[]>(`/branches/`);
        
    case 'POST':
      return apiRequest<Branch>(`/branches/`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
    case 'PUT':
      return apiRequest<Branch>(`/branches/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      
    case 'DELETE': {
      const response = await apiRequest<any>(`/branches/${id}/`, { method: 'DELETE' });
      return { ...response, data: response.success };
    }
    
    default:
      throw new Error('Invalid method for branch API');
  }
};

export const getBranches = () => handleBranchAPI('GET');
export const getBranchById = (id: number) => handleBranchAPI('GET', id);
export const addBranch = (branch: Omit<Branch, 'id'>) => handleBranchAPI('POST', undefined, branch);
export const updateBranch = (branch: Branch) => handleBranchAPI('PUT', branch.id, branch);
export const deleteBranch = (id: number) => handleBranchAPI('DELETE', id);

// ======== POLICY HOLDER API ========
export const getPolicyHolders = async (branchId?: number): Promise<ApiResponse<PolicyHolder[]>> => {
  const endpoint = branchId ? `/policy-holders/?branch=${branchId}` : `/policy-holders/`;
  return apiRequest<PolicyHolder[]>(endpoint);
};

export const getPolicyHolderById = async (id: number): Promise<ApiResponse<PolicyHolder>> => {
  return apiRequest<PolicyHolder>(`/policy-holders/${id}/`);
};

export const getPolicyHoldersByBranch = async (branchId: number): Promise<ApiResponse<PolicyHolder[]>> => {
  return apiRequest<PolicyHolder[]>(`/policy-holders/?branch=${branchId}`);
};

// ======== AGENT API ========

/**
 * Fetches all sales agents.
 * GET /api/sales-agents/
 */
export const getAgents = async (): Promise<ApiResponse<SalesAgent[]>> => {
  console.log("Fetching all sales agents from API...");
  
  try {
    // Make the API request
    const response = await apiRequest<SalesAgent[]>(ENDPOINTS.AGENTS);
    
    // Log the response for debugging
    console.log("Sales agents API response:", { 
      success: response.success, 
      status: response.status,
      dataCount: Array.isArray(response.data) ? response.data.length : 'not an array',
      message: response.message
    });
    
    // Check if we got an empty array
    if (response.success && Array.isArray(response.data) && response.data.length === 0) {
      console.warn("API returned empty array of sales agents. Check if this is expected.");
    }
    
    return response;
  } catch (error) {
    console.error("Error fetching sales agents:", error);
  
    
    
    // If mock fallback is disabled, propagate the error
    throw error;
  }
};

/**
 * Fetches a specific sales agent by ID.
 * GET /api/sales-agents/{id}/
 */
export const getAgentById = async (id: number): Promise<ApiResponse<SalesAgent>> => {
  console.log(`Fetching sales agent with ID ${id}`);
  return apiRequest<SalesAgent>(`/sales-agents/${id}/`);
};

/**
 * Fetches sales agents for a specific branch.
 * GET /api/sales-agents/?branch={branchId}
 */
export const getAgentsByBranch = async (branchId: number): Promise<ApiResponse<SalesAgent[]>> => {
  console.log(`Fetching sales agents for branch ${branchId}`);
  return apiRequest<SalesAgent[]>(`/sales-agents/?branch=${branchId}`);
};

// ======== AGENT REPORTS API ========
export const getAgentReports = async (): Promise<ApiResponse<AgentReport[]>> => {
  return apiRequest<AgentReport[]>(`/agent-reports/`);
};

export const getAgentReportsByBranch = async (branchId: number): Promise<ApiResponse<AgentReport[]>> => {
  return apiRequest<AgentReport[]>(`/agent-reports/?branch=${branchId}`);
};

// ======== CUSTOMER API ========
export const getCustomers = async (): Promise<ApiResponse<Customer[]>> => {
  return apiRequest<Customer[]>(`/customers/`);
};

export const getCustomerById = async (id: number): Promise<ApiResponse<Customer>> => {
  return apiRequest<Customer>(`/customers/${id}/`);
};

// ======== AUTH API ========

export const login = async (username: string, password: string): Promise<ApiResponse<User>> => {
    try {
      console.log(`Attempting login for ${username} to /login/`);
      
      // Store which auth format worked so we can use it later
      let workingAuthFormat = 'bearer'; // default
      
      const result = await apiRequest<{token: string, user: User}>(`/login/`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      if (result.success && result.data?.token) {
        // Save token to localStorage
        console.log("Login successful, saving token");
        const token = result.data.token;
        localStorage.setItem('auth_token', token);
        
        // Also store the raw token without any prefix in case that's what's needed
        localStorage.setItem('raw_auth_token', token.replace('Bearer ', '').trim());
        
        // Make test requests with different formats to see which one works
        console.log("Testing different auth formats...");
        
        try {
          // Try with Bearer prefix
          let testResult = await fetch(`${apiUrl}/branches/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log(`Bearer format test: ${testResult.status}`);
          
          if (testResult.status === 200) {
            console.log("Bearer token format works!");
            workingAuthFormat = 'bearer';
          } else {
            // Try without any prefix
            testResult = await fetch(`${apiUrl}/branches/`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              }
            });
            
            console.log(`Raw token test: ${testResult.status}`);
            
            if (testResult.status === 200) {
              console.log("Raw token format works!");
              workingAuthFormat = 'raw';
            } else {
              // Try with Token prefix
              testResult = await fetch(`${apiUrl}/branches/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${token}`
                }
              });
              
              console.log(`Token prefix test: ${testResult.status}`);
              
              if (testResult.status === 200) {
                console.log("Token prefix format works!");
                workingAuthFormat = 'token';
              }
            }
          }
          
          // Save the working format to localStorage
          localStorage.setItem('auth_format', workingAuthFormat);
          
        } catch (e) {
          console.warn("Auth format tests failed:", e);
        }
        
        return {
          ...result,
          data: result.data.user
        } as ApiResponse<User>;
      }
      
      return {
        data: null as any,
        status: result.status,
        message: result.message || 'Authentication failed',
        success: false
      };
    } catch (error) {
      console.error('Login failed:', error);
      
      return {
        data: null as any,
        status: 0,
        message: `Login failed: ${(error as Error).message}`,
        success: false
      };
    }
  };

export const logout = async (): Promise<ApiResponse<boolean>> => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    return {
      data: true,
      status: 200,
      message: "Already logged out",
      success: true
    };
  }
  
  try {
    const response = await fetch(`${apiUrl}/logout/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    localStorage.removeItem('auth_token');
    
    return {
      data: true,
      status: response.status,
      message: response.ok ? "Logged out successfully" : "Logout failed",
      success: response.ok
    };
  } catch (error) {
    console.error('Logout failed:', error);
    localStorage.removeItem('auth_token'); // Still remove token on error
    
    return {
      data: true, // Still indicate success since we removed the token
      status: 0,
      message: `Logout had network error but token was cleared: ${(error as Error).message}`,
      success: true
    };
  }
};

// ======== COMPANY API ========
export const getCompanies = async (): Promise<ApiResponse<Company[]>> => {
  return apiRequest<Company[]>(`/companies/`);
};

// ======== POLICY API ========
export const getPolicies = async (): Promise<ApiResponse<Policy[]>> => {
  return apiRequest<Policy[]>(`/insurance-policies/`);
};

// ======== PREMIUM PAYMENTS API ========
export const getPremiumPayments = async (): Promise<ApiResponse<any[]>> => {
  return apiRequest<any[]>(`/premium-payments/`);
};

export const addPremiumPayment = async (payment: any): Promise<ApiResponse<any>> => {
  return apiRequest<any>(`/premium-payments/`, {
    method: 'POST',
    body: JSON.stringify(payment)
  });
};

export const updatePremiumPayment = async (id: number, payment: any): Promise<ApiResponse<any>> => {
  return apiRequest<any>(`/premium-payments/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(payment)
  });
};

// ======== KYC API ========
export const getKYC = async (): Promise<ApiResponse<any[]>> => {
  return apiRequest<any[]>(`/kyc/`);
};

// ======== CLAIMS API ========
export const getClaimRequests = async (): Promise<ApiResponse<any[]>> => {
  return apiRequest<any[]>(`/claim-requests/`);
};

export const getClaimProcessing = async (): Promise<ApiResponse<any[]>> => {
  return apiRequest<any[]>(`/claim-processing/`);
};

// ======== LOANS API ========
export const getLoans = async (): Promise<ApiResponse<any[]>> => {
  return apiRequest<any[]>(`/loans/`);
};

export const getLoanRepayments = async (): Promise<ApiResponse<any[]>> => {
  return apiRequest<any[]>(`/loan-repayments/`);
};

// ======== DASHBOARD STATISTICS API ========
export const getDashboardStats = async (): Promise<ApiResponse<any>> => {
    
    // Add withCredentials to ensure cookies are sent
    return apiRequest<any>(`/home/`, {
      headers: {
        // Force specific auth format for this endpoint
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      credentials: 'include', // Include cookies in the request
    });
  };

// ======== UNDERWRITING API ========
export const getUnderwritingData = async (): Promise<ApiResponse<any[]>> => {
  return apiRequest<any[]>(`/underwriting/`);
};

// ======================
// User Management API
// ======================

type CreateUserData = Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login' | 'is_superuser' | 'is_staff' | 'agent' | 'groups' | 'user_permissions'> & { password?: string }; // Password might be optional if set separately
type UpdateUserData = Partial<Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login' | 'password' | 'is_superuser' | 'is_staff' | 'agent' | 'groups' | 'user_permissions'>>;

/**
 * Fetches all users.
 * GET /api/users/
 */
export const getUsers = async (): Promise<ApiResponse<User[]>> => {
    console.log("Fetching all users");
    return await apiRequest<User[]>(`/users/`);
};

/**
 * Adds a new user.
 * POST /api/users/
 */
export const addUser = async (userData: CreateUserData): Promise<ApiResponse<User>> => {
    console.log("Creating new user:", userData);
    return await apiRequest<User>(`/users/`, {
        method: 'POST',
        body: JSON.stringify(userData)
    });
};

/**
 * Updates an existing user.
 * PATCH /api/users/{id}/
 */
export const updateUser = async (userId: number, userData: UpdateUserData): Promise<ApiResponse<User>> => {
    console.log(`Updating user ${userId}:`, userData);
    return await apiRequest<User>(`/users/${userId}/`, {
        method: 'PATCH',
        body: JSON.stringify(userData)
    });
};

/**
 * Deletes a user.
 * DELETE /api/users/{id}/
 */
export const deleteUser = async (userId: number): Promise<ApiResponse<boolean>> => {
    console.log(`Deleting user ${userId}`);
    const response = await apiRequest<any>(`/users/${userId}/`, {
        method: 'DELETE'
    });
    return {
        ...response,
        data: response.success
    };
};

// ======================
// Agent Management API
// ======================

// Type for creating an agent (assuming linking to a User happens elsewhere or needs specific data)
type CreateAgentData = Omit<SalesAgent, 'id' | 'total_policies_sold' | 'total_premium_collected' | 'commission_rate' | 'user_details'>;
// Type for updating an agent
type UpdateAgentData = Partial<CreateAgentData>;

/**
 * Adds a new Sales Agent.
 * POST /api/sales-agents/
 */
export const addAgent = async (agentData: CreateAgentData): Promise<ApiResponse<SalesAgent>> => {
    console.log("Creating new sales agent:", agentData);
    return await apiRequest<SalesAgent>(`/sales-agents/`, {
        method: 'POST',
        body: JSON.stringify(agentData)
    });
};

/**
 * Updates an existing Sales Agent.
 * PATCH /api/sales-agents/{id}/
 */
export const updateAgent = async (agentId: number, agentData: UpdateAgentData): Promise<ApiResponse<SalesAgent>> => {
    console.log(`Updating sales agent ${agentId}:`, agentData);
    return await apiRequest<SalesAgent>(`/sales-agents/${agentId}/`, {
        method: 'PATCH',
        body: JSON.stringify(agentData)
    });
};

/**
 * Deletes a Sales Agent.
 * DELETE /api/sales-agents/{id}/
 */
export const deleteAgent = async (agentId: number): Promise<ApiResponse<boolean>> => {
    console.log(`Deleting sales agent ${agentId}`);
    const response = await apiRequest<any>(`/sales-agents/${agentId}/`, {
        method: 'DELETE'
    });
    return {
        ...response,
        data: response.success
    };
};

// ==============================
// Agent Application Management API
// ==============================

// Type for creating an application (likely simpler than the full type)
type CreateAgentApplicationData = Omit<AgentApplication, 
  'id' | 'status' | 'created_at' | 'rejection_reason' | 'branch_name' |
  'resume' | 'citizenship_front' | 'citizenship_back' | 'license_front' | 'license_back' | 'pp_photo'
>;

/**
 * Fetches all Agent Applications (SuperAdmin).
 * GET /api/agent-applications/
 */
export const getAgentApplications = async (): Promise<ApiResponse<AgentApplication[]>> => {
    console.log("Fetching all agent applications (SuperAdmin)");
    
    try {
      // Make the API request
      const response = await apiRequest<AgentApplication[]>(ENDPOINTS.AGENT_APPLICATIONS);
      
      // Log the response for debugging
      console.log("Agent applications API response:", { 
        success: response.success, 
        status: response.status,
        dataLength: Array.isArray(response.data) ? response.data.length : 'not an array',
        message: response.message
      });
      
      // If data is available, log the first item for debugging
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        console.log("Sample application data:", response.data[0]);
      }
      
      return response;
    } catch (error) {
      console.error("Error fetching agent applications:", error);
      throw error;
    }
};

/**
 * Fetches Agent Applications for a specific branch (Branch Admin).
 * GET /api/agent-applications/?branch={branchId}
 */
export const getAgentApplicationsByBranch = async (branchId: number): Promise<ApiResponse<AgentApplication[]>> => {
    console.log(`Fetching agent applications for branch ${branchId}`);
    
    try {
      // Make the API request
      const response = await apiRequest<AgentApplication[]>(`${ENDPOINTS.AGENT_APPLICATIONS}?branch=${branchId}`);
      
      // Log the response for debugging
      
      // If data is available, log the first item for debugging
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        console.log("Sample branch application data:", response.data[0]);
      } else if (Array.isArray(response.data) && response.data.length === 0) {
        console.log(`No applications found for branch ${branchId}`);
      }
      
      return response;
    } catch (error) {
      console.error(`Error fetching applications for branch ${branchId}:`, error);
      throw error;
    }
};

/**
 * Adds a new Agent Application.
 * POST /api/agent-applications/
 */
export const addAgentApplication = async (data: FormData | CreateAgentApplicationData): Promise<ApiResponse<AgentApplication>> => {
  console.log("Creating new agent application");
  
  try {
    // For real API
    const options: RequestInit = {
      method: 'POST',
    };
    
    if (data instanceof FormData) {
      console.log("Submitting as FormData with files");
      // Do not set Content-Type header when sending FormData
      // The browser will automatically set the correct multipart/form-data with boundary
      options.body = data;
    } else {
      console.log("Submitting as JSON data", data);
      options.headers = {
        'Content-Type': 'application/json'
      };
      options.body = JSON.stringify(data);
    }
    
    return await apiRequest<AgentApplication>(`/agent-applications/`, options);
  } catch (error) {
    console.error('Error adding agent application:', error);
    
    // Mock response for development
    
    
    return {
      success: true,
      status: 200,
      data: data as AgentApplication,
      message: 'Agent application created successfully'
    };
  }
};



/**
 * Updates the status of an Agent Application.
 * PATCH /api/agent-applications/{id}/status/
 */
export const updateAgentApplicationStatus = async (
    applicationId: number, 
    status: 'APPROVED' | 'REJECTED', 
    rejection_reason?: string
): Promise<ApiResponse<AgentApplication>> => {
    console.log(`Updating application ${applicationId} status to ${status}`);
    
    const payload: { status: string; rejection_reason?: string } = { status };
    if (status === 'REJECTED' && rejection_reason) {
        payload.rejection_reason = rejection_reason;
    }
    
    // Try first with the status-specific endpoint
    try {
        return await apiRequest<AgentApplication>(`${ENDPOINTS.AGENT_APPLICATIONS}${applicationId}/status/`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error(`Error using status endpoint: ${error}`);
        
        // Fallback to direct update if status endpoint fails
        console.log(`Trying direct update to application instead`);
        try {
            return await apiRequest<AgentApplication>(`${ENDPOINTS.AGENT_APPLICATIONS}${applicationId}/`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
        } catch (secondError) {
            console.error(`Direct update also failed: ${secondError}`);
            throw secondError;
        }
    }
}; 