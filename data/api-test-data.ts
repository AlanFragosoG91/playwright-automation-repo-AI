export const ApiTestData = {
  posts: {
    validPost: {
      title: 'Test Post Title',
      body: 'This is a comprehensive test post created by Playwright automation',
      userId: 1
    },
    
    updatedPost: {
      id: 1,
      title: 'Updated Post Title - Modified by Playwright',
      body: 'This post has been updated with new content for testing purposes',
      userId: 1
    },
    
    invalidPost: {
      title: '', // Invalid: empty title
      body: null, // Invalid: null body
      userId: -1 // Invalid: negative userId
    }
  },

  users: {
    knownUserIds: [1, 2, 3, 4, 5],
    expectedUserCount: 10
  },

  comments: {
    knownPostIds: [1, 2, 3, 4, 5]
  },

  errors: {
    nonExistentIds: [9999, 10000, -1, 0],
    invalidEndpoints: [
      '/posts/invalid',
      '/users/abc',
      '/comments/xyz'
    ]
  },

  pagination: {
    limits: [5, 10, 20],
    pages: [1, 2, 3]
  }
};
