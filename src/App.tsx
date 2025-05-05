import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import BranchManagement from "./pages/BranchManagement";
import PolicyManagement from "./pages/PolicyManagement";
import PolicyHolderManagement from "./pages/PolicyHolderManagement";
import Reports from "./pages/Reports";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import AgentManagement from "./pages/AgentManagement";
import ClaimManagement from "./pages/ClaimManagement";
import PaymentManagement from "./pages/PaymentManagement";
import LoanManagement from "./pages/LoanManagement";
import Settings from "./pages/Settings";

import SalesAgentManagement from "./pages/SalesAgentManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PermissionsProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Redirect root to dashboard if logged in, otherwise to login */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Dashboard Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              
              {/* Superadmin Routes */}
              <Route path="/users" element={<PrivateRoute allowedRoles={['superadmin', 'branch']}><UserManagement /></PrivateRoute>} />
              <Route path="/branches" element={<PrivateRoute allowedRoles={['superadmin']}><BranchManagement /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute allowedRoles={['superadmin']}><Settings /></PrivateRoute>} />
              <Route path="/agents" element={<PrivateRoute allowedRoles={['superadmin', 'branch']}><SalesAgentManagement /></PrivateRoute>} />
              
              {/* Claims and Payments Routes */}
              <Route path="/claims" element={<PrivateRoute><ClaimManagement /></PrivateRoute>} />
              <Route path="/payments" element={<PrivateRoute><PaymentManagement /></PrivateRoute>} />
              
              {/* Policy Management Routes */}
              <Route path="/policies" element={<PrivateRoute><PolicyManagement /></PrivateRoute>} />
              <Route path="/policy-holders" element={<PrivateRoute allowedRoles={['superadmin', 'branch']}><PolicyHolderManagement /></PrivateRoute>} />
              
              {/* Shared Routes */}
              <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
              
              {/* Branch Admin Routes */}
              <Route path="/customers" element={<PrivateRoute allowedRoles={['superadmin', 'branch']}><UserManagement /></PrivateRoute>} />
              <Route path="/loans" element={<PrivateRoute><LoanManagement /></PrivateRoute>} />
              
              {/* Error Pages */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PermissionsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
