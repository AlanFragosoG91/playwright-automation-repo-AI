import { APIRequestContext } from '@playwright/test';

// Type definitions for API operations
export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  response: any;
  data: T;
  status: number;
  headers?: Record<string, string>;
}

/**
 * Helper class for API testing operations
 * Provides methods for making HTTP requests and validating responses
 */
export class ApiHelper {
  private readonly request: APIRequestContext;
  private readonly baseURL: string;
  private readonly defaultTimeout: number = 15000;

  constructor(request: APIRequestContext, baseURL: string = '') {
    this.request = request;
    this.baseURL = baseURL;
  }

  /**
   * Generic GET request
   * @param endpoint - API endpoint path
   * @param options - Request options (headers, params, timeout)
   * @returns API response with parsed data
   */
  async get<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params);
    
    try {
      const response = await this.request.get(url, {
        headers: options?.headers,
        timeout: options?.timeout || this.defaultTimeout,
      });
      
      return {
        response,
        data: await this.parseResponse(response),
        status: response.status(),
        headers: response.headers(),
      };
    } catch (error) {
      throw new Error(`GET request to ${url} failed: ${error}`);
    }
  }

  /**
   * Generic POST request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param options - Request options
   * @returns API response with parsed data
   */
  async post<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await this.request.post(url, {
        data,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        timeout: options?.timeout || this.defaultTimeout,
      });

      return {
        response,
        data: await this.parseResponse(response),
        status: response.status(),
        headers: response.headers(),
      };
    } catch (error) {
      throw new Error(`POST request to ${url} failed: ${error}`);
    }
  }

  /**
   * Generic PUT request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param options - Request options
   * @returns API response with parsed data
   */
  async put<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await this.request.put(url, {
        data,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        timeout: options?.timeout || this.defaultTimeout,
      });

      return {
        response,
        data: await this.parseResponse(response),
        status: response.status(),
        headers: response.headers(),
      };
    } catch (error) {
      throw new Error(`PUT request to ${url} failed: ${error}`);
    }
  }

  /**
   * Generic PATCH request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param options - Request options
   * @returns API response with parsed data
   */
  async patch<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await this.request.patch(url, {
        data,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        timeout: options?.timeout || this.defaultTimeout,
      });

      return {
        response,
        data: await this.parseResponse(response),
        status: response.status(),
        headers: response.headers(),
      };
    } catch (error) {
      throw new Error(`PATCH request to ${url} failed: ${error}`);
    }
  }

  /**
   * Generic DELETE request
   * @param endpoint - API endpoint path
   * @param options - Request options
   * @returns API response with parsed data
   */
  async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await this.request.delete(url, {
        headers: options?.headers,
        timeout: options?.timeout || this.defaultTimeout,
      });

      return {
        response,
        data: await this.parseResponse(response),
        status: response.status(),
        headers: response.headers(),
      };
    } catch (error) {
      throw new Error(`DELETE request to ${url} failed: ${error}`);
    }
  }

  /**
   * Build URL with query parameters
   * @param endpoint - API endpoint path
   * @param params - Query parameters
   * @returns Complete URL with query string
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = `${this.baseURL}${endpoint}`;
    if (!params || Object.keys(params).length === 0) return url;

    const urlObj = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.append(key, value);
    });
    
    return urlObj.toString();
  }

  /**
   * Parse response based on content type
   * @param response - HTTP response object
   * @returns Parsed response data
   */
  private async parseResponse(response: any): Promise<any> {
    const contentType = response.headers()['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        return await response.text();
      }
    }
    
    if (contentType.includes('text/')) {
      return await response.text();
    }
    
    return await response.text();
  }

  /**
   * Create authorization header
   * @param token - Authentication token
   * @param type - Token type (Bearer, Basic, etc.)
   * @returns Authorization header object
   */
  createAuthHeader(token: string, type: 'Bearer' | 'Basic' = 'Bearer'): Record<string, string> {
    return {
      'Authorization': `${type} ${token}`,
    };
  }

  /**
   * Create basic auth header
   * @param username - Username
   * @param password - Password
   * @returns Authorization header with Basic auth
   */
  createBasicAuthHeader(username: string, password: string): Record<string, string> {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return {
      'Authorization': `Basic ${credentials}`,
    };
  }

  /**
   * Get base URL being used
   */
  getBaseUrl(): string {
    return this.baseURL;
  }
}
