import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import PermissionGate from '@/components/PermissionGate';
import {
  Table,
  TableBody,
  TableCaption,
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
  User,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText
} from 'lucide-react';
import sampleData from '@/utils/data';

const UserManagement = () => {
  const { user } = useAuth();
  const { isBranchAdmin, isSuperAdmin, userBranchId } = usePermissions();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userType, setUserType] = useState('all');
  const [branches, setBranches] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    phone: '',
    address: '',
    user_type: 'customer',
    branch: null,
    is_active: true
  });

  useEffect(() => {
    // Load users from the sample data
    let initialUsers = sampleData.users || [];
    
    // For branch admins, only show customers
    if (isBranchAdmin) {
      initialUsers = initialUsers.filter(user => user.user_type === 'customer');
    }
    
    setUsers(initialUsers);
    setFilteredUsers(initialUsers);
    
    // Load branches for assignment
    setBranches(sampleData.branches || []);
  }, [isBranchAdmin]);

  useEffect(() => {
    let filtered = [...users];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by user type
    if (userType !== 'all') {
      filtered = filtered.filter(user => user.user_type === userType);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, userType, users]);

  const handleAddUser = () => {
    // Validate form inputs
    if (!newUser.username || !newUser.email || !newUser.first_name || !newUser.last_name) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Branch admins can only add customers
    if (isBranchAdmin && newUser.user_type !== 'customer') {
      toast.error("You can only add customers");
      return;
    }
    
    // Require branch selection for branch managers and agents
    if ((newUser.user_type === 'branch' || newUser.user_type === 'agent') && !newUser.branch) {
      toast.error(`Please select a branch for this ${newUser.user_type === 'branch' ? 'branch manager' : 'agent'}`);
      return;
    }
    
    // Simulate adding a new user
    const newUserId = Math.max(...users.map(u => u.id), 0) + 1;
    const userToAdd = {
      ...newUser,
      id: newUserId,
      is_active: newUser.is_active || true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // For branch admins, set the branch automatically
      branch: isBranchAdmin ? userBranchId : newUser.branch
    };
    
    setUsers([...users, userToAdd]);
    setIsAddUserOpen(false);
    resetUserForm();
    
    toast.success("User added successfully");
  };

  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    setNewUser({
      ...userData,
      gender: userData.gender || '',
      phone: userData.phone || '',
      address: userData.address || '',
      // Ensure all required fields are present
      branch: userData.branch || null
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = () => {
    // Validate form inputs
    if (!newUser.username || !newUser.email || !newUser.first_name || !newUser.last_name) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Branch admins can only manage customers
    if (isBranchAdmin && newUser.user_type !== 'customer') {
      toast.error("You can only manage customers");
      return;
    }
    
    // Require branch selection for branch managers and agents
    if ((newUser.user_type === 'branch' || newUser.user_type === 'agent') && !newUser.branch) {
      toast.error(`Please select a branch for this ${newUser.user_type === 'branch' ? 'branch manager' : 'agent'}`);
      return;
    }
    
    // Update user
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? { 
            ...newUser, 
            updated_at: new Date().toISOString() 
          } 
        : user
    );
    
    setUsers(updatedUsers);
    setIsEditUserOpen(false);
    resetUserForm();
    
    toast.success("User updated successfully");
  };

  const handleDeleteUser = (userData) => {
    setUserToDelete(userData);
    setIsDeleting(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    
    const updatedUsers = users.filter(user => user.id !== userToDelete.id);
    setUsers(updatedUsers);
    setIsDeleting(false);
    setUserToDelete(null);
    
    toast.success("User deleted successfully");
  };

  const handleViewUser = (userData) => {
    setSelectedUser(userData);
    setIsViewUserOpen(true);
  };

  const resetUserForm = () => {
    setNewUser({
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      gender: '',
      phone: '',
      address: '',
      user_type: 'customer',
      branch: null,
      is_active: true
    });
    setSelectedUser(null);
  };

  const getBranchName = (branchId) => {
    if (!branchId) return 'Not Assigned';
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  const getUserTypeLabel = (type) => {
    switch (type) {
      case 'superadmin': return 'Super Admin';
      case 'branch': return 'Branch Manager';
      case 'agent': return 'Agent';
      case 'customer': return 'Customer';
      default: return type;
    }
  };

  const getUserTypeColor = (type) => {
    switch (type) {
      case 'superadmin': return 'bg-red-100 text-red-800';
      case 'branch': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-green-100 text-green-800';
      case 'customer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout title={isBranchAdmin ? "Customer Management" : "User Management"}>
      <div className="space-y-6">
        {/* Header with search and filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
              <Input 
                placeholder={isBranchAdmin ? "Search customers..." : "Search users..."}
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Only show role filter for superadmins */}
            <PermissionGate permission="manage_admin_users">
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger className="ml-2 w-[160px]">
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
          
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsAddUserOpen(true)}
          >
            <UserPlus size={16} />
            <span>{isBranchAdmin ? "Add New Customer" : "Add New User"}</span>
          </Button>
        </div>
        
        {/* User list table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableCaption>{isBranchAdmin ? "List of all customers" : "List of all users in the system"}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                {!isBranchAdmin && <TableHead>Role</TableHead>}
                {!isBranchAdmin && <TableHead>Branch</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((userData) => (
                  <TableRow key={userData.id}>
                    <TableCell className="font-medium">{userData.id}</TableCell>
                    <TableCell>{`${userData.first_name || ''} ${userData.last_name || ''}`}</TableCell>
                    <TableCell>{userData.username}</TableCell>
                    <TableCell>{userData.email}</TableCell>
                    {!isBranchAdmin && (
                      <TableCell>
                        <Badge className={getUserTypeColor(userData.user_type)}>
                          {getUserTypeLabel(userData.user_type)}
                        </Badge>
                      </TableCell>
                    )}
                    {!isBranchAdmin && (
                      <TableCell>
                        {(userData.user_type === 'branch' || userData.user_type === 'agent') && userData.branch ? (
                          getBranchName(userData.branch)
                        ) : (
                          userData.user_type === 'customer' && userData.branch ? getBranchName(userData.branch) : 'N/A'
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant={userData.is_active ? "default" : "outline"}>
                        {userData.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewUser(userData)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditUser(userData)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteUser(userData)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isBranchAdmin ? 6 : 8} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Add User Dialog */}
        <Dialog open={isAddUserOpen} onOpenChange={(open) => {
          setIsAddUserOpen(open);
          if (!open) resetUserForm();
        }}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isBranchAdmin ? "Add New Customer" : "Add New User"}</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new {isBranchAdmin ? "customer" : "user"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input 
                  id="first_name" 
                  value={newUser.first_name}
                  onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input 
                  id="last_name" 
                  value={newUser.last_name}
                  onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={newUser.phone || ''}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={newUser.gender || ''} 
                  onValueChange={(value) => setNewUser({...newUser, gender: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={newUser.address || ''}
                  onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                />
              </div>
              
              {/* Only show role selector for superadmins */}
              <PermissionGate permission="manage_admin_users">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="user_type">User Role</Label>
                  <Select 
                    value={newUser.user_type} 
                    onValueChange={(value) => setNewUser({...newUser, user_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="branch">Branch Manager</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </PermissionGate>
              
              {/* Show branch selector for branch managers and agents */}
              {((isSuperAdmin && (newUser.user_type === 'branch' || newUser.user_type === 'agent' || newUser.user_type === 'customer')) || 
                 (isBranchAdmin && newUser.user_type === 'customer')) && (
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="branch">Branch Assignment</Label>
                  <Select 
                    value={newUser.branch ? String(newUser.branch) : ''} 
                    onValueChange={(value) => setNewUser({...newUser, branch: value ? Number(value) : null})}
                    disabled={isBranchAdmin} // Branch admins can't change the branch
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={String(branch.id)}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isBranchAdmin && (
                    <p className="text-xs text-gray-500">Customers will be automatically assigned to your branch</p>
                  )}
                </div>
              )}
              
              {/* Status toggle for editing users */}
              <div className="space-y-2 col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="is_active" 
                    checked={!!newUser.is_active} 
                    onCheckedChange={(checked) => setNewUser({...newUser, is_active: !!checked})}
                  />
                  <Label htmlFor="is_active">Active User</Label>
                </div>
                <p className="text-xs text-gray-500">Inactive users cannot login to the system</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddUserOpen(false);
                resetUserForm();
              }}>Cancel</Button>
              <Button onClick={handleAddUser}>Add {isBranchAdmin ? "Customer" : "User"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit User Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={(open) => {
          setIsEditUserOpen(open);
          if (!open) resetUserForm();
        }}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update details for {newUser.first_name} {newUser.last_name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_first_name">First Name</Label>
                <Input 
                  id="edit_first_name" 
                  value={newUser.first_name}
                  onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_last_name">Last Name</Label>
                <Input 
                  id="edit_last_name" 
                  value={newUser.last_name}
                  onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_username">Username</Label>
                <Input 
                  id="edit_username" 
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_email">Email</Label>
                <Input 
                  id="edit_email" 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_phone">Phone</Label>
                <Input 
                  id="edit_phone" 
                  value={newUser.phone || ''}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_gender">Gender</Label>
                <Select 
                  value={newUser.gender || ''} 
                  onValueChange={(value) => setNewUser({...newUser, gender: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit_address">Address</Label>
                <Input 
                  id="edit_address" 
                  value={newUser.address || ''}
                  onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                />
              </div>
              
              {/* Only show role selector for superadmins */}
              <PermissionGate permission="manage_admin_users">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit_user_type">User Role</Label>
                  <Select 
                    value={newUser.user_type} 
                    onValueChange={(value) => setNewUser({...newUser, user_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="branch">Branch Manager</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </PermissionGate>
              
              {/* Show branch selector for branch managers and agents */}
              {((isSuperAdmin && (newUser.user_type === 'branch' || newUser.user_type === 'agent' || newUser.user_type === 'customer')) || 
                 (isBranchAdmin && newUser.user_type === 'customer')) && (
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit_branch">Branch Assignment</Label>
                  <Select 
                    value={newUser.branch ? String(newUser.branch) : ''} 
                    onValueChange={(value) => setNewUser({...newUser, branch: value ? Number(value) : null})}
                    disabled={isBranchAdmin} // Branch admins can't change the branch
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={String(branch.id)}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Status toggle */}
              <div className="space-y-2 col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit_is_active" 
                    checked={!!newUser.is_active} 
                    onCheckedChange={(checked) => setNewUser({...newUser, is_active: !!checked})}
                  />
                  <Label htmlFor="edit_is_active">Active User</Label>
                </div>
                <p className="text-xs text-gray-500">Inactive users cannot login to the system</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditUserOpen(false);
                resetUserForm();
              }}>Cancel</Button>
              <Button onClick={handleUpdateUser}>Update User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* View User Dialog */}
        {selectedUser && (
          <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Viewing details for {selectedUser.first_name} {selectedUser.last_name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">ID</Label>
                  <p>{selectedUser.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Username</Label>
                  <p>{selectedUser.username}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Name</Label>
                  <p>{selectedUser.first_name} {selectedUser.last_name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Email</Label>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Role</Label>
                  <Badge className={getUserTypeColor(selectedUser.user_type)}>
                    {getUserTypeLabel(selectedUser.user_type)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Status</Label>
                  <Badge variant={selectedUser.is_active ? "default" : "outline"}>
                    {selectedUser.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {selectedUser.user_type !== 'superadmin' && (
                  <div>
                    <Label className="text-sm text-gray-500">Branch</Label>
                    <p>{selectedUser.branch ? getBranchName(selectedUser.branch) : 'Not Assigned'}</p>
                  </div>
                )}
                {selectedUser.phone && (
                  <div>
                    <Label className="text-sm text-gray-500">Phone</Label>
                    <p>{selectedUser.phone}</p>
                  </div>
                )}
                {selectedUser.gender && (
                  <div>
                    <Label className="text-sm text-gray-500">Gender</Label>
                    <p>{selectedUser.gender}</p>
                  </div>
                )}
                {selectedUser.address && (
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-500">Address</Label>
                    <p>{selectedUser.address}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm text-gray-500">Created At</Label>
                  <p>{new Date(selectedUser.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Last Updated</Label>
                  <p>{new Date(selectedUser.updated_at).toLocaleString()}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewUserOpen(false)}>Close</Button>
                <Button onClick={() => {
                  setIsViewUserOpen(false);
                  handleEditUser(selectedUser);
                }}>Edit User</Button>
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
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {userToDelete && (
                <p className="font-medium">
                  {userToDelete.first_name} {userToDelete.last_name} ({getUserTypeLabel(userToDelete.user_type)})
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
