# Authorization System Guide

This guide explains the comprehensive authorization system implemented for the Learn Hub Next.js/Supabase application.

## 🏗️ Architecture Overview

The authorization system is built with security and scalability in mind, using:

- **Supabase Authentication** for user management
- **JWT Token Verification** for server-side authentication
- **Row Level Security (RLS)** for database-level protection
- **Ownership-based Authorization** for resource access control

## 📁 File Structure

```
utils/
├── supabase/
│   └── server.ts          # Server-side Supabase utilities
├── api-helpers.ts         # API response helpers
└── api-client.ts          # Client-side API helpers

app/api/v1/
├── course/
│   ├── route.ts           # Course CRUD operations
│   └── [courseId]/
│       └── route.ts       # Individual course operations
└── user/
    └── route.ts           # User management

types/
└── course.ts              # TypeScript interfaces

components/
└── CourseManager.tsx      # Example component using the API
```

## 🔐 How It Works

### 1. Authentication Flow

1. **User Login**: User authenticates via Supabase Auth
2. **Token Storage**: JWT token is stored in browser
3. **API Requests**: Client includes token in Authorization header
4. **Server Verification**: Server validates token and extracts user info
5. **Authorization Check**: Server verifies user has permission for the resource

### 2. Server-Side Authorization

```typescript
// Example: Creating a course with automatic ownership
const { user, error } = await verifyAuth(request);
if (error || !user) {
  return authErrorResponse('Authentication required');
}

// Course is automatically assigned to the authenticated user
const courseData = {
  title: 'My Course',
  owner_id: user.id, // Automatically set
  // ... other fields
};
```

### 3. Ownership Validation

```typescript
// Example: Checking if user owns a resource
const { authorized, user } = await checkOwnership(request, course.owner_id);
if (!authorized) {
  return forbiddenResponse('Access denied');
}
```

## 🚀 Usage Examples

### Creating a Course

```typescript
import { courseApi } from '@/utils/api-client';

const createCourse = async () => {
  try {
    const course = await courseApi.create({
      title: 'My Course',
      description: 'Course description',
      text: 'Course content...',
      style: 'markdown',
      category: 'Programming',
      level: 'Beginner',
      price: 29.99,
      tags: ['javascript', 'react']
    });
    console.log('Course created:', course);
  } catch (error) {
    console.error('Failed to create course:', error);
  }
};
```

### Fetching User's Courses

```typescript
import { courseApi } from '@/utils/api-client';

const loadMyCourses = async () => {
  try {
    const courses = await courseApi.getAll();
    console.log('My courses:', courses);
  } catch (error) {
    console.error('Failed to load courses:', error);
  }
};
```

### Updating a Course

```typescript
import { courseApi } from '@/utils/api-client';

const updateCourse = async (courseId: string) => {
  try {
    const updatedCourse = await courseApi.update(courseId, {
      title: 'Updated Title',
      price: 39.99
    });
    console.log('Course updated:', updatedCourse);
  } catch (error) {
    console.error('Failed to update course:', error);
  }
};
```

### Deleting a Course

```typescript
import { courseApi } from '@/utils/api-client';

const deleteCourse = async (courseId: string) => {
  try {
    await courseApi.delete(courseId);
    console.log('Course deleted successfully');
  } catch (error) {
    console.error('Failed to delete course:', error);
  }
};
```

## 🛡️ Security Features

### 1. JWT Token Verification
- All API requests require valid JWT tokens
- Tokens are automatically refreshed by Supabase
- Invalid/expired tokens are rejected

### 2. Row Level Security (RLS)
- Database-level protection ensures users can only access their own data
- Policies are enforced at the database level
- No data leakage even if application logic fails

### 3. Server-Side Validation
- All requests are validated on the server
- User ownership is verified for every operation
- Input validation prevents malicious data

### 4. Error Handling
- Comprehensive error handling with appropriate HTTP status codes
- No sensitive information leaked in error messages
- Consistent error response format

## 🔧 Setup Instructions

### 1. Environment Variables

Add these to your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Database Setup

Run the SQL commands from `database-schema.md` in your Supabase dashboard.

### 3. Test the System

1. Start your development server: `npm run dev`
2. Navigate to `/test-auth` to test the course management
3. Create, update, and delete courses to verify authorization

## 📋 API Endpoints

### Course Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/course` | Create a new course | ✅ |
| GET | `/api/v1/course` | Get user's courses | ✅ |
| GET | `/api/v1/course/[id]` | Get specific course | ✅ |
| PUT | `/api/v1/course/[id]` | Update course | ✅ |
| DELETE | `/api/v1/course/[id]` | Delete course | ✅ |

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| DELETE | `/api/v1/user` | Delete user account | ✅ |

## 🔍 Testing

### Manual Testing

1. **Authentication Test**:
   - Try accessing `/test-auth` without logging in
   - Should redirect to login page

2. **Course Creation Test**:
   - Log in and create a course
   - Verify the course appears in your list
   - Check that `owner_id` is set to your user ID

3. **Authorization Test**:
   - Try to access another user's course (if you have the ID)
   - Should receive 403 Forbidden error

4. **Token Validation Test**:
   - Make an API request without the Authorization header
   - Should receive 401 Unauthorized error

### Automated Testing

You can add tests using tools like Jest and Testing Library:

```typescript
// Example test for course creation
test('should create course with correct ownership', async () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };
  const courseData = { title: 'Test Course', description: 'Test' };
  
  // Mock the API call
  const result = await courseApi.create(courseData);
  
  expect(result.owner_id).toBe(mockUser.id);
});
```

## 🚨 Common Issues

### 1. "Authentication required" Error
- **Cause**: Missing or invalid JWT token
- **Solution**: Ensure user is logged in and token is valid

### 2. "Access denied" Error
- **Cause**: User doesn't own the resource
- **Solution**: Verify the resource belongs to the authenticated user

### 3. Database Connection Issues
- **Cause**: Incorrect environment variables
- **Solution**: Check Supabase URL and keys

### 4. RLS Policy Violations
- **Cause**: Database policies not set up correctly
- **Solution**: Run the SQL commands from `database-schema.md`

## 🔄 Extending the System

### Adding New Protected Resources

1. **Create the database table** with `owner_id` field
2. **Add RLS policies** for the table
3. **Create API routes** using the authorization helpers
4. **Add client-side API functions** in `api-client.ts`

### Adding Role-Based Access

```typescript
// Example: Adding admin role check
const checkAdminRole = async (request: NextRequest) => {
  const { user } = await verifyAuth(request);
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  return profile?.role === 'admin';
};
```

## 📞 Support

If you encounter issues:

1. Check the browser console for client-side errors
2. Check the server logs for API errors
3. Verify your environment variables are correct
4. Ensure the database schema is set up properly
5. Test with the provided `/test-auth` page

The authorization system is designed to be secure, scalable, and easy to use. Follow the patterns established in the existing code when adding new features. 