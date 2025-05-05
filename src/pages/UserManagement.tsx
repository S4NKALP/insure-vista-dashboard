import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import PermissionGate from '@/components/PermissionGate';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  UserPlus,
  Search,
  Edit,
  Trash2,
  Eye,
  AlertCircle
} from 'lucide-react';
import { 
  getUsers, 
  getBranches, 
  addUser, 
  updateUser, 
  deleteUser 
} from '@/api/endpoints';
import { User, Branch } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Type expected by the addUser API function (based on mock/api.ts correction)
type CreateUserData = Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login' | 'is_superuser' | 'is_staff' | 'agent' | 'groups' | 'user_permissions'> & { password?: string };
// Type expected by the updateUser API function
type UpdateUserData = Partial<Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login' | 'password' | 'is_superuser' | 'is_staff' | 'agent' | 'groups' | 'user_permissions'>>;

// --- Helper Functions ---
const getUserTypeLabel = (type: string | undefined): string => {
  switch (type) {
    case 'superadmin': return 'Super Admin';
    case 'branch': return 'Branch Manager';
    case 'agent': return 'Agent';
    case 'customer': return 'Customer';
    default: return type || 'Unknown';
  }
};

const getUserTypeColor = (type: string | undefined): string => {
  switch (type) {
    case 'superadmin': return 'bg-red-100 text-red-800';
    case 'branch': return 'bg-blue-100 text-blue-800';
    case 'agent': return 'bg-green-100 text-green-800';
    case 'customer': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Default state for the user form
const defaultNewUserData: CreateUserData = {
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '', // Add password field
  gender: '',
  phone: '',
  address: '',
  user_type: 'customer', // Default to customer
  branch: null,
  is_active: true
};

// --- API Fetching Functions ---
const fetchUsers = async (): Promise<User[]> => {
  const response = await getUsers();
  if (response.success && Array.isArray(response.data)) {
    return response.data;
  } else {
    console.error("API Error fetching users:", response);
    throw new Error(response.message || 'Failed to fetch users');
  }
};

const fetchBranches = async (): Promise<Branch[]> => {
  const response = await getBranches();
  if (response.success && Array.isArray(response.data)) {
    return response.data;
  } else {
    console.error("API Error fetching branches:", response);
    throw new Error(response.message || 'Failed to fetch branches');
  }
};

// --- Component ---
const UserManagement = () => {
  const { user: currentUser } = useAuth(); // Renamed to avoid conflict
  const { isBranchAdmin, isSuperAdmin, userBranchId } = usePermissions();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<CreateUserData>(defaultNewUserData);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // --- Data Queries ---
  const { 
    data: users = [], 
    isLoading: isLoadingUsers, 
    isError: isErrorUsers, 
    error: errorUsers 
  } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { 
    data: branches = [], 
    isLoading: isLoadingBranches, 
    isError: isErrorBranches,
    error: errorBranches
  } = useQuery<Branch[], Error>({
    queryKey: ['branches'],
    queryFn: fetchBranches,
    staleTime: Infinity, // Branches likely don't change often
  });

  // --- Filtered Users Memo ---
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Branch admin only sees customers (and potentially agents/users assigned to their branch)
    // This assumes the backend *might* send more than needed, so we filter client-side.
    // Ideally, the backend should filter based on the requesting user's role/branch.
    if (isBranchAdmin) {
        // Only show users linked to the admin's branch or customers (who might not have a branch link)
        filtered = filtered.filter(u => u.user_type === 'customer' || u.branch === userBranchId);
    }
    
    if (userTypeFilter !== 'all') {
      filtered = filtered.filter(u => u.user_type === userTypeFilter);
    }
    
    if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(u => 
            u.username?.toLowerCase().includes(lowerSearchTerm) ||
            u.first_name?.toLowerCase().includes(lowerSearchTerm) ||
            u.last_name?.toLowerCase().includes(lowerSearchTerm) ||
            u.email?.toLowerCase().includes(lowerSearchTerm)
        );
    }
    
    return filtered;
  }, [users, isBranchAdmin, userBranchId, userTypeFilter, searchTerm]);

  // --- Helper Functions ---
   const getBranchName = (branchId: number | null | undefined): string => {
    if (isLoadingBranches) return 'Loading...';
    if (!branchId) return 'N/A';
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };
  
   const resetUserForm = () => {
    setUserFormData(defaultNewUserData);
    setSelectedUser(null);
    setConfirmPassword('');
    setPasswordError(null);
  };

  // --- Mutations ---
   const addUserMutation = useMutation({
    mutationFn: (newUserData: CreateUserData) => addUser(newUserData),
    onSuccess: () => {
      toast.success("User added successfully");
      queryClient.invalidateQueries({ queryKey: ['users'] });
    setIsAddUserOpen(false);
      resetUserForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to add user: ${error.message}`);
    },
  });

   const updateUserMutation = useMutation({
    mutationFn: ({ userId, updatedData }: { userId: number, updatedData: UpdateUserData }) => updateUser(userId, updatedData),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditUserOpen(false);
      resetUserForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDeleting(false);
      setUserToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });

  // --- Event Handlers ---
  const handleAddClick = () => {
    resetUserForm();
    setIsAddUserOpen(true);
  };

  const handleEditClick = (userToEdit: User) => {
    setSelectedUser(userToEdit);
    // Pre-fill form, map User type to CreateUserData/UpdateUserData shape
    setUserFormData({
      username: userToEdit.username || '',
      first_name: userToEdit.first_name || '',
      last_name: userToEdit.last_name || '',
      email: userToEdit.email || '',
      password: '', // Don't pre-fill password for editing
      gender: userToEdit.gender || '',
      phone: userToEdit.phone || '',
      address: userToEdit.address || '',
      user_type: userToEdit.user_type || 'customer',
      branch: userToEdit.branch || null,
      is_active: userToEdit.is_active ?? true, 
    });
    setIsEditUserOpen(true);
  };

  const handleDeleteClick = (userToDel: User) => {
    setUserToDelete(userToDel);
    setIsDeleting(true);
  };

  const handleViewClick = (userToView: User) => {
    setSelectedUser(userToView);
    setIsViewUserOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // Clear password error when password field changes
    if (id === 'password') {
      setPasswordError(null);
    }
    
    setUserFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (id: keyof CreateUserData, value: string | number | null | undefined) => {
    // Special case for branch selection
    if (id === 'branch') {
      const branchValue = value === 'not_assigned' ? null : typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : null;
      setUserFormData(prev => ({ ...prev, [id]: branchValue }));
    } else {
      setUserFormData(prev => ({ ...prev, [id]: value }));
    }
  };
  
  const handleCheckboxChange = (id: keyof CreateUserData, checked: boolean) => {
     setUserFormData(prev => ({ ...prev, [id]: checked }));
  };

  const validatePassword = (): boolean => {
    // Clear previous error
    setPasswordError(null);
    
    // Check if passwords match
    if (userFormData.password !== confirmPassword) {
      setPasswordError("Your passwords didn't match.");
      return false;
    }
    
    // Check password length
    if (userFormData.password && userFormData.password.length < 8) {
      setPasswordError("This password is too short. It must contain at least 8 characters.");
      return false;
    }
    
    // Add more password validations as needed
    
    return true;
  };

  const handleSaveAdd = () => {
    // Basic validation
    if (!userFormData.username || !userFormData.email || !userFormData.first_name || !userFormData.last_name || !userFormData.password) {
      toast.error("Please fill in Username, Email, First Name, Last Name, and Password.");
      return;
    }
    
    // Password validation
    if (!validatePassword()) {
      return;
    }
    
    if ((userFormData.user_type === 'branch' || userFormData.user_type === 'agent') && !userFormData.branch) {
      toast.error(`Please select a branch for this ${getUserTypeLabel(userFormData.user_type)}.`);
      return;
    }

     // Ensure branch is set for branch admins adding customers/agents
     const dataToSubmit: CreateUserData = {
        ...userFormData,
        branch: isBranchAdmin ? userBranchId : userFormData.branch
     };

    addUserMutation.mutate(dataToSubmit);
  };

  const handleSaveUpdate = () => {
    if (!selectedUser) return;

    // Basic validation (exclude password validation for update)
    if (!userFormData.username || !userFormData.email || !userFormData.first_name || !userFormData.last_name) {
      toast.error("Please fill in Username, Email, First Name, and Last Name.");
      return;
    }
     if ((userFormData.user_type === 'branch' || userFormData.user_type === 'agent') && !userFormData.branch) {
      toast.error(`Please select a branch for this ${getUserTypeLabel(userFormData.user_type)}.`);
      return;
    }

    // Prepare data for PATCH/PUT (UpdateUserData type)
    const dataToSubmit: UpdateUserData = {
        username: userFormData.username,
        first_name: userFormData.first_name,
        last_name: userFormData.last_name,
        email: userFormData.email,
        gender: userFormData.gender,
        phone: userFormData.phone,
        address: userFormData.address,
        user_type: userFormData.user_type,
        branch: userFormData.branch,
        is_active: userFormData.is_active,
        // Password is not sent here - should be handled via a separate mechanism if needed
     };

    updateUserMutation.mutate({ userId: selectedUser.id, updatedData: dataToSubmit });
  };

  const confirmDeleteAction = () => {
    if (userToDelete?.id) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  };


  // --- Render ---
  return (
    <DashboardLayout title={isBranchAdmin ? "Customer/Agent Management" : "User Management"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center w-full sm:w-auto gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input 
                placeholder={isBranchAdmin ? "Search customers/agents..." : "Search users..."}
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoadingUsers}
              />
            </div>
            
            {/* Role Filter (only for non-branch admins) */}
            <PermissionGate permission="manage_admin_users">
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter} disabled={isLoadingUsers}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="branch">Branch Manager</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </PermissionGate>
          </div>
          
          {/* Add User Button */}
          <Button 
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={handleAddClick}
          >
            <UserPlus size={16} />
            <span>{isBranchAdmin ? "Add Customer/Agent" : "Add New User"}</span>
          </Button>
        </div>

        {/* Error Loading Data */}
        {isErrorUsers && (
           <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Users</AlertTitle>
            <AlertDescription>
              {errorUsers?.message || 'An unexpected error occurred.'} Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}
        {isErrorBranches && !isLoadingBranches && (
             <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning Loading Branches</AlertTitle>
              <AlertDescription>
                {errorBranches?.message || 'Could not load branch list.'} Branch assignment might be unavailable.
              </AlertDescription>
            </Alert>
        )}
        
        {/* User list table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                {!isBranchAdmin && <TableHead>Role</TableHead>}
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingUsers ? (
                 [...Array(10)].map((_, i) => (
                  <TableRow key={`skel-${i}`}>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    {!isBranchAdmin && <TableCell><Skeleton className="h-5 w-full" /></TableCell>}
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isBranchAdmin ? 6 : 7} className="h-24 text-center">
                    No users found{searchTerm || userTypeFilter !== 'all' ? ' matching your criteria' : ''}.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((userData) => (
                  <TableRow key={userData.id}>
                    <TableCell className="font-medium">{userData.id}</TableCell>
                    <TableCell>{`${userData.first_name || ''} ${userData.last_name || ''}`.trim() || '-'}</TableCell>
                    <TableCell>{userData.username}</TableCell>
                    <TableCell>{userData.email}</TableCell>
                    {!isBranchAdmin && (
                      <TableCell>
                        <Badge className={getUserTypeColor(userData.user_type)} variant="outline">
                          {getUserTypeLabel(userData.user_type)}
                        </Badge>
                      </TableCell>
                    )}
                      <TableCell>
                         {getBranchName(userData.branch)}
                      </TableCell>
                    <TableCell>
                      <Badge variant={userData.is_active ? "default" : "outline"}>
                        {userData.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                           size="icon"
                           onClick={() => handleViewClick(userData)}
                           title="View Details"
                           className="hover:bg-accent"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                           size="icon"
                           onClick={() => handleEditClick(userData)}
                           title="Edit User"
                           className="hover:bg-accent"
                           disabled={!userData.is_active && currentUser?.id !== userData.id} // Can't edit inactive unless it's yourself? Maybe adjust logic
                      >
                        <Edit size={16} />
                      </Button>
                         {/* Prevent deleting oneself */}
                         {currentUser?.id !== userData.id && (
                      <Button 
                        variant="ghost" 
                                size="icon"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => handleDeleteClick(userData)}
                                title="Delete User"
                                disabled={deleteUserMutation.isPending && userToDelete?.id === userData.id}
                      >
                        <Trash2 size={16} />
                      </Button>
                         )}
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
         {/* --- Dialogs --- */}

        {/* Add/Edit User Dialog */}
        <Dialog open={isAddUserOpen || isEditUserOpen} onOpenChange={(open) => { 
            if (!open) {
              setIsAddUserOpen(false);
              setIsEditUserOpen(false);
              resetUserForm(); 
            } else {
              // Reset form on open, unless it's edit pre-fill
              if (isAddUserOpen && !isEditUserOpen) resetUserForm();
              if (open && !isAddUserOpen && !isEditUserOpen) {
                 // This case should ideally not happen, but reset if it does
                 resetUserForm();
                 setIsAddUserOpen(true); // Default to add if opened externally?
              }
            }
        }}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditUserOpen ? "Edit User" : (isBranchAdmin ? "Add Customer/Agent" : "Add New User")}</DialogTitle>
              <DialogDescription>
                 {isEditUserOpen ? `Update details for ${selectedUser?.first_name} ${selectedUser?.last_name}` : `Fill in the details below.`}
              </DialogDescription>
            </DialogHeader>
            {/* Form Grid */} 
            <div className="grid grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
               {/* First Name */}
               <div className="space-y-1">
                <Label htmlFor="first_name">First Name *</Label>
                <Input id="first_name" value={userFormData.first_name} onChange={handleFormChange} required/>
              </div>
              {/* Last Name */}
              <div className="space-y-1">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input id="last_name" value={userFormData.last_name} onChange={handleFormChange} required/>
              </div>
              {/* Username */}
              <div className="space-y-1">
                <Label htmlFor="username">Username *</Label>
                <Input id="username" value={userFormData.username} onChange={handleFormChange} required/>
              </div>
              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={userFormData.email} onChange={handleFormChange} required/>
              </div>
              {/* Password (only for Add User) */} 
              {isAddUserOpen && (
                <>
                <div className="space-y-1 col-span-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" type="password" value={userFormData.password || ''} onChange={handleFormChange} required/>
                  <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {passwordError && (
                  <div className="col-span-2">
                    <p className="text-xs text-destructive">{passwordError}</p>
                  </div>
                )}
                </>
              )}
              {/* Phone */} 
              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={userFormData.phone || ''} onChange={handleFormChange} />
              </div>
              {/* Gender */} 
              <div className="space-y-1">
                <Label htmlFor="gender">Gender</Label>
                <Select value={userFormData.gender || 'not_specified'} onValueChange={(v) => handleSelectChange('gender', v)}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_specified">Not Specified</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Address */} 
              <div className="space-y-1 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={userFormData.address || ''} onChange={handleFormChange} />
              </div>
              
              {/* User Role (SuperAdmin only, unless branch admin adding customer/agent) */} 
              <PermissionGate permission="manage_admin_users" fallback={
                  // Branch admins see a fixed role based on context
                  isBranchAdmin && (
                     <div className="space-y-1 col-span-2">
                       <Label>User Role</Label>
                       <Select value={userFormData.user_type} onValueChange={(v) => handleSelectChange('user_type', v)}>
                         <SelectTrigger><SelectValue /></SelectTrigger>
                         <SelectContent>
                           <SelectItem value="customer">Customer</SelectItem>
                           <SelectItem value="agent">Agent</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                  )
              }>
                 {/* Super Admin Role Selector */} 
                 <div className="space-y-1 col-span-2">
                  <Label htmlFor="user_type">User Role *</Label>
                   <Select value={userFormData.user_type} onValueChange={(v) => handleSelectChange('user_type', v)} required>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="branch">Branch Manager</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </PermissionGate>
              
               {/* Branch Selector Logic */} 
               {/* Show if: SuperAdmin AND (role is branch/agent/customer) OR BranchAdmin AND (role is agent/customer) */} 
               {( (isSuperAdmin && ['branch', 'agent', 'customer'].includes(userFormData.user_type || '')) || 
                  (isBranchAdmin && ['agent', 'customer'].includes(userFormData.user_type || '')) 
                ) && (
                <div className="space-y-1 col-span-2">
                  <Label htmlFor="branch">Branch Assignment *</Label>
                  <Select 
                    value={userFormData.branch ? String(userFormData.branch) : 'not_assigned'} 
                    onValueChange={(v) => handleSelectChange('branch', v)}
                    disabled={isBranchAdmin || isLoadingBranches || isErrorBranches} // BranchAdmin fixed, disable if loading/error
                    required={(userFormData.user_type === 'branch' || userFormData.user_type === 'agent')} // Required for branch/agent
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch..." />
                    </SelectTrigger>
                    <SelectContent>
                       {isLoadingBranches ? (
                         <SelectItem value="loading" disabled>Loading branches...</SelectItem>
                       ) : isErrorBranches ? (
                          <SelectItem value="error" disabled>Error loading branches</SelectItem>
                       ) : branches.length === 0 ? (
                          <SelectItem value="no-branch" disabled>No branches available</SelectItem>
                       ) : (
                          [<SelectItem key="no-assign" value="not_assigned">Not Assigned</SelectItem>].concat(
                            branches.map((branch) => (
                        <SelectItem key={branch.id} value={String(branch.id)}>
                                {branch.name} (ID: {branch.id})
                        </SelectItem>
                            ))
                          )
                       )}
                    </SelectContent>
                  </Select>
                  {isBranchAdmin && (
                    <p className="text-xs text-muted-foreground">Users will be assigned to your branch: {getBranchName(userBranchId)}</p>
                  )}
                   {(userFormData.user_type === 'branch' || userFormData.user_type === 'agent') && (
                      <p className="text-xs text-destructive">Branch assignment is required for Branch Managers and Agents.</p>
                  )}
                </div>
              )}
              
              {/* Status Toggle */} 
               <div className="space-y-1 col-span-2">
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="is_active" 
                    checked={userFormData.is_active} 
                    onCheckedChange={(checked) => handleCheckboxChange('is_active', !!checked)}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">Active User</Label>
                </div>
                <p className="text-xs text-muted-foreground">Inactive users cannot login.</p>
              </div>

            </div>
            {/* Dialog Footer */} 
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddUserOpen(false);
                setIsEditUserOpen(false);
                resetUserForm();
              }}>Cancel</Button>
              <Button onClick={isEditUserOpen ? handleSaveUpdate : handleSaveAdd} disabled={addUserMutation.isPending || updateUserMutation.isPending}>
                {isEditUserOpen 
                    ? (updateUserMutation.isPending ? 'Updating...' : 'Update User') 
                    : (addUserMutation.isPending ? 'Adding...' : (isBranchAdmin ? 'Add User' : 'Add User'))} 
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* View User Dialog */}
        {selectedUser && (
          <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>User Details: {selectedUser.first_name} {selectedUser.last_name}</DialogTitle>
                <DialogDescription>
                  Viewing details for @{selectedUser.username}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 py-4 max-h-[70vh] overflow-y-auto pr-2 text-sm">
                <div><Label className="text-xs text-muted-foreground block">ID</Label><p>{selectedUser.id}</p></div>
                <div><Label className="text-xs text-muted-foreground block">Username</Label><p>{selectedUser.username}</p></div>
                <div><Label className="text-xs text-muted-foreground block">Name</Label><p>{selectedUser.first_name} {selectedUser.last_name}</p></div>
                <div><Label className="text-xs text-muted-foreground block">Email</Label><p>{selectedUser.email}</p></div>
                <div><Label className="text-xs text-muted-foreground block">Role</Label><Badge className={getUserTypeColor(selectedUser.user_type)} variant="outline">{getUserTypeLabel(selectedUser.user_type)}</Badge></div>
                <div><Label className="text-xs text-muted-foreground block">Status</Label><Badge variant={selectedUser.is_active ? "default" : "outline"}>{selectedUser.is_active ? "Active" : "Inactive"}</Badge></div>
                {selectedUser.user_type !== 'superadmin' && (
                  <div><Label className="text-xs text-muted-foreground block">Branch</Label><p>{getBranchName(selectedUser.branch)}</p></div>
                )}
                {selectedUser.phone && <div><Label className="text-xs text-muted-foreground block">Phone</Label><p>{selectedUser.phone}</p></div>}
                {selectedUser.gender && <div><Label className="text-xs text-muted-foreground block">Gender</Label><p>{selectedUser.gender}</p></div>}
                {selectedUser.address && <div className="col-span-2"><Label className="text-xs text-muted-foreground block">Address</Label><p className="whitespace-pre-wrap">{selectedUser.address}</p></div>}
                <div><Label className="text-xs text-muted-foreground block">Created At</Label><p>{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : 'N/A'}</p></div>
                <div><Label className="text-xs text-muted-foreground block">Last Updated</Label><p>{selectedUser.updated_at ? new Date(selectedUser.updated_at).toLocaleString() : 'N/A'}</p></div>
                 {selectedUser.last_login && <div><Label className="text-xs text-muted-foreground block">Last Login</Label><p>{new Date(selectedUser.last_login).toLocaleString()}</p></div>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewUserOpen(false)}>Close</Button>
                 {/* Allow editing if user is active OR if current user is editing themselves */} 
                 {(selectedUser.is_active || currentUser?.id === selectedUser.id) && (
                    <Button onClick={() => { setIsViewUserOpen(false); handleEditClick(selectedUser); }}>Edit User</Button>
                 )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the user "{userToDelete?.username}" ({userToDelete?.first_name} {userToDelete?.last_name})? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setIsDeleting(false); setUserToDelete(null); }} disabled={deleteUserMutation.isPending}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDeleteAction} disabled={deleteUserMutation.isPending}>
                 {deleteUserMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
