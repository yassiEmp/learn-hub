here is what the current data base course look like 

```typescript
const courseData = {
    title: title , // Use provided title or generated one
    description: description , // Use provided description or generated one
    content: text,
    owner_id: user.id,
    category: category || 'General',
    level: level || 'Beginner',
    price: 0,
    tags: tags || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};
```

here is the object that the courseDetail page need to render a course and his informations 

```typescript
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  thumbnail: string;
  duration: string;
  lessonsCount: number;
  studentsCount: number;
  rating: number;
  price: number;
  originalPrice?: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  content?: string;
  lessons: Lesson[];
  isEnrolled?: boolean;
  progress?: number;
  // Database fields
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}
```

the table course have a relation with the table lesson so that a course can have many lesson 

here is what the lesson look like in the data base 

```typescript
export interface Lesson {
  title: string;
  content: string;
  summary?: string;
  objectives?: string[];
  resources?: string[];
}
```

we will need a way to reconcile the information in the database with the one the courseDetail page need to work 


```typescript
export interface Course {
  id: string;   // available
  title: string; // available
  description: string; // available
  owner_id: string; // available 
  created_at?: string; // available 
  updated_at?: string; // available 
  category: string; // available 
  tags: string[]; // available [ ] but fix the current implementation in the rendering (in courseDetail componants) and in the ai generation part (prompt)
  content?: string; // available [ ] but make it better 
  lessons: Lesson[]; // available through request to the database (relation between lesson and data base )

  instructor: string; // not available [ ] but since course in the db have a relation with the user id we can get the creator info with his id 
  instructorAvatar: string; // not available [ ] but we can ask people for profile picture and use that if that is not available use the user Initial like for jean mark you would get JM in a soft bg color 
  thumbnail: string; // not available [ ] i don't know what it is 
  duration: string; // not available [ ] we can get it by asking the ai to add it to the json generation and adding it to the db as a migration  
  lessonsCount: number; // not available [ ] query all the lesson in the data base ( courseId relation ) and count them 
  studentsCount: number; // this will be implemented later on keep it has 1 for now 
  rating: number; // this will be implemented later keep it at 5 for now 
  price: number; // this will be implemented later keep it at 0 for now 
  originalPrice?: number; // this will be implemented later keep it at 0 for now 
  level: 'Beginner' | 'Intermediate' | 'Advanced'; // available
  isEnrolled?: boolean; // not available [ ] that will be implemented has a relation table or something like that depend on the user and the course
  progress?: number; // not available [ ] that will be implemented has a relation table or something like that depend on the user and the course
}
```