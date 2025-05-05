import { toast } from 'sonner';
import { ApiResponse } from '@/types';

/**
 * Generic form submission handler with error handling and toast notifications
 * 
 * @param submitFn - The API function to call for form submission
 * @param data - The form data to submit
 * @param options - Configuration options
 * @returns The API response if successful
 */
export async function handleFormSubmission<T, D = any>(
  submitFn: (data: D) => Promise<ApiResponse<T>>,
  data: D,
  options: {
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (response: ApiResponse<T>) => void;
    onError?: (error: Error | string) => void;
  } = {}
): Promise<ApiResponse<T> | null> {
  const {
    successMessage = 'Data saved successfully',
    errorMessage = 'Failed to save data',
    onSuccess,
    onError
  } = options;

  try {
    console.log('Submitting form data:', data);
    
    // Make the API call
    const response = await submitFn(data);
    console.log('API response:', response);
    
    if (response.success) {
      toast.success(successMessage);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(response);
      }
      
      return response;
    } else {
      const errorMsg = response.message || errorMessage;
      toast.error(`Error: ${errorMsg}`);
      
      // Call the error callback if provided
      if (onError) {
        onError(errorMsg);
      }
      
      return null;
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Form submission error:', error);
    toast.error(`Error: ${errorMsg}`);
    
    // Call the error callback if provided
    if (onError) {
      onError(error instanceof Error ? error : new Error(errorMsg));
    }
    
    return null;
  }
}

/**
 * Validates that all required form fields have values
 * 
 * @param data - The form data to validate
 * @param requiredFields - Array of field names that are required
 * @returns True if all required fields have values, false otherwise
 */
export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    const value = data[field];
    
    // Check if value is undefined, null, empty string, or empty array
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      missingFields.push(String(field));
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Formats form data to match API expectations
 * 
 * @param data - The raw form data
 * @param formatConfig - Configuration for how to format each field
 * @returns Formatted data ready for API submission
 */
export function formatFormData<T extends Record<string, any>>(
  data: T,
  formatConfig: Partial<Record<keyof T, (value: any) => any>>
): T {
  const formattedData = { ...data };
  
  for (const [field, formatter] of Object.entries(formatConfig)) {
    if (field in data && formatter) {
      formattedData[field as keyof T] = formatter(data[field as keyof T]);
    }
  }
  
  return formattedData;
} 