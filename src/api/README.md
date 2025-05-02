# API Structure

This project uses a flexible API architecture that allows for easy switching between mock and real API implementations.

## Directory Structure

```
src/api/
├── endpoints/
│   └── index.ts       # Main API exports used by components
├── mock/
│   ├── api.ts         # Mock API implementation
│   └── data.ts        # Mock data used by the mock API
├── real/              # (To be implemented when connecting to real backend)
│   └── api.ts         # Real API implementation will go here
└── README.md          # This file
```

## How It Works

1. Components import API functions from `src/api/endpoints/index.ts`
2. The endpoints file exports functions from either the mock or real implementation
3. To switch between mock and real APIs, you only need to change the imports in the endpoints file

## Mock API

The mock API implementation:

- Simulates network delays with `setTimeout`
- Returns data in the same format as the real API would
- Provides CRUD operations for all major entities
- Uses TypeScript interfaces to ensure type safety

## Real API Implementation

When you're ready to connect to a real backend:

1. Create implementations in the `src/api/real/api.ts` file
2. Ensure they match the function signatures in the mock API
3. Update imports in `src/api/endpoints/index.ts` to use the real implementations

## Response Format

All API functions return responses in this format:

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  success: boolean;
}
```

## Example Usage

```typescript
import { getBranches } from '@/api/endpoints';

const MyComponent = () => {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBranches();
        if (response.success) {
          setBranches(response.data);
        } else {
          // Handle error
          console.error(response.message);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Rest of component...
};
``` 