import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Collapse,
} from '@mui/material';
import {
  Edit as EditIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
} from '@mui/icons-material';
import { GSVRate, Policy, SSVConfig } from '@/types';
import { getPolicies } from '@/api/mock/api';

// Updated types based on the actual API response


interface PolicyListProps {
  onEdit: (policy: Policy) => void;
  onRefresh: () => void;
  loading: boolean;
  searchTerm: string;
  onView: (policy: Policy) => void;
}

export const PolicyList: React.FC<PolicyListProps> = ({ 
  onEdit, 
  onRefresh, 
  loading, 
  searchTerm, 
  onView 
}) => {
  const [expandedPolicy, setExpandedPolicy] = useState<number | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await getPolicies();
        if (response.success && response.data) {
          setPolicies(response.data);
        }
      } catch (error) {
        console.error('Error fetching policies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const handleExpandClick = (policyId: number) => {
    setExpandedPolicy(expandedPolicy === policyId ? null : policyId);
  };

  if (loading || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Filter policies based on search term
  const filteredPolicies = policies.filter(policy => 
    policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.policy_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Policy Name</TableCell>
            <TableCell>Policy Code</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Min Sum Assured</TableCell>
            <TableCell>Max Sum Assured</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPolicies.map((policy) => (
            <React.Fragment key={policy.id}>
              <TableRow>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleExpandClick(policy.id)}
                  >
                    {expandedPolicy === policy.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </TableCell>
                <TableCell>{policy.name}</TableCell>
                <TableCell>{policy.policy_code}</TableCell>
                <TableCell>{policy.policy_type}</TableCell>
                <TableCell>{policy.min_sum_assured}</TableCell>
                <TableCell>{policy.max_sum_assured}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(policy)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                  <Collapse in={expandedPolicy === policy.id} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 2 }}>
                      <Typography variant="h6" gutterBottom component="div">
                        Policy Details
                      </Typography>
                      
                      {/* GSV Rates Section */}
                      <Typography variant="subtitle1" gutterBottom>
                        GSV Rates
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Min Year</TableCell>
                            <TableCell>Max Year</TableCell>
                            <TableCell>Rate</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {policy.gsv_rates?.map((rate: GSVRate) => (
                            <TableRow key={rate.id}>
                              <TableCell>{rate.min_year}</TableCell>
                              <TableCell>{rate.max_year}</TableCell>
                              <TableCell>{rate.rate}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* SSV Configs Section */}
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        SSV Configurations
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Min Year</TableCell>
                            <TableCell>Max Year</TableCell>
                            <TableCell>Factor</TableCell>
                            <TableCell>Eligibility Years</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {policy.ssv_configs?.map((config: SSVConfig) => (
                            <TableRow key={config.id}>
                              <TableCell>{config.min_year}</TableCell>
                              <TableCell>{config.max_year}</TableCell>
                              <TableCell>{config.ssv_factor}%</TableCell>
                              <TableCell>{config.eligibility_years}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Additional Policy Details */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Additional Information
                        </Typography>
                        <Typography variant="body2">
                          Base Multiplier: {policy.base_multiplier}
                        </Typography>
                        <Typography variant="body2">
                          Guaranteed Interest Rate: {parseFloat(policy.guaranteed_interest_rate) * 100}%
                        </Typography>
                        <Typography variant="body2">
                          Terminal Bonus Rate: {parseFloat(policy.terminal_bonus_rate) * 100}%
                        </Typography>
                        <Typography variant="body2">
                          ADB Included: {policy.include_adb ? 'Yes' : 'No'}
                          {policy.include_adb && ` (${parseFloat(policy.adb_percentage) * 100}%)`}
                        </Typography>
                        <Typography variant="body2">
                          PTD Included: {policy.include_ptd ? 'Yes' : 'No'}
                          {policy.include_ptd && ` (${parseFloat(policy.ptd_percentage) * 100}%)`}
                        </Typography>
                      </Box>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PolicyList;