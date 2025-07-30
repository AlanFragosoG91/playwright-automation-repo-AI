import { test, expect } from '../../fixtures/test-fixtures';

test.describe('JSONPlaceholder API Tests', () => {
  test('should get a specific post by ID', async ({ apiHelper }) => {
    // GET request to fetch post with ID 1
    const result = await apiHelper.get('/posts/1');
    
    // Verify status
    await apiHelper.verifyStatus(result, 200);
    
    // Verify response structure for JSONPlaceholder post
    expect(result.data).toHaveProperty('id');
    expect(result.data).toHaveProperty('title');
    expect(result.data).toHaveProperty('body');
    expect(result.data).toHaveProperty('userId');
    
    // Verify specific values
    expect(result.data.id).toBe(1);
    expect(result.data.userId).toBe(1);
    expect(typeof result.data.title).toBe('string');
    expect(typeof result.data.body).toBe('string');
  });

  test('should get all posts', async ({ apiHelper }) => {
    const result = await apiHelper.get('/posts');
    
    // Verify status
    await apiHelper.verifyStatus(result, 200);
    
    // Verify it's an array
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
    
    // Verify first post structure
    const firstPost = result.data[0];
    expect(firstPost).toHaveProperty('id');
    expect(firstPost).toHaveProperty('title');
    expect(firstPost).toHaveProperty('body');
    expect(firstPost).toHaveProperty('userId');
  });

  test('should create new post via POST', async ({ apiHelper }) => {
    const newPost = {
      title: 'Test Post Title',
      body: 'This is a test post created by Playwright',
      userId: 1
    };
    
    const result = await apiHelper.post('/posts', newPost);
    
    // Verify creation (JSONPlaceholder returns 201)
    await apiHelper.verifyStatus(result, 201);
    
    // Verify response contains our data plus generated ID
    expect(result.data).toHaveProperty('id');
    expect(result.data.title).toBe(newPost.title);
    expect(result.data.body).toBe(newPost.body);
    expect(result.data.userId).toBe(newPost.userId);
    
    // JSONPlaceholder assigns ID 101 for new posts
    expect(result.data.id).toBe(101);
  });

  test('should update post via PUT', async ({ apiHelper }) => {
    const updatedPost = {
      id: 1,
      title: 'Updated Test Title',
      body: 'Updated body content',
      userId: 1
    };
    
    const result = await apiHelper.put('/posts/1', updatedPost);
    
    // Verify update
    await apiHelper.verifyStatus(result, 200);
    
    // Verify response contains updated data
    expect(result.data.title).toBe(updatedPost.title);
    expect(result.data.body).toBe(updatedPost.body);
    expect(result.data.id).toBe(1);
  });

  test('should delete post via DELETE', async ({ apiHelper }) => {
    const result = await apiHelper.delete('/posts/1');
    
    // Verify deletion (JSONPlaceholder returns 200 for DELETE)
    await apiHelper.verifyStatus(result, 200);
  });

  test('should handle error responses for non-existent posts', async ({ apiHelper }) => {
    const result = await apiHelper.get('/posts/9999');
    
    // JSONPlaceholder returns 404 for non-existent resources
    await apiHelper.verifyStatus(result, 404);
  });

  test('should get users data', async ({ apiHelper }) => {
    const result = await apiHelper.get('/users');
    
    // Verify status
    await apiHelper.verifyStatus(result, 200);
    
    // Verify it's an array with users
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBe(10); // JSONPlaceholder has 10 users
    
    // Verify first user structure
    const firstUser = result.data[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('name');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('address');
  });

  test('should get comments for a specific post', async ({ apiHelper }) => {
    const result = await apiHelper.get('/posts/1/comments');
    
    // Verify status
    await apiHelper.verifyStatus(result, 200);
    
    // Verify it's an array
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
    
    // Verify comment structure
    const firstComment = result.data[0];
    expect(firstComment).toHaveProperty('id');
    expect(firstComment).toHaveProperty('name');
    expect(firstComment).toHaveProperty('email');
    expect(firstComment).toHaveProperty('body');
    expect(firstComment).toHaveProperty('postId');
    expect(firstComment.postId).toBe(1);
  });
});
