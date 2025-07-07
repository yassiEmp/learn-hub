# Learn Hub Next.js - API Reference

This document provides a comprehensive reference for all API endpoints in the Learn Hub application.

## Table of Contents
1. [Authentication](#authentication)
2. [Base URL & Headers](#base-url--headers)
3. [Error Handling](#error-handling)
4. [User Endpoints](#user-endpoints)
5. [Course Endpoints](#course-endpoints)
6. [Response Formats](#response-formats)
7. [Rate Limiting](#rate-limiting)

## Authentication

All protected endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

1. **Login via Supabase Auth**
   ```bash
   POST /auth/v1/token?grant_type=password
   ```

2. **Use the access_token from the response**

## Base URL & Headers

### Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

### Required Headers
```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

### Optional Headers
```http
Accept: application/json
User-Agent: LearnHub-Client/1.0
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  },
  "meta": {
    "timestamp": "2024-12-07T14:30:00Z",
    "version": "1.0.0"
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` (401) - Invalid or missing authentication
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `VALIDATION_ERROR` (400) - Invalid request data
- `INTERNAL_ERROR` (500) - Server error

## User Endpoints

### Get Current User

**GET** `/api/v1/user`

Returns the current authenticated user's information.

**Headers:**
```http
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-12-07T10:00:00Z",
    "updated_at": "2024-12-07T10:00:00Z"
  },
  "meta": {
    "timestamp": "2024-12-07T14:30:00Z",
    "version": "1.0.0"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid or missing token
- `404 NOT_FOUND` - User not found

### Delete Current User

**DELETE** `/api/v1/user`

Deletes the current authenticated user and all associated data.

**Headers:**
```http
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully"
  },
  "meta": {
    "timestamp": "2024-12-07T14:30:00Z",
    "version": "1.0.0"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid or missing token
- `404 NOT_FOUND` - User not found

## Course Endpoints

### Get All Courses

**GET** `/api/v1/course`

Returns all courses accessible to the current user.

**Headers:**
```http
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `limit` (optional): Number of courses to return (default: 10, max: 100)
- `offset` (optional): Number of courses to skip (default: 0)
- `search` (optional): Search term for course title or description

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "title": "Course Title",
        "description": "Course description",
        "owner_id": "uuid",
        "created_at": "2024-12-07T10:00:00Z",
        "updated_at": "2024-12-07T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 10,
      "offset": 0,
      "has_more": true
    }
  },
  "meta": {
    "timestamp": "2024-12-07T14:30:00Z",
    "version": "1.0.0"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid or missing token

### Get Course by ID

**GET** `/api/v1/course/{courseId}`

Returns a specific course by ID.

**Headers:**
```http
Authorization: Bearer <jwt-token>
```

**Path Parameters:**
- `courseId` (required): UUID of the course

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Course Title",
    "description": "Course description",
    "owner_id": "uuid",
    "created_at": "2024-12-07T10:00:00Z",
    "updated_at": "2024-12-07T10:00:00Z",
    "lessons": [
      {
        "id": "uuid",
        "title": "Lesson Title",
        "content": "Lesson content",
        "order": 1,
        "created_at": "2024-12-07T10:00:00Z"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-12-07T14:30:00Z",
    "version": "1.0.0"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid or missing token
- `403 FORBIDDEN` - User doesn't have access to this course
- `404 NOT_FOUND` - Course not found

### Create Course

**POST** `/api/v1/course`

Creates a new course with optional AI-generated title and description.

**Headers:**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Course Title (optional if content provided)",
  "description": "Course description (optional if content provided)",
  "content": "Course content for AI processing (optional)",
  "lessons": [
    {
      "title": "Lesson Title",
      "content": "Lesson content",
      "order": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "AI Generated Title",
    "description": "AI Generated Description",
    "owner_id": "uuid",
    "created_at": "2024-12-07T10:00:00Z",
    "updated_at": "2024-12-07T10:00:00Z",
    "lessons": [
      {
        "id": "uuid",
        "title": "Lesson Title",
        "content": "Lesson content",
        "order": 1,
        "created_at": "2024-12-07T10:00:00Z"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-12-07T14:30:00Z",
    "version": "1.0.0"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid or missing token
- `400 VALIDATION_ERROR` - Invalid request data
- `500 INTERNAL_ERROR` - AI processing failed

### Update Course

**PUT** `/api/v1/course/{courseId}`

Updates an existing course.

**Headers:**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Path Parameters:**
- `courseId` (required): UUID of the course

**Request Body:**
```json
{
  "title": "Updated Course Title",
  "description": "Updated course description",
  "lessons": [
    {
      "id": "uuid",
      "title": "Updated Lesson Title",
      "content": "Updated lesson content",
      "order": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Updated Course Title",
    "description": "Updated course description",
    "owner_id": "uuid",
    "created_at": "2024-12-07T10:00:00Z",
    "updated_at": "2024-12-07T14:30:00Z",
    "lessons": [
      {
        "id": "uuid",
        "title": "Updated Lesson Title",
        "content": "Updated lesson content",
        "order": 1,
        "created_at": "2024-12-07T10:00:00Z",
        "updated_at": "2024-12-07T14:30:00Z"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-12-07T14:30:00Z",
    "version": "1.0.0"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid or missing token
- `403 FORBIDDEN` - User doesn't own this course
- `404 NOT_FOUND` - Course not found
- `400 VALIDATION_ERROR` - Invalid request data

### Delete Course

**DELETE** `/api/v1/course/{courseId}`

Deletes a course and all associated lessons.

**Headers:**
```http
Authorization: Bearer <jwt-token>
```

**Path Parameters:**
- `courseId` (required): UUID of the course

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Course deleted successfully"
  },
  "meta": {
    "timestamp": "2024-12-07T14:30:00Z",
    "version": "1.0.0"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid or missing token
- `403 FORBIDDEN` - User doesn't own this course
- `404 NOT_FOUND` - Course not found

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-12-07T14:30:00Z",
    "version": "1.0.0"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {
      "field": "Additional error details"
    }
  },
  "meta": {
    "timestamp": "2024-12-07T14:30:00Z",
    "version": "1.0.0"
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "total": 100,
      "limit": 10,
      "offset": 0,
      "has_more": true
    }
  },
  "meta": {
    "timestamp": "2024-12-07T14:30:00Z",
    "version": "1.0.0"
  }
}
```

## Rate Limiting

### Limits
- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour
- **AI processing requests**: 50 requests per hour

### Headers
Rate limit information is included in response headers:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1641556800
```

### Rate Limit Exceeded
When rate limit is exceeded:
```json
{
  "success": false,
  "error": {
    "message": "Rate limit exceeded",
    "code": "RATE_LIMIT_EXCEEDED",
    "details": {
      "retry_after": 3600
    }
  },
  "meta": {
    "timestamp": "2024-12-07T14:30:00Z",
    "version": "1.0.0"
  }
}
```

## Data Types

### UUID
All IDs are UUIDs in the format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### Timestamp
All timestamps are in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`

### Course Object
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}
```

### Lesson Object
```typescript
interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
  course_id: string;
  created_at: string;
  updated_at: string;
}
```

### User Object
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}
```

## Examples

### Creating a Course with AI Generation

```bash
curl -X POST http://localhost:3000/api/v1/course \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "JavaScript is a programming language that is one of the core technologies of the World Wide Web. This course covers the fundamentals of JavaScript programming including variables, functions, objects, and modern ES6+ features."
  }'
```

### Getting User's Courses

```bash
curl -X GET "http://localhost:3000/api/v1/course?limit=5&offset=0" \
  -H "Authorization: Bearer your-jwt-token"
```

### Updating a Course

```bash
curl -X PUT http://localhost:3000/api/v1/course/course-uuid \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated JavaScript Course",
    "description": "Comprehensive JavaScript programming course"
  }'
```

---

**Last Updated**: December 2024  
**API Version**: 1.0.0  
**Maintained By**: Learn Hub Development Team 