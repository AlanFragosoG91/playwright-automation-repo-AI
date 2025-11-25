import { expect } from '@playwright/test';

// Type definitions for API entities
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
}

/**
 * Validator class for API response structures
 * Provides validation methods for common API entities
 */
export class ApiValidators {
  /**
   * Validate post object structure
   * @param post - Post object to validate
   */
  static validatePostStructure(post: any): asserts post is Post {
    const requiredFields: (keyof Post)[] = ['id', 'title', 'body', 'userId'];
    
    requiredFields.forEach(field => {
      expect(post, `Post should have ${field} property`).toHaveProperty(field);
    });
    
    expect(typeof post.id, 'Post.id should be a number').toBe('number');
    expect(typeof post.title, 'Post.title should be a string').toBe('string');
    expect(typeof post.body, 'Post.body should be a string').toBe('string');
    expect(typeof post.userId, 'Post.userId should be a number').toBe('number');
    
    expect(post.id, 'Post.id should be positive').toBeGreaterThan(0);
    expect(post.title.length, 'Post.title should not be empty').toBeGreaterThan(0);
    expect(post.userId, 'Post.userId should be positive').toBeGreaterThan(0);
  }

  /**
   * Validate user object structure
   * @param user - User object to validate
   */
  static validateUserStructure(user: any): asserts user is User {
    const requiredFields = ['id', 'name', 'email', 'address'];
    
    requiredFields.forEach(field => {
      expect(user, `User should have ${field} property`).toHaveProperty(field);
    });
    
    expect(typeof user.id, 'User.id should be a number').toBe('number');
    expect(typeof user.name, 'User.name should be a string').toBe('string');
    expect(typeof user.email, 'User.email should be a string').toBe('string');
    expect(typeof user.address, 'User.address should be an object').toBe('object');
    
    // Validate email format
    expect(user.email, 'User.email should be valid').toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    
    // Validate address structure
    expect(user.address, 'User.address should have street').toHaveProperty('street');
    expect(user.address, 'User.address should have city').toHaveProperty('city');
    expect(user.address, 'User.address should have zipcode').toHaveProperty('zipcode');
  }

  /**
   * Validate comment object structure
   * @param comment - Comment object to validate
   */
  static validateCommentStructure(comment: any): asserts comment is Comment {
    const requiredFields: (keyof Comment)[] = ['id', 'name', 'email', 'body', 'postId'];
    
    requiredFields.forEach(field => {
      expect(comment, `Comment should have ${field} property`).toHaveProperty(field);
    });
    
    expect(typeof comment.id, 'Comment.id should be a number').toBe('number');
    expect(typeof comment.name, 'Comment.name should be a string').toBe('string');
    expect(typeof comment.email, 'Comment.email should be a string').toBe('string');
    expect(typeof comment.body, 'Comment.body should be a string').toBe('string');
    expect(typeof comment.postId, 'Comment.postId should be a number').toBe('number');
    
    expect(comment.email, 'Comment.email should be valid').toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  /**
   * Validate array response
   * @param data - Array data to validate
   * @param validator - Validation function for each item
   * @param minLength - Minimum expected array length
   */
  static validateArrayResponse<T>(
    data: any, 
    validator: (item: T) => void, 
    minLength: number = 1
  ): asserts data is T[] {
    expect(Array.isArray(data), 'Response should be an array').toBe(true);
    expect(data.length, `Array should have at least ${minLength} items`).toBeGreaterThanOrEqual(minLength);
    
    if (data.length > 0 && validator) {
      // Validate first item as a sample
      validator(data[0]);
    }
  }

  /**
   * Validate HTTP status code
   * @param actualStatus - Actual status code received
   * @param expectedStatus - Expected status code
   */
  static validateStatus(actualStatus: number, expectedStatus: number): void {
    expect(actualStatus, `Status should be ${expectedStatus}`).toBe(expectedStatus);
  }

  /**
   * Validate successful response (2xx)
   * @param status - HTTP status code
   */
  static validateSuccessStatus(status: number): void {
    expect(status, 'Status should be in 2xx range').toBeGreaterThanOrEqual(200);
    expect(status, 'Status should be in 2xx range').toBeLessThan(300);
  }

  /**
   * Validate error response
   * @param status - HTTP status code
   * @param data - Response data
   */
  static validateErrorResponse(status: number, data?: any): void {
    expect(status, 'Status should indicate an error (4xx or 5xx)').toBeGreaterThanOrEqual(400);
    
    if (data && typeof data === 'object') {
      // Many APIs return error details in various formats
      const hasErrorField = 'error' in data || 'message' in data || 'errors' in data;
      if (!hasErrorField) {
        console.warn('Error response does not contain standard error fields');
      }
    }
  }

  /**
   * Validate response headers
   * @param headers - Response headers object
   * @param expectedHeaders - Expected headers to validate
   */
  static validateHeaders(
    headers: Record<string, string>, 
    expectedHeaders: Record<string, string | RegExp>
  ): void {
    Object.entries(expectedHeaders).forEach(([key, expectedValue]) => {
      const actualValue = headers[key.toLowerCase()];
      
      expect(actualValue, `Header ${key} should exist`).toBeDefined();
      
      if (typeof expectedValue === 'string') {
        expect(actualValue, `Header ${key} should match expected value`).toBe(expectedValue);
      } else if (expectedValue instanceof RegExp) {
        expect(actualValue, `Header ${key} should match expected pattern`).toMatch(expectedValue);
      }
    });
  }

  /**
   * Validate content type header
   * @param headers - Response headers
   * @param expectedType - Expected content type (e.g., 'application/json')
   */
  static validateContentType(headers: Record<string, string>, expectedType: string): void {
    const contentType = headers['content-type'];
    expect(contentType, 'Content-Type header should exist').toBeDefined();
    expect(contentType, `Content-Type should include ${expectedType}`).toContain(expectedType);
  }

  /**
   * Validate pagination response structure
   * @param data - Response data
   * @param expectedFields - Expected pagination fields
   */
  static validatePaginationStructure(
    data: any,
    expectedFields: string[] = ['page', 'limit', 'total', 'data']
  ): void {
    expectedFields.forEach(field => {
      expect(data, `Pagination should have ${field} property`).toHaveProperty(field);
    });
    
    if ('data' in data) {
      expect(Array.isArray(data.data), 'Pagination data should be an array').toBe(true);
    }
  }
}
