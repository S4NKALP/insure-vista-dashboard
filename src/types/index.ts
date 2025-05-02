// Common interfaces for the entire application

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  gender?: string;
  phone?: string | null;
  address?: string | null;
  user_type: 'superadmin' | 'branch' | 'agent' | 'customer';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  branch?: number | null;
  password?: string;
  last_login?: string;
  is_superuser?: boolean;
  is_staff?: boolean;
  agent?: number | null;
  groups?: any[];
  user_permissions?: any[];
}

export interface Branch {
  id: number;
  name: string;
  branch_code: number;
  location: string;
  company: number;
  company_name: string;
  user?: number;
  user_details?: User;
}

export interface Company {
  id: number;
  name: string;
  company_code: number;
  address: string;
  logo?: string | null;
  email: string;
  is_active: boolean;
  phone_number: string;
}

export interface Customer {
  id: number;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  email: string;
  phone_number?: string | null;
  address?: string | null;
  profile_picture?: string | null;
  gender: string;
  user_details?: User;
  created_at: string;
  updated_at: string;
}

export interface Policy {
  id: number;
  name: string;
  policy_code: string;
  policy_type: string;
  base_multiplier: string;
  min_sum_assured: string;
  max_sum_assured: string;
  include_adb: boolean;
  include_ptd: boolean;
  adb_percentage: string;
  ptd_percentage: string;
  description: string;
  created_at: string;
  guaranteed_interest_rate: string;
  terminal_bonus_rate: string;
  gsv_rates?: GSVRate[];
  ssv_configs?: SSVConfig[];
}

export interface PolicyHolder {
  id: number;
  customer_name: string;
  policy_name: string;
  agent_name: string;
  policy_number: string;
  duration_years: number;
  sum_assured: string;
  status: string;
  payment_status: string;
  start_date: string;
  maturity_date: string;
  customer?: {
    id: number;
    user: number;
  } | Partial<Customer>;
  policy?: Partial<Policy>;
  branch?: Partial<Branch>;
  company?: Partial<Company>;
  agent?: Partial<SalesAgent>;
  // Additional properties
  date_of_birth?: string;
  age?: number;
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string | null;
  nominee_name?: string;
  nominee_document_type?: string;
  nominee_document_number?: number;
  nominee_document_front?: string;
  nominee_document_back?: string;
  nominee_pp_photo?: string;
  nominee_relation?: string;
  include_adb?: boolean;
  include_ptd?: boolean;
  health_history?: string | null;
  habits?: string | null;
  exercise_frequency?: string;
  alcoholic?: boolean;
  smoker?: boolean;
  family_medical_history?: string;
  yearly_income?: string;
  assets_details?: string;
  payment_interval?: string;
  risk_category?: string;
  past_medical_report?: string | null;
  recent_medical_reports?: string | null;
  occupation?: number | null;
}

export interface SalesAgent {
  id: number;
  branch_name: string;
  agent_name: string;
  agent_code: string;
  is_active: boolean;
  commission_rate: string;
  total_policies_sold: number;
  status: string;
  branch: number;
  joining_date?: string;
  total_premium_collected?: string;
  last_policy_date?: string;
  termination_date?: string | null;
  termination_reason?: string | null;
  application?: {
    id: number;
    user: number;
  };
}

export interface AgentApplication {
  id: number;
  branch_name: string;
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  grand_father_name?: string | null;
  grand_mother_name?: string | null;
  date_of_birth: string;
  gender: string;
  email: string;
  phone_number: string;
  address: string;
  resume?: string | null;
  citizenship_front?: string | null;
  citizenship_back?: string | null;
  license_front?: string | null;
  license_back?: string | null;
  pp_photo?: string | null;
  license_number?: string | null;
  license_issue_date?: string | null;
  license_expiry_date?: string | null;
  license_type?: string | null;
  license_issue_district?: string | null;
  license_issue_zone?: string | null;
  license_issue_province?: string | null;
  license_issue_country?: string | null;
  status: string;
  created_at: string;
  branch: number;
}

export interface AgentReport {
  id: number;
  agent_name: string;
  branch_name: string;
  reporting_period: string;
  policies_sold: number;
  total_premium: string;
  commission_earned: string;
  branch: number;
  report_date?: string;
  target_achievement?: string;
  renewal_rate?: string;
  customer_retention?: string;
  agent?: number;
}

export interface MortalityRate {
  id: number;
  age_group_start: number;
  age_group_end: number;
  rate: string;
}

export interface GSVRate {
  id: number;
  min_year: number;
  max_year: number;
  rate: string;
  policy: number;
}

export interface SSVConfig {
  min_year: number;
  max_year: number;
  factor: string;
  eligibility_years: string;
  policy: number;
}

export interface UnderwritingData {
  id: number;
  policy_holder_number: string;
  customer_name: string;
  risk_assessment_score: string;
  risk_category: string;
  manual_override: boolean;
  remarks: string | null;
  last_updated_by: string;
  last_updated_at: string;
  policy_holder: number;
}

export interface ClaimRequest {
  id: number;
  policy_holder_number: string;
  customer_name: string;
  branch_name: string;
  claim_date: string;
  status: string;
  reason: string;
  other_reason: string;
  documents: string | null;
  claim_amount: string;
  policy_holder: number;
  branch: number;
}

export interface ClaimProcessing {
  id: number;
  claim_number: string;
  branch_name: string;
  company_name: string;
  processing_status: string;
  remarks: string;
  processed_at: string;
  claim_request: number;
  branch: number;
  company: number;
}

export interface PaymentProcessing {
  id: number;
  claim_number: string;
  branch_name: string;
  company_name: string;
  processing_status: string;
  amount_paid: string;
  payment_date: string;
  payment_reference: string | null;
  claim_request: number;
  branch: number;
  company: number;
}

export interface PremiumPayment {
  id: number;
  policy_holder_number: string;
  customer_name: string;
  annual_premium: string;
  interval_payment: string;
  total_paid: string;
  paid_amount: string;
  next_payment_date: string;
  fine_due: string;
  total_premium: string;
  remaining_premium: string;
  gsv_value: string;
  ssv_value: string;
  payment_status: string;
  policy_holder: number;
}

export interface Loan {
  id: number;
  policy_holder_number: string;
  customer_name: string;
  loan_amount: string;
  interest_rate: string;
  remaining_balance: string;
  accrued_interest: string;
  loan_status: string;
  last_interest_date: string;
  created_at: string;
  updated_at: string;
  policy_holder: number;
}

export interface LoanRepayment {
  id: number;
  loan_id: number;
  policy_holder_number: string;
  repayment_date: string;
  amount: string;
  repayment_type: string;
  remaining_loan_balance: string;
  loan: number;
}

export interface BonusRate {
  id: number;
  policy_name: string;
  year: number;
  min_year: number;
  max_year: number;
  bonus_per_thousand: string;
  policy: number;
}

export interface KYC {
  id: number;
  document_type: string;
  document_number: string;
  document_front: string;
  document_back: string;
  pan_number: string | null;
  pan_front: string | null;
  pan_back: string | null;
  pp_photo: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  nearest_hospital: string;
  natural_hazard_exposure: string;
  status: string;
  customer: Customer[];
}

export interface DurationFactor {
  id: number;
  min_duration: number;
  max_duration: number;
  factor: string;
  policy_type: string;
}

// Complete data structure type
export interface AppData {
  users: User[];
  companies: Company[];
  branches: Branch[];
  insurance_policies: Policy[];
  customers: Customer[];
  policy_holders: PolicyHolder[];
  sales_agents: SalesAgent[];
  agent_reports: AgentReport[];
  mortality_rates: MortalityRate[];
  gsv_rates: GSVRate[];
  ssv_configs: SSVConfig[];
  underwriting: UnderwritingData[];
  claim_requests?: ClaimRequest[];
  claim_processing?: ClaimProcessing[];
  payment_processing?: PaymentProcessing[];
  premium_payments?: PremiumPayment[];
  loans?: Loan[];
  loan_repayments?: LoanRepayment[];
  bonus_rates?: BonusRate[];
  kyc?: KYC[];
  duration_factors?: DurationFactor[];
  agent_applications?: AgentApplication[];
  occupations?: any[];
}

// Response type for API calls
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  success: boolean;
} 