import { APIRequestContext, expect } from '@playwright/test';

export class ApiHelper {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext, baseURL: string = '') {
    this.request = request;
    this.baseURL = baseURL;
  }

  /**
   * Generic GET request
   */
  async get(endpoint: string, options?: { 
    headers?: Record<string, string>;
    params?: Record<string, string>;
  }) {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await this.request.get(url, {
      headers: options?.headers
    });
    
    return {
      response,
      data: await this.parseResponse(response),
      status: response.status()
    };
  }

  /**
   * Generic POST request
   */
  async post(endpoint: string, data?: any, options?: {
    headers?: Record<string, string>;
  }) {
    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });

    return {
      response,
      data: await this.parseResponse(response),
      status: response.status()
    };
  }

  /**
   * Generic PUT request
   */
  async put(endpoint: string, data?: any, options?: {
    headers?: Record<string, string>;
  }) {
    const response = await this.request.put(`${this.baseURL}${endpoint}`, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });

    return {
      response,
      data: await this.parseResponse(response),
      status: response.status()
    };
  }

  /**
   * Generic DELETE request
   */
  async delete(endpoint: string, options?: {
    headers?: Record<string, string>;
  }) {
    const response = await this.request.delete(`${this.baseURL}${endpoint}`, {
      headers: options?.headers
    });

    return {
      response,
      data: await this.parseResponse(response),
      status: response.status()
    };
  }

  /**
   * Verify response status
   */
  async verifyStatus(response: any, expectedStatus: number) {
    expect(response.status).toBe(expectedStatus);
  }

  /**
   * Verify response contains specific data
   */
  async verifyResponseContains(response: any, expectedData: any) {
    expect(response.data).toMatchObject(expectedData);
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = `${this.baseURL}${endpoint}`;
    if (!params) return url;

    const urlObj = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.append(key, value);
    });
    
    return urlObj.toString();
  }

  /**
   * Parse response based on content type
   */
  private async parseResponse(response: any) {
    const contentType = response.headers()['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        return await response.text();
      }
    }
    
    return await response.text();
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string) {
    // This would be used for authenticated requests
    return {
      'Authorization': `Bearer ${token}`
    };
  }
}
