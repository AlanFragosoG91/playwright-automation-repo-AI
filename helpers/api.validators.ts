import { expect } from '@playwright/test';

export class ApiValidators {
  static validatePostStructure(post: any) {
    const requiredFields = ['id', 'title', 'body', 'userId'];
    
    requiredFields.forEach(field => {
      expect(post).toHaveProperty(field);
    });
    
    expect(typeof post.id).toBe('number');
    expect(typeof post.title).toBe('string');
    expect(typeof post.body).toBe('string');
    expect(typeof post.userId).toBe('number');
    
    expect(post.id).toBeGreaterThan(0);
    expect(post.title.length).toBeGreaterThan(0);
    expect(post.userId).toBeGreaterThan(0);
  }

  static validateUserStructure(user: any) {
    const requiredFields = ['id', 'name', 'email', 'address'];
    
    requiredFields.forEach(field => {
      expect(user).toHaveProperty(field);
    });
    
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.address).toBe('object');
    
    // Validate email format
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    
    // Validate address structure
    expect(user.address).toHaveProperty('street');
    expect(user.address).toHaveProperty('city');
    expect(user.address).toHaveProperty('zipcode');
  }

  static validateCommentStructure(comment: any) {
    const requiredFields = ['id', 'name', 'email', 'body', 'postId'];
    
    requiredFields.forEach(field => {
      expect(comment).toHaveProperty(field);
    });
    
    expect(typeof comment.id).toBe('number');
    expect(typeof comment.name).toBe('string');
    expect(typeof comment.email).toBe('string');
    expect(typeof comment.body).toBe('string');
    expect(typeof comment.postId).toBe('number');
    
    expect(comment.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  static validateArrayResponse<T>(
    data: any, 
    validator: (item: T) => void, 
    minLength: number = 1
  ) {
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(minLength);
    
    if (data.length > 0) {
      validator(data[0]);
    }
  }

  static validateErrorResponse(data: any, expectedStatus: number) {
    expect(data.status).toBe(expectedStatus);
    
    if (expectedStatus >= 400) {
      // Validate error structure if present
      if (data.data && typeof data.data === 'object') {
        expect(data.data).toHaveProperty('error');
      }
    }
  }
}
