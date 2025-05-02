# Insure Vista Dashboard

A comprehensive insurance management dashboard built with modern web technologies.

## Project Structure

```
insure-vista-dashboard/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ui/        # Base UI components (buttons, inputs, etc.)
│   │   ├── dashboard/ # Dashboard-specific components
│   │   ├── policy/    # Policy management components
│   │   ├── policyholder/ # Policy holder components
│   │   ├── agent/     # Agent management components
│   │   ├── claims/    # Claims management components
│   │   ├── loans/     # Loan management components
│   │   ├── payments/  # Payment management components
│   │   ├── reports/   # Reports components
│   │   └── settings/  # Settings components
│   ├── contexts/      # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility libraries and configurations
│   ├── pages/         # Application screens
│   └── utils/         # Helper functions and utilities
├── public/            # Static assets
└── ...config files
```

## Screen Flow and Components

The application consists of the following main screens and their components:

1. **Login** (`/login`)
   - Authentication screen for users to access the dashboard
   - Components:
     - LoginForm
     - AuthLayout
     - ErrorMessage

2. **Dashboard** (`/dashboard`)
   - Main overview with key metrics and statistics
   - Components:
     - DashboardLayout
     - SideNavbar
     - StatsOverview
     - RecentActivities
     - PerformanceMetrics
     - QuickActions

3. **Policy Management** (`/policies`)
   - Manage insurance policies
   - View, create, and update policy details
   - Components:
     - PolicyList
     - PolicyForm
     - PolicyDetails
     - PolicySearch
     - PolicyFilters

4. **Policy Holder Management** (`/policy-holders`)
   - Manage policy holder information
   - Track customer details and history
   - Components:
     - PolicyHolderList
     - PolicyHolderForm
     - PolicyHolderDetails
     - PolicyHolderSearch
     - PolicyHistory

5. **Branch Management** (`/branches`)
   - Manage insurance branches
   - Handle branch operations and staff
   - Components:
     - BranchList
     - BranchForm
     - BranchDetails
     - StaffManagement
     - BranchMetrics

6. **User Management** (`/users`)
   - Manage system users and permissions
   - Control access levels and roles
   - Components:
     - UserList
     - UserForm
     - RoleManagement
     - PermissionSettings
     - UserActivity

7. **Agent Management** (`/agents`)
   - Manage insurance agents
   - Track agent performance and commissions
   - Components:
     - AgentList
     - AgentForm
     - AgentPerformance
     - CommissionCalculator
     - AgentMetrics

8. **Claim Management** (`/claims`)
   - Process and track insurance claims
   - Handle claim documentation
   - Components:
     - ClaimList
     - ClaimForm
     - ClaimDetails
     - DocumentUpload
     - ClaimStatus

9. **Loan Management** (`/loans`)
   - Manage insurance-related loans
   - Track loan status and payments
   - Components:
     - LoanList
     - LoanForm
     - LoanDetails
     - PaymentSchedule
     - LoanCalculator

10. **Payment Management** (`/payments`)
    - Handle premium payments
    - Track payment history and status
    - Components:
      - PaymentList
      - PaymentForm
      - PaymentDetails
      - PaymentHistory
      - PaymentReceipt

11. **Reports** (`/reports`)
    - Generate and view various reports
    - Analytics and insights
    - Components:
      - ReportGenerator
      - ReportFilters
      - DataVisualization
      - ExportOptions
      - ReportScheduler

12. **Settings** (`/settings`)
    - System configuration
    - User preferences
    - Components:
      - SystemSettings
      - UserPreferences
      - NotificationSettings
      - SecuritySettings
      - BackupRestore

## Common Components

The application uses several shared components across screens:

- `DashboardLayout`: Main layout wrapper
- `SideNavbar`: Navigation sidebar
- `PrivateRoute`: Authentication wrapper
- UI Components:
  - Buttons
  - Forms
  - Tables
  - Cards
  - Modals
  - Alerts
  - Loading states

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Getting Started

Follow these steps to run the project locally:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd insure-vista-dashboard

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Development

The project uses several modern development tools and practices:

- TypeScript for type safety
- Tailwind CSS for styling
- shadcn-ui for UI components
- React Context for state management
- Custom hooks for reusable logic

## Deployment

The application can be deployed using various methods:

1. **Using Lovable**
   - Visit the Lovable Project dashboard
   - Click on Share -> Publish

2. **Custom Domain**
   - Navigate to Project > Settings > Domains
   - Click Connect Domain
   - Follow the domain setup guide

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
