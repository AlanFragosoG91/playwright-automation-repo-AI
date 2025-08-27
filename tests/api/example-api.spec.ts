import { test, expect } from '../../fixtures/test-fixtures';
import { ApiValidators } from '../../helpers/api.validators';
import { ApiTestData } from '../../data/api-test-data';

test.describe('JSONPlaceholder API Tests', () => {
  
  test.describe('Posts API', () => {
    test.describe('GET Operations', () => {
      test('should get a specific post by ID', async ({ apiHelper }) => {
        const result = await apiHelper.get('/posts/1');
        
        await apiHelper.verifyStatus(result, 200);
        ApiValidators.validatePostStructure(result.data);
        
        // Verify specific values for post ID 1
        expect(result.data.id).toBe(1);
        expect(result.data.userId).toBe(1);
      });

      test('should get all posts', async ({ apiHelper }) => {
        const result = await apiHelper.get('/posts');
        
        await apiHelper.verifyStatus(result, 200);
        ApiValidators.validateArrayResponse(
          result.data, 
          ApiValidators.validatePostStructure,
          100 // JSONPlaceholder has 100 posts
        );
        
        expect(result.data.length).toBe(100);
      });

      test.describe('Posts with Pagination', () => {
        ApiTestData.pagination.limits.forEach(limit => {
          test(`should get posts with limit ${limit}`, async ({ apiHelper }) => {
            const result = await apiHelper.get('/posts', {
              params: { _limit: limit.toString() }
            });
            
            await apiHelper.verifyStatus(result, 200);
            expect(result.data.length).toBe(limit);
            
            if (result.data.length > 0) {
              ApiValidators.validatePostStructure(result.data[0]);
            }
          });
        });
      });
    });

    test.describe('POST Operations', () => {
      test('should create new post successfully', async ({ apiHelper }) => {
        const newPost = ApiTestData.posts.validPost;
        const result = await apiHelper.post('/posts', newPost);
        
        await apiHelper.verifyStatus(result, 201);
        
        // Validate response structure
        expect(result.data).toHaveProperty('id');
        expect(result.data.title).toBe(newPost.title);
        expect(result.data.body).toBe(newPost.body);
        expect(result.data.userId).toBe(newPost.userId);
        
        // JSONPlaceholder assigns ID 101 for new posts
        expect(result.data.id).toBe(101);
      });

      test('should handle invalid post data gracefully', async ({ apiHelper }) => {
        const invalidPost = ApiTestData.posts.invalidPost;
        const result = await apiHelper.post('/posts', invalidPost);
        
        // JSONPlaceholder accepts invalid data but we test the structure
        await apiHelper.verifyStatus(result, 201);
        expect(result.data).toHaveProperty('id');
      });
    });

    test.describe('PUT Operations', () => {
      test('should update existing post', async ({ apiHelper }) => {
        const updatedPost = ApiTestData.posts.updatedPost;
        const result = await apiHelper.put('/posts/1', updatedPost);
        
        await apiHelper.verifyStatus(result, 200);
        
        expect(result.data.title).toBe(updatedPost.title);
        expect(result.data.body).toBe(updatedPost.body);
        expect(result.data.id).toBe(1);
        expect(result.data.userId).toBe(updatedPost.userId);
      });
    });

    test.describe('DELETE Operations', () => {
      test('should delete existing post', async ({ apiHelper }) => {
        const result = await apiHelper.delete('/posts/1');
        
        await apiHelper.verifyStatus(result, 200);
        // JSONPlaceholder doesn't actually delete but returns success
      });
    });
  });

  test.describe('Users API', () => {
    test('should get all users', async ({ apiHelper }) => {
      const result = await apiHelper.get('/users');
      
      await apiHelper.verifyStatus(result, 200);
      ApiValidators.validateArrayResponse(
        result.data,
        ApiValidators.validateUserStructure,
        ApiTestData.users.expectedUserCount
      );
      
      expect(result.data.length).toBe(ApiTestData.users.expectedUserCount);
    });

    test.describe('Individual Users', () => {
      ApiTestData.users.knownUserIds.slice(0, 3).forEach(userId => {
        test(`should get user with ID ${userId}`, async ({ apiHelper }) => {
          const result = await apiHelper.get(`/users/${userId}`);
          
          await apiHelper.verifyStatus(result, 200);
          ApiValidators.validateUserStructure(result.data);
          expect(result.data.id).toBe(userId);
        });
      });
    });
  });

  test.describe('Comments API', () => {
    test.describe('Comments by Post', () => {
      ApiTestData.comments.knownPostIds.slice(0, 2).forEach(postId => {
        test(`should get comments for post ${postId}`, async ({ apiHelper }) => {
          const result = await apiHelper.get(`/posts/${postId}/comments`);
          
          await apiHelper.verifyStatus(result, 200);
          ApiValidators.validateArrayResponse(
            result.data,
            ApiValidators.validateCommentStructure
          );
          
          // All comments should belong to the requested post
          result.data.forEach((comment: any) => {
            expect(comment.postId).toBe(postId);
          });
        });
      });
    });
  });

  test.describe('Error Handling', () => {
    test.describe('Non-existent Resources', () => {
      ApiTestData.errors.nonExistentIds.forEach(invalidId => {
        test(`should return 404 for non-existent post ${invalidId}`, async ({ apiHelper }) => {
          const result = await apiHelper.get(`/posts/${invalidId}`);
          
          await apiHelper.verifyStatus(result, 404);
        });
      });
    });

    test.describe('Invalid Endpoints', () => {
      ApiTestData.errors.invalidEndpoints.forEach(endpoint => {
        test(`should handle invalid endpoint ${endpoint}`, async ({ apiHelper }) => {
          const result = await apiHelper.get(endpoint);
          
          // Should return 404 or appropriate error status
          expect([404, 400]).toContain(result.status);
        });
      });
    });
  });

  test.describe('Performance Tests', () => {
    test('should respond within acceptable time limits', async ({ apiHelper }) => {
      const startTime = Date.now();
      
      const result = await apiHelper.get('/posts');
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      await apiHelper.verifyStatus(result, 200);
      expect(responseTime).toBeLessThan(3000); // 3 seconds max
      
      console.log(`API response time: ${responseTime}ms`);
    });

    test('should handle concurrent requests efficiently', async ({ apiHelper }) => {
      const concurrentRequests = ApiTestData.users.knownUserIds.map(id => 
        apiHelper.get(`/users/${id}`)
      );
      
      const startTime = Date.now();
      const results = await Promise.all(concurrentRequests);
      const endTime = Date.now();
      
      // All requests should succeed
      results.forEach(result => {
        expect(result.status).toBe(200);
      });
      
      const totalTime = endTime - startTime;
      console.log(`${results.length} concurrent requests completed in: ${totalTime}ms`);
      
      // Should be faster than sequential requests
      expect(totalTime).toBeLessThan(results.length * 1000);
    });
  });
});
