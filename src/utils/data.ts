
// This file provides access to the sample data that would normally come from an API
// We're defining the data structure types and exporting the data

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
  // Adding password property to User type since it's used in the data
  password?: string;
  last_login?: string;
  is_superuser?: boolean;
  is_staff?: boolean;
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
  };
  policy?: Partial<Policy>;
  branch?: Partial<Branch>;
  // Additional properties from data.json
  date_of_birth?: string;
  age?: number;
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string | null;
  nominee_name?: string;
  nominee_document_type?: string;
  nominee_document_number?: number;
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
  application?: {
    id: number;
    user: number;
  };
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

// Exported data structure with all the necessary properties
export interface SampleDataType {
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
}

// Sample data that would normally come from an API
export const sampleData: SampleDataType = {
  users: [
    {
      id: 3,
      password: "pbkdf2_sha256$870000$Y1eN4LjIXN767QzEOywYKn$Sietm3PhjChVCzJpmoqZ2fSqiSuxVccYrWKyJCgYQBs=",
      last_login: "2025-04-29T13:52:25.055851Z",
      is_superuser: true,
      username: "admin",
      first_name: "admin",
      last_name: "admin",
      email: "admin@admin.com",
      gender: "Male",
      phone: null,
      address: null,
      user_type: "superadmin",
      is_active: true,
      is_staff: true,
      created_at: "2025-04-29T08:41:55.749618Z",
      updated_at: "2025-04-29T08:41:55.749655Z",
      branch: null,
    },
    {
      id: 5,
      password: "pbkdf2_sha256$870000$7KpFV2P8JPUqS9n3qyZLZj$AlVYaqVTTZj/k3/DdxL6NIu5H6Cq963laK0EIorA0So=",
      last_login: null,
      is_superuser: false,
      username: "kohalpurBranch",
      first_name: "Kohalpur",
      last_name: "Branch",
      email: "kohalpurbranch@gmail.com",
      gender: "",
      phone: null,
      address: "",
      user_type: "branch",
      is_active: true,
      is_staff: true,
      created_at: "2025-04-29T09:06:05.285736Z",
      updated_at: "2025-04-29T09:22:22.809284Z",
      branch: 1,
    },
    {
      id: 2,
      password: "!t9x3sE3qcC8wSHF53yTzMT1aoWgZzFJntR9qIWnd",
      last_login: null,
      is_superuser: false,
      username: "nurpratapkarki",
      first_name: "Nur Pratap",
      last_name: "Karki",
      email: "nurprtapkarki@gmail.com",
      gender: "",
      phone: "9840693765",
      address: "Kohalpur, 11 Banke",
      user_type: "customer",
      is_active: true,
      is_staff: false,
      created_at: "2025-04-29T08:06:48.281645Z",
      updated_at: "2025-04-29T08:42:36.818497Z",
      branch: null,
    },
    {
      id: 6,
      password: "!XsmecRRyU7O0WT09O2rHXLgS7KiCsQbHMWEatTIs",
      last_login: null,
      is_superuser: false,
      username: "s4kanlptharu",
      first_name: "Sankalp",
      last_name: "Tharu",
      email: "s4kanlptharu@gmail.com",
      gender: "Male",
      phone: null,
      address: "Raptisonari - 8 Banke",
      user_type: "customer",
      is_active: true,
      is_staff: false,
      created_at: "2025-04-29T09:08:53.503730Z",
      updated_at: "2025-04-29T09:08:53.503755Z",
      branch: null,
    },
    {
      id: 4,
      password: "!DKU0pUVHxlhEWffVTYMY7ebBY3gxLdrugG8mnC6l",
      last_login: null,
      is_superuser: false,
      username: "sumeetrabamthakuri",
      first_name: "Sumitra",
      last_name: "Bam",
      email: "sumeetrabamthakuri@gmai.com",
      gender: "Male",
      phone: null,
      address: "Kohalpur, 11 Banke",
      user_type: "customer",
      is_active: true,
      is_staff: false,
      created_at: "2025-04-29T08:47:52.152756Z",
      updated_at: "2025-04-29T08:47:52.152781Z",
      branch: null,
    }
  ],
  companies: [
    {
      id: 1,
      name: "Easy Life Insurance LTD.",
      company_code: 175,
      address: "Kohalpur, 11 Banke",
      logo: null,
      email: "nurprtapkarki@gmail.com",
      is_active: true,
      phone_number: "9840693765"
    }
  ],
  branches: [
    {
      id: 1,
      name: "Kohalpur Branch",
      branch_code: 145,
      location: "Kohalpur 10- Banke",
      company: 1,
      company_name: "Easy Life Insurance LTD.",
      user: 5,
      user_details: {
        id: 5,
        password: "pbkdf2_sha256$870000$7KpFV2P8JPUqS9n3qyZLZj$AlVYaqVTTZj/k3/DdxL6NIu5H6Cq963laK0EIorA0So=",
        last_login: null,
        is_superuser: false,
        username: "kohalpurBranch",
        first_name: "Kohalpur",
        last_name: "Branch",
        email: "kohalpurbranch@gmail.com",
        gender: "",
        phone: null,
        address: "",
        user_type: "branch",
        is_active: true,
        is_staff: true,
        created_at: "2025-04-29T09:06:05.285736Z",
        updated_at: "2025-04-29T09:22:22.809284Z",
        branch: 1,
      }
    }
  ],
  insurance_policies: [
    {
      id: 1,
      name: "Saral Jiwan Beema",
      policy_code: "144",
      policy_type: "Endownment",
      base_multiplier: "1.00",
      min_sum_assured: "25000.00",
      max_sum_assured: "5000000.00",
      include_adb: true,
      include_ptd: true,
      adb_percentage: "0.50",
      ptd_percentage: "0.50",
      description: "",
      created_at: "2025-04-29T17:05:18.881681Z",
      guaranteed_interest_rate: "0.0450",
      terminal_bonus_rate: "0.1000"
    }
  ],
  customers: [
    {
      id: 1,
      first_name: "Nur Pratap",
      middle_name: null,
      last_name: "Karki",
      email: "nurprtapkarki@gmail.com",
      phone_number: "9840693765",
      address: "Kohalpur, 11 Banke",
      profile_picture: null,
      gender: "M",
      user_details: {
        id: 2,
        username: "nurpratapkarki",
        first_name: "Nur Pratap",
        last_name: "Karki",
        email: "nurprtapkarki@gmail.com",
        gender: "",
        phone: "9840693765",
        address: "Kohalpur, 11 Banke",
        user_type: "customer",
        is_active: true,
        created_at: "2025-04-29T08:06:48.281645Z",
        updated_at: "2025-04-29T08:42:36.818497Z",
        branch: null,
        password: "!t9x3sE3qcC8wSHF53yTzMT1aoWgZzFJntR9qIWnd"
      },
      created_at: "2025-04-29T08:06:48.280529Z",
      updated_at: "2025-04-29T17:11:23.548474Z"
    },
    {
      id: 2,
      first_name: "Sumitra",
      middle_name: null,
      last_name: "Bam",
      email: "sumeetrabamthakuri@gmai.com",
      phone_number: null,
      address: "Kohalpur, 11 Banke",
      profile_picture: null,
      gender: "M",
      user_details: {
        id: 4,
        username: "sumeetrabamthakuri",
        first_name: "Sumitra",
        last_name: "Bam",
        email: "sumeetrabamthakuri@gmai.com",
        gender: "Male",
        phone: null,
        address: "Kohalpur, 11 Banke",
        user_type: "customer",
        is_active: true,
        created_at: "2025-04-29T08:47:52.152756Z",
        updated_at: "2025-04-29T08:47:52.152781Z",
        branch: null,
      },
      created_at: "2025-04-29T08:47:52.151123Z",
      updated_at: "2025-04-30T05:20:57.525375Z"
    },
    {
      id: 3,
      first_name: "Sankalp",
      middle_name: null,
      last_name: "Tharu",
      email: "s4kanlptharu@gmail.com",
      phone_number: null,
      address: "Raptisonari - 8 Banke",
      profile_picture: null,
      gender: "M",
      user_details: {
        id: 6,
        username: "s4kanlptharu",
        first_name: "Sankalp",
        last_name: "Tharu",
        email: "s4kanlptharu@gmail.com",
        gender: "Male",
        phone: null,
        address: "Raptisonari - 8 Banke",
        user_type: "customer",
        is_active: true,
        created_at: "2025-04-29T09:08:53.503730Z",
        updated_at: "2025-04-29T09:08:53.503755Z",
        branch: null,
      },
      created_at: "2025-04-29T09:08:53.501889Z",
      updated_at: "2025-04-29T09:08:53.501922Z"
    }
  ],
  policy_holders: [
    {
      id: 1,
      customer_name: "Nur Pratap Karki",
      policy_name: "Saral Jiwan Beema",
      agent_name: "Nur Pratap Karki",
      policy_number: "1751451440001",
      duration_years: 10,
      sum_assured: "5000000.00",
      status: "Active",
      payment_status: "Partially Paid",
      start_date: "2025-04-29",
      maturity_date: "2035-04-29",
      customer: {
        id: 1,
        user: 2
      },
      policy: {
        id: 1,
        name: "Saral Jiwan Beema",
        policy_code: "144",
        policy_type: "Endownment",
        base_multiplier: "1.00",
        min_sum_assured: "25000.00",
        max_sum_assured: "5000000.00",
        include_adb: true,
        include_ptd: true,
        adb_percentage: "0.50",
        ptd_percentage: "0.50",
        description: "",
        created_at: "2025-04-29T17:05:18.881681Z",
        guaranteed_interest_rate: "0.0450",
        terminal_bonus_rate: "0.1000"
      },
      branch: {
        id: 1,
        name: "Kohalpur Branch",
        branch_code: 145,
        location: "Kohalpur 10- Banke",
        company: 1,
        company_name: "Easy Life Insurance LTD."
      },
      // Additional properties for this policy holder
      date_of_birth: "1990-05-15",
      age: 35,
      phone_number: "9840693765",
      emergency_contact_name: "Ram Karki",
      emergency_contact_number: "9812345678",
      nominee_name: "Rupa Karki",
      nominee_document_type: "Citizenship",
      nominee_document_number: 123456789,
      nominee_relation: "Spouse",
      include_adb: true,
      include_ptd: true,
      health_history: "No major health issues",
      habits: "Regular exercise",
      exercise_frequency: "3-4 times a week",
      alcoholic: false,
      smoker: false,
      family_medical_history: "No major genetic disorders",
      yearly_income: "1500000",
      assets_details: "Owns a house and a car"
    },
    {
      id: 2,
      customer_name: "Sumitra Bam",
      policy_name: "Saral Jiwan Beema",
      agent_name: "Nur Pratap Karki",
      policy_number: "1751451440002",
      duration_years: 10,
      sum_assured: "1000000.00",
      status: "Active",
      payment_status: "Paid",
      start_date: "2020-04-30",
      maturity_date: "2035-04-30",
      customer: {
        id: 2,
        user: 4
      },
      policy: {
        id: 1,
        name: "Saral Jiwan Beema",
        policy_code: "144",
        policy_type: "Endownment",
        base_multiplier: "1.00",
        min_sum_assured: "25000.00",
        max_sum_assured: "5000000.00",
        include_adb: true,
        include_ptd: true,
        adb_percentage: "0.50",
        ptd_percentage: "0.50",
        description: "",
        created_at: "2025-04-29T17:05:18.881681Z",
        guaranteed_interest_rate: "0.0450",
        terminal_bonus_rate: "0.1000"
      },
      branch: {
        id: 1,
        name: "Kohalpur Branch",
        branch_code: 145,
        location: "Kohalpur 10- Banke",
        company: 1,
        company_name: "Easy Life Insurance LTD."
      },
      // Additional properties for this policy holder
      date_of_birth: "1985-08-22",
      age: 40,
      phone_number: "9876543210",
      emergency_contact_name: "Prakash Bam",
      emergency_contact_number: "9811223344",
      nominee_name: "Prakash Bam",
      nominee_document_type: "Citizenship",
      nominee_document_number: 987654321,
      nominee_relation: "Spouse",
      include_adb: true,
      include_ptd: false,
      health_history: "Hypertension",
      habits: "Reading",
      exercise_frequency: "1-2 times a week",
      alcoholic: true,
      smoker: true,
      family_medical_history: "History of diabetes",
      yearly_income: "1200000",
      assets_details: "Owns farmland"
    }
  ],
  sales_agents: [
    {
      id: 1,
      branch_name: "Kohalpur Branch",
      agent_name: "Nur Pratap Karki",
      agent_code: "A-1-0006",
      is_active: true,
      commission_rate: "25.00",
      total_policies_sold: 2,
      status: "ACTIVE",
      branch: 1,
      application: {
        id: 6,
        user: 2
      }
    }
  ],
  agent_reports: [
    {
      id: 5,
      agent_name: "Nur Pratap Karki",
      branch_name: "Kohalpur Branch",
      reporting_period: "2025-4",
      policies_sold: 1,
      total_premium: "393125.00",
      commission_earned: "52031.25",
      branch: 1
    }
  ],
  mortality_rates: [
    {
      id: 1,
      age_group_start: 18,
      age_group_end: 25,
      rate: "0.25"
    }
  ],
  gsv_rates: [
    {
      id: 1,
      min_year: 2,
      max_year: 5,
      rate: "35.00",
      policy: 1
    },
    {
      id: 2,
      min_year: 6,
      max_year: 8,
      rate: "45.00",
      policy: 1
    },
    {
      id: 3,
      min_year: 9,
      max_year: 13,
      rate: "60.00",
      policy: 1
    },
    {
      id: 4,
      min_year: 14,
      max_year: 18,
      rate: "75.00",
      policy: 1
    },
    {
      id: 5,
      min_year: 19,
      max_year: 25,
      rate: "90.00",
      policy: 1
    }
  ],
  ssv_configs: [],
  underwriting: [
    {
      id: 1,
      policy_holder_number: "1751451440001",
      customer_name: "Nur Pratap Karki",
      risk_assessment_score: "15.00",
      risk_category: "Low",
      manual_override: false,
      remarks: null,
      last_updated_by: "System",
      last_updated_at: "2025-04-29T17:11:23.570339Z",
      policy_holder: 1
    },
    {
      id: 2,
      policy_holder_number: "1751451440002",
      customer_name: "Sumitra Bam",
      risk_assessment_score: "50.00",
      risk_category: "Moderate",
      manual_override: false,
      remarks: null,
      last_updated_by: "System",
      last_updated_at: "2025-04-30T05:05:03.357743Z",
      policy_holder: 2
    }
  ]
};

export default sampleData;
