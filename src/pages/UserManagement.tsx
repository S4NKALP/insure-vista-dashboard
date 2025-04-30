
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
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
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userType, setUserType] = useState('all');
  const [newUser, setNewUser] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    phone: '',
    address: '',
    user_type: 'customer',
    branch: null
  });

  useEffect(() => {
    // Load users from the sample data
    setUsers(sampleData.users || []);
    setFilteredUsers(sampleData.users || []);
  }, []);

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
    
    // Simulate adding a new user
    const newUserId = Math.max(...users.map(u => u.id), 0) + 1;
    const userToAdd = {
      ...newUser,
      id: newUserId,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setUsers([...users, userToAdd]);
    setIsAddUserOpen(false);
    setNewUser({
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      gender: '',
      phone: '',
      address: '',
      user_type: 'customer',
      branch: null
    });
    
    toast.success("User added successfully");
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewUserOpen(true);
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

  // Add the filter function that was omitted above
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

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        {/* Header with search and filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
              <Input 
                placeholder="Search users..." 
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
          </div>
          
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsAddUserOpen(true)}
          >
            <UserPlus size={16} />
            <span>Add New User</span>
          </Button>
        </div>
        
        {/* User list table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableCaption>List of all users in the system</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{`${user.first_name || ''} ${user.last_name || ''}`}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getUserTypeColor(user.user_type)}>
                        {getUserTypeLabel(user.user_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "outline"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input 
                  id="first_name" 
                  value={newUser.first_name}
                  onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input 
                  id="last_name" 
                  value={newUser.last_name}
                  onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input 
                  id="username" 
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={newUser.gender} 
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
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={newUser.phone || ''}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address"
                value={newUser.address || ''}
                onChange={(e) => setNewUser({...newUser, address: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user_type">User Role *</Label>
              <Select 
                value={newUser.user_type} 
                onValueChange={(value) => setNewUser({...newUser, user_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  {user?.role === 'superadmin' && (
                    <>
                      <SelectItem value="branch">Branch Manager</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {newUser.user_type === 'branch' && (
              <div className="space-y-2">
                <Label htmlFor="branch">Select Branch</Label>
                <Select 
                  value={newUser.branch ? String(newUser.branch) : ''} 
                  onValueChange={(value) => setNewUser({...newUser, branch: Number(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleData.branches?.map(branch => (
                      <SelectItem key={branch.id} value={String(branch.id)}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Save User</Button>
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
            <div className="grid gap-4 py-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                    <p>{selectedUser.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <Badge className={getUserTypeColor(selectedUser.user_type)}>
                      {getUserTypeLabel(selectedUser.user_type)}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <Badge variant={selectedUser.is_active ? "default" : "outline"}>
                      {selectedUser.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p>{selectedUser.first_name} {selectedUser.last_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Username</h3>
                    <p>{selectedUser.username}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p>{selectedUser.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p>{selectedUser.address || 'Not provided'}</p>
                </div>
                
                {selectedUser.branch && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Branch</h3>
                    <p>{sampleData.branches?.find(b => b.id === selectedUser.branch)?.name || 'Unknown Branch'}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                    <p>{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <p>{new Date(selectedUser.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              {/* Policy holder information if the user is a customer */}
              {selectedUser.user_type === 'customer' && (
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText size={16} />
                    Policy Information
                  </h3>
                  
                  {sampleData.policy_holders?.filter(policy => 
                    sampleData.customers?.find(c => 
                      c.user_details?.id === selectedUser.id && c.id === policy.customer?.id
                    )
                  ).length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Policy Number</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Sum Assured</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleData.policy_holders?.filter(policy => 
                          sampleData.customers?.find(c => 
                            c.user_details?.id === selectedUser.id && c.id === policy.customer?.id
                          )
                        ).map(policy => (
                          <TableRow key={policy.id}>
                            <TableCell>{policy.policy_number}</TableCell>
                            <TableCell>{policy.policy?.name || 'Unknown'}</TableCell>
                            <TableCell>Rs. {parseFloat(policy.sum_assured).toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={policy.status === 'Active' ? 'default' : 'outline'}>
                                {policy.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No policies found for this customer.</p>
                  )}
                </div>
              )}
              
              {/* Agent information if the user has an agent role */}
              {selectedUser.user_type === 'agent' && (
                <div>
                  <h3 className="font-medium">Agent Information</h3>
                  {sampleData.sales_agents?.find(agent => agent.application?.user === selectedUser.id) ? (
                    <div className="bg-gray-50 p-4 rounded-lg mt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Agent Code</h4>
                          <p>{sampleData.sales_agents.find(agent => agent.application?.user === selectedUser.id)?.agent_code}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Commission Rate</h4>
                          <p>{sampleData.sales_agents.find(agent => agent.application?.user === selectedUser.id)?.commission_rate}%</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No agent information found.</p>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewUserOpen(false)}>Close</Button>
              <Button variant="default">
                <Edit size={16} className="mr-2" />
                Edit User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default UserManagement;
