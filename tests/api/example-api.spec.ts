import { test, expect } from '../../fixtures/test-fixtures';

test.describe('API Tests Example', () => {
  test('should make GET request and verify response', async ({ apiHelper }) => {
    // Example API test - adjust URL and expectations based on your API
    const result = await apiHelper.get('/api/endpoint');
    
    // Verify status
    await apiHelper.verifyStatus(result, 200);
    
    // Verify response structure
    expect(result.data).toHaveProperty('id');
    expect(result.data).toHaveProperty('name');
  });

  test('should create new resource via POST', async ({ apiHelper }) => {
    const newData = {
      name: 'Test Item',
      description: 'Created by Playwright test'
    };
    
    const result = await apiHelper.post('/api/items', newData);
    
    // Verify creation
    await apiHelper.verifyStatus(result, 201);
    await apiHelper.verifyResponseContains(result, newData);
  });

  test('should handle authentication', async ({ apiHelper }) => {
    // Example of authenticated request
    const authHeaders = apiHelper.setAuthToken('test-token');
    
    const result = await apiHelper.get('/api/protected', {
      headers: authHeaders
    });
    
    await apiHelper.verifyStatus(result, 200);
  });

  test('should handle error responses', async ({ apiHelper }) => {
    const result = await apiHelper.get('/api/nonexistent');
    
    // Verify error handling
    await apiHelper.verifyStatus(result, 404);
  });
});
