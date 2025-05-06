import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Policy, GSVRate, SSVConfig } from '../../types';
import {
  addPolicy,
  updatePolicy,
  addGSVRate,
  updateGSVRate,
  deleteGSVRate,
  addSSVConfig,
  updateSSVConfig,
  deleteSSVConfig,
} from '../../api/mock/api';

interface PolicyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (policy: Policy) => void;
  policy: Policy | null;
}

const PolicyForm: React.FC<PolicyFormProps> = ({ open, onClose, onSubmit, policy }) => {
  const [formData, setFormData] = useState<Partial<Policy>>({
    name: '',
    policy_code: '',
    policy_type: '',
    base_multiplier: '',
    min_sum_assured: '',
    max_sum_assured: '',
    include_adb: false,
    include_ptd: false,
    adb_percentage: '',
    ptd_percentage: '',
    description: '',
    guaranteed_interest_rate: '',
    terminal_bonus_rate: '',
  });

  const [gsvRates, setGsvRates] = useState<GSVRate[]>([]);
  const [ssvConfigs, setSsvConfigs] = useState<SSVConfig[]>([]);
  const [newGsvRate, setNewGsvRate] = useState<Partial<GSVRate>>({
    min_year: 0,
    max_year: 0,
    rate: '',
  });
  const [newSsvConfig, setNewSsvConfig] = useState<Partial<SSVConfig>>({
    min_year: 0,
    max_year: 0,
    ssv_factor: '',
    eligibility_years: '',
  });

  useEffect(() => {
    if (policy) {
      setFormData(policy);
      setGsvRates(policy.gsv_rates || []);
      setSsvConfigs(policy.ssv_configs || []);
    } else {
      setFormData({
        name: '',
        policy_code: '',
        policy_type: '',
        base_multiplier: '',
        min_sum_assured: '',
        max_sum_assured: '',
        include_adb: false,
        include_ptd: false,
        adb_percentage: '',
        ptd_percentage: '',
        description: '',
        guaranteed_interest_rate: '',
        terminal_bonus_rate: '',
      });
      setGsvRates([]);
      setSsvConfigs([]);
    }
  }, [policy]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGsvRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGsvRate(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSsvConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSsvConfig(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddGsvRate = async () => {
    if (!newGsvRate.min_year || !newGsvRate.max_year || !newGsvRate.rate) return;

    try {
      const response = await addGSVRate(policy?.id || 0, {
        ...newGsvRate,
        policy: policy?.id || 0,
      } as GSVRate);

      if (response.success && response.data) {
        setGsvRates(prev => [...prev, response.data]);
        setNewGsvRate({
          min_year: 0,
          max_year: 0,
          rate: '',
        });
      }
    } catch (error) {
      console.error('Error adding GSV rate:', error);
    }
  };

  // In the handleAddSsvConfig function
const handleAddSsvConfig = async () => {
  if (!newSsvConfig.min_year || !newSsvConfig.max_year || !newSsvConfig.ssv_factor || !newSsvConfig.eligibility_years) return;

  try {
    // You're missing the policyId parameter here
    const response = await addSSVConfig(policy?.id || 0, {
      ...newSsvConfig,
    } as Omit<SSVConfig, "id" | "policy">);

    if (response.success && response.data) {
      setSsvConfigs(prev => [...prev, response.data]);
      setNewSsvConfig({
        min_year: 0,
        max_year: 0,
        ssv_factor: '',
        eligibility_years: '',
      });
    }
  } catch (error) {
    console.error('Error adding SSV config:', error);
  }
};

  const handleDeleteGsvRate = async (id: number) => {
    try {
      const response = await deleteGSVRate(id);
      if (response.success) {
        setGsvRates(prev => prev.filter(rate => rate.id !== id));
      }
    } catch (error) {
      console.error('Error deleting GSV rate:', error);
    }
  };

  const handleDeleteSsvConfig = async (id: number) => {
    try {
      const response = await deleteSSVConfig(id);
      if (response.success) {
        setSsvConfigs(prev => prev.filter(config => config.id !== id));
      }
    } catch (error) {
      console.error('Error deleting SSV config:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (policy) {
        response = await updatePolicy(policy.id, formData);
      } else {
        response = await addPolicy(formData as Omit<Policy, 'id' | 'created_at'>);
      }

      if (response.success && response.data) {
        onSubmit(response.data);
      }
    } catch (error) {
      console.error('Error saving policy:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{policy ? 'Edit Policy' : 'Add New Policy'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Policy Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Policy Code"
                name="policy_code"
                value={formData.policy_code}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Policy Type"
                name="policy_type"
                value={formData.policy_type}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Base Multiplier"
                name="base_multiplier"
                type="number"
                value={formData.base_multiplier}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Min Sum Assured"
                name="min_sum_assured"
                type="number"
                value={formData.min_sum_assured}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Sum Assured"
                name="max_sum_assured"
                type="number"
                value={formData.max_sum_assured}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Guaranteed Interest Rate"
                name="guaranteed_interest_rate"
                type="number"
                value={formData.guaranteed_interest_rate}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Terminal Bonus Rate"
                name="terminal_bonus_rate"
                type="number"
                value={formData.terminal_bonus_rate}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.include_adb}
                    onChange={handleInputChange}
                    name="include_adb"
                  />
                }
                label="Include ADB"
              />
              {formData.include_adb && (
                <TextField
                  fullWidth
                  label="ADB Percentage"
                  name="adb_percentage"
                  type="number"
                  value={formData.adb_percentage}
                  onChange={handleInputChange}
                  required
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.include_ptd}
                    onChange={handleInputChange}
                    name="include_ptd"
                  />
                }
                label="Include PTD"
              />
              {formData.include_ptd && (
                <TextField
                  fullWidth
                  label="PTD Percentage"
                  name="ptd_percentage"
                  type="number"
                  value={formData.ptd_percentage}
                  onChange={handleInputChange}
                  required
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* GSV Rates Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              GSV Rates
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Min Year"
                  type="number"
                  value={newGsvRate.min_year}
                  onChange={handleGsvRateChange}
                  name="min_year"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Max Year"
                  type="number"
                  value={newGsvRate.max_year}
                  onChange={handleGsvRateChange}
                  name="max_year"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Rate"
                  type="number"
                  value={newGsvRate.rate}
                  onChange={handleGsvRateChange}
                  name="rate"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddGsvRate}
                  sx={{ mt: 1 }}
                >
                  Add Rate
                </Button>
              </Grid>
            </Grid>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Min Year</TableCell>
                    <TableCell>Max Year</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gsvRates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell>{rate.min_year}</TableCell>
                      <TableCell>{rate.max_year}</TableCell>
                      <TableCell>{rate.rate}%</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteGsvRate(rate.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* SSV Configs Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              SSV Configurations
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Min Year"
                  type="number"
                  value={newSsvConfig.min_year}
                  onChange={handleSsvConfigChange}
                  name="min_year"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Max Year"
                  type="number"
                  value={newSsvConfig.max_year}
                  onChange={handleSsvConfigChange}
                  name="max_year"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="ssv_factor"
                  type="number"
                  value={newSsvConfig.ssv_factor}
                  onChange={handleSsvConfigChange}
                  name="ssv_factor"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Eligibility Years"
                  type="number"
                  value={newSsvConfig.eligibility_years}
                  onChange={handleSsvConfigChange}
                  name="eligibility_years"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddSsvConfig}
                  sx={{ mt: 1 }}
                >
                  Add Config
                </Button>
              </Grid>
            </Grid>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Min Year</TableCell>
                    <TableCell>Max Year</TableCell>
                    <TableCell>ssv_factor</TableCell>
                    <TableCell>Eligibility Years</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ssvConfigs.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell>{config.min_year}</TableCell>
                      <TableCell>{config.max_year}</TableCell>
                      <TableCell>{config.ssv_factor}%</TableCell>
                      <TableCell>{config.eligibility_years}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSsvConfig(config.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {policy ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PolicyForm; 