# Learn Hub Next.js - Coding Standards & Conventions

## Table of Contents
1. [General Principles](#general-principles)
2. [File & Directory Structure](#file--directory-structure)
3. [Naming Conventions](#naming-conventions)
4. [TypeScript Guidelines](#typescript-guidelines)
5. [React/Next.js Guidelines](#reactnextjs-guidelines)
6. [API Development](#api-development)
7. [Database Guidelines](#database-guidelines)
8. [Testing Standards](#testing-standards)
9. [Security Guidelines](#security-guidelines)
10. [Performance Guidelines](#performance-guidelines)
11. [Documentation Standards](#documentation-standards)
12. [Microservices & API Communication](#microservices--api-communication)

## General Principles

### Code Quality
- **Readability First**: Code should be self-documenting and easy to understand
- **Consistency**: Follow established patterns throughout the codebase
- **DRY (Don't Repeat Yourself)**: Avoid code duplication
- **SOLID Principles**: Follow object-oriented design principles
- **Fail Fast**: Handle errors early and explicitly

### Development Workflow
- **Feature Branches**: Create feature branches for new development
- **Small Commits**: Make atomic, focused commits
- **Code Review**: All code must be reviewed before merging
- **Testing**: Write tests for new features and bug fixes

## File & Directory Structure

### Root Level Organization
```
learn-hub-next/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── docs/                   # Project documentation
├── features/               # Feature-specific modules
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── public/                 # Static assets
```

### Component Structure
```
components/
├── ui/                     # Base UI components
├── dashboard/              # Dashboard-specific components
├── exam-editor/            # Exam editor components
└── import-page/            # Import page components
```

### Feature Structure
```
features/
├── course/                 # Course-related features
│   ├── prompt/            # AI prompts
│   └── utils/             # Course utilities
└── import/                # Import-related features
    └── components/        # Import components
```

## Naming Conventions

### Files & Directories
- **Components**: PascalCase (e.g., `CourseCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `apiClient.ts`)
- **Types**: PascalCase (e.g., `course.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)

### Variables & Functions
- **Variables**: camelCase (e.g., `courseTitle`, `userData`)
- **Functions**: camelCase (e.g., `getUserData`, `createCourse`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Boolean variables**: Use `is`, `has`, `can` prefixes (e.g., `isLoading`, `hasPermission`)

### Database & API
- **Database tables**: snake_case (e.g., `user_profiles`)
- **API endpoints**: kebab-case (e.g., `/api/v1/course-management`)
- **Database columns**: snake_case (e.g., `created_at`, `user_id`)

## TypeScript Guidelines

### Type Definitions
```typescript
// Use interfaces for object shapes
interface Course {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// Use types for unions and complex types
type CourseStatus = 'draft' | 'published' | 'archived';

// Use enums sparingly, prefer const assertions
const COURSE_TYPES = {
  VIDEO: 'video',
  TEXT: 'text',
  INTERACTIVE: 'interactive'
} as const;
```

### Function Signatures
```typescript
// Use explicit return types for public functions
export async function createCourse(data: CreateCourseData): Promise<Course> {
  // implementation
}

// Use void for functions that don't return values
export function handleError(error: Error): void {
  console.error(error);
}
```

### Error Handling
```typescript
// Use custom error types
class CourseCreationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'CourseCreationError';
  }
}

// Use Result pattern for operations that can fail
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```

## React/Next.js Guidelines

### Component Structure
```typescript
// Component with proper typing
interface CourseCardProps {
  course: Course;
  onEdit?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
}

export default function CourseCard({ 
  course, 
  onEdit, 
  onDelete 
}: CourseCardProps) {
  // Component logic
  return (
    <div className="course-card">
      {/* JSX */}
    </div>
  );
}
```

### Hooks Usage
```typescript
// Custom hooks should be focused and reusable
export function useCourse(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch course data
  }, [courseId]);

  return { course, loading, error };
}
```

### State Management
- Use React's built-in state for component-local state
- Use Context API for shared state across components
- Consider Zustand or Redux for complex global state
- Avoid prop drilling by using composition or context

## API Development

### Route Structure
```
app/api/
├── v1/                    # API version 1
│   ├── course/           # Course endpoints
│   ├── user/             # User endpoints
│   └── auth/             # Authentication endpoints
└── middleware/           # API middleware
```

### Response Format
```typescript
// Standard API response format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}
```

### Error Handling
```typescript
// Use consistent error responses
export function createErrorResponse(message: string, code: string) {
  return Response.json({
    success: false,
    error: { message, code },
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  }, { status: 400 });
}
```

### Authentication & Authorization
- Always verify JWT tokens in protected routes
- Use Row Level Security (RLS) in Supabase
- Implement proper role-based access control
- Log authentication events for security

## Database Guidelines

### Schema Design
- Use meaningful table and column names
- Include created_at and updated_at timestamps
- Use UUIDs for primary keys
- Implement proper foreign key relationships
- Use appropriate data types and constraints

### RLS Policies
```sql
-- Example RLS policy for courses
CREATE POLICY "Users can only access their own courses"
ON courses
FOR ALL
USING (auth.uid() = owner_id);
```

### Migrations
- Use versioned migrations
- Include both up and down migrations
- Test migrations on staging before production
- Document breaking changes

## Testing Standards

### Unit Tests
- Test individual functions and components
- Use descriptive test names
- Mock external dependencies
- Aim for >80% code coverage

### Integration Tests
- Test API endpoints
- Test database operations
- Test authentication flows
- Use test databases

### E2E Tests
- Test critical user journeys
- Test cross-browser compatibility
- Test responsive design
- Use realistic test data

## Security Guidelines

### Authentication
- Use secure session management
- Implement proper password hashing
- Use HTTPS in production
- Implement rate limiting

### Data Validation
- Validate all user inputs
- Use TypeScript for type safety
- Sanitize data before database operations
- Implement proper error handling

### Authorization
- Check permissions at every level
- Use principle of least privilege
- Implement proper role management
- Audit access logs

## Performance Guidelines

### Frontend Optimization
- Use Next.js Image component for images
- Implement proper code splitting
- Use React.memo for expensive components
- Optimize bundle size

### Backend Optimization
- Use database indexes appropriately
- Implement caching strategies
- Optimize database queries
- Use connection pooling

### Monitoring
- Monitor API response times
- Track error rates
- Monitor database performance
- Set up alerts for critical issues

## Documentation Standards

### Code Documentation
- Use JSDoc for public functions
- Document complex algorithms
- Include usage examples
- Keep documentation up to date

### API Documentation
- Document all endpoints
- Include request/response examples
- Document error codes
- Use OpenAPI/Swagger

### README Files
- Include setup instructions
- Document environment variables
- Include troubleshooting guides
- Keep deployment instructions current

## Git Commit Conventions

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```
feat(course): add course creation with AI title generation
fix(auth): resolve JWT token validation issue
docs(api): update API documentation for course endpoints
```

## Environment Variables

### Naming Convention
- Use UPPER_SNAKE_CASE
- Prefix with service name when needed
- Use descriptive names

### Required Variables
```env
# Database
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# External APIs
GOOGLE_API_KEY=

# Environment
NODE_ENV=development
```

## Code Review Checklist

### Before Submitting
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Documentation is updated
- [ ] No sensitive data in code

### During Review
- [ ] Code is readable and maintainable
- [ ] Security considerations are addressed
- [ ] Performance impact is considered
- [ ] Tests cover new functionality
- [ ] Documentation is clear and complete

## AI/LLM Integration

- Always validate and sanitize AI-generated content before saving or displaying.
- Log all AI service requests and responses for debugging and auditing.
- Use environment variables for all API keys and secrets.
- Document prompt engineering strategies and keep prompts versioned.
- Prefer stateless, idempotent API calls to external AI services.
- Handle AI service errors gracefully and provide user feedback.
- Limit and monitor usage to control costs and prevent abuse.

## Microservices & API Communication

- Use RESTful conventions for all internal and external service APIs.
- Document all service endpoints and expected payloads.
- Use OpenAPI/Swagger for service API documentation.
- Handle network errors and timeouts with retries and exponential backoff.
- Secure all inter-service communication with authentication and HTTPS.
- Version all service APIs and document breaking changes.

## Feature Flags & Experimental Features

- Use feature flags for all experimental or beta features.
- Document the process for enabling/disabling features.
- Ensure all feature flags are removed or promoted to stable after validation.
- Use environment variables or a feature management service for flag control.

## Batch Processing & Background Jobs

- Use job queues (e.g., Redis, Celery) for heavy or long-running tasks.
- Track job status and provide user feedback on progress.
- Log all job executions and errors for monitoring.
- Implement retry logic and dead-letter queues for failed jobs.

## Content Import & Structuring

- Validate all imported files for type, size, and content.
- Sanitize and normalize imported text before processing.
- Store original and structured content for traceability.
- Provide users with a preview and editing interface before finalizing import.
- Log all import actions for auditing.

## Security for AI & File Uploads

- Scan all uploaded files for malware and prohibited content.
- Limit file types and sizes to prevent abuse.
- Never expose raw AI prompts or completions to end users.
- Use signed URLs or secure storage for all uploaded files.

## Documentation for New Features

- Update the main roadmap and planning docs with all new features and sprints.
- Document all new API endpoints, database migrations, and UI components.
- Add usage examples for new features in the README or a dedicated guide.

---

**Remember**: These guidelines are living documents. Update them as the project evolves and new patterns emerge. 