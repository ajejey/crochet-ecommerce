# Project Requirements and Standards

## Architecture and Design Principles

### Component Design
1. **Independent Loading**
   - Each component should fetch its own data independently
   - Use SWR for data fetching and caching
   - Implement proper loading states for each component
   - Show skeleton loaders or placeholders during loading

2. **Error Handling**
   - Each component should handle its own errors gracefully
   - Show user-friendly error messages
   - Provide fallback UI when errors occur
   - Log errors appropriately for debugging

3. **State Management**
   - Use SWR for server state management
   - Use React state for local UI state
   - Implement proper data revalidation strategies
   - Cache data appropriately to minimize server calls

### Performance Optimization
1. **Data Fetching**
   - Fetch only required data for each component
   - Implement proper caching strategies
   - Use SWR's built-in caching and revalidation
   - Consider implementing batch API calls if needed

2. **Loading States**
   - Show immediate feedback for user actions
   - Implement progressive loading
   - Keep UI responsive during data fetching
   - Use optimistic updates where appropriate

3. **Code Splitting**
   - Split code into logical chunks
   - Lazy load components when possible
   - Optimize bundle size
   - Use dynamic imports for large components

## Coding Standards

### Component Structure
```javascript
'use client';

import { /* dependencies */ } from 'package';
import { /* internal imports */ } from '@/components';
import { /* actions */ } from './actions';

// Types (if using TypeScript)
interface Props {
  // prop types
}

// Helper components
const SubComponent = ({ /* props */ }) => {
  // implementation
};

// Main component
export default function MainComponent({ /* props */ }) {
  // 1. Hooks (useState, useEffect, etc.)
  // 2. Data fetching (SWR)
  // 3. Event handlers
  // 4. Loading states
  // 5. Error states
  // 6. Render component
}
```

### Data Fetching Pattern
```javascript
// In component
const { data: result, error, isValidating } = useSWR(
  ['unique-key', id],
  () => fetchData(id)
);

// Handle loading
if (!result && !error) {
  return <LoadingState />;
}

// Handle error
if (error || (result && !result.success)) {
  return <ErrorState error={error || result.message} />;
}

// Render data
const { data } = result;
```

### Server Actions Pattern
```javascript
'use server';

export async function serverAction(params) {
  try {
    // 1. Validate input
    // 2. Check authentication
    // 3. Perform action
    // 4. Return success response
    return {
      success: true,
      data: result
    };
  } catch (error) {
    // Handle error
    return {
      success: false,
      message: error.message
    };
  }
}
```

## UI/UX Guidelines

### Loading States
1. Use skeleton loaders for content
2. Show loading spinners for actions
3. Keep previous content visible during revalidation
4. Provide visual feedback for user actions

### Error States
1. Show user-friendly error messages
2. Provide recovery options
3. Maintain UI consistency
4. Log detailed errors for debugging

### Responsive Design
1. Mobile-first approach
2. Consistent spacing and layout
3. Proper grid system usage
4. Accessible color schemes

## Security Considerations

1. **Data Validation**
   - Validate all input data
   - Sanitize user input
   - Implement proper error handling
   - Use appropriate data types

2. **Authentication**
   - Verify user permissions
   - Implement proper session management
   - Secure API endpoints
   - Handle authentication errors

3. **Data Protection**
   - Protect sensitive data
   - Implement proper access controls
   - Use secure communication
   - Follow data privacy guidelines

## Testing Guidelines

1. **Component Testing**
   - Test loading states
   - Test error states
   - Test user interactions
   - Test edge cases

2. **Integration Testing**
   - Test component integration
   - Test data flow
   - Test error handling
   - Test performance

## Development Workflow

1. **Version Control**
   - Use descriptive commit messages
   - Follow branching strategy
   - Review code before merging
   - Keep commits focused

2. **Documentation**
   - Document component APIs
   - Document state management
   - Document error handling
   - Keep documentation updated

3. **Code Quality**
   - Follow consistent coding style
   - Use proper naming conventions
   - Write clean, maintainable code
   - Implement proper error handling

## Environment Setup

1. **Required Environment Variables**
   ```
   NEXT_PUBLIC_DATABASE_ID=your_database_id
   NEXT_PUBLIC_COLLECTION_ORDERS=your_orders_collection
   NEXT_PUBLIC_COLLECTION_PRODUCTS=your_products_collection
   NEXT_PUBLIC_COLLECTION_SELLER_PROFILES=your_seller_profiles_collection
   ```

2. **Dependencies**
   - Next.js 13+
   - SWR for data fetching
   - Tailwind CSS for styling
   - Appwrite for backend
   - Other project-specific packages

## Next.js 14 Routing Guidelines

### Layout and Templates
1. **Shared UI Components**
   ```
   app/
     layout.js      # Root layout (required)
     template.js    # Root template (optional)
     dashboard/
       layout.js    # Dashboard layout
       template.js  # Dashboard template
   ```
   - Use `layout.js` for persistent UI that preserves state
   - Use `template.js` for UI that remounts on navigation
   - Keep layouts lightweight to minimize initial page load

### Loading States and Streaming
1. **Loading UI Convention**
   ```
   app/
     dashboard/
       loading.js   # Loading UI for dashboard
       page.js      # Dashboard page
   ```
   - Implement loading.js for instant loading states
   - Use React Suspense boundaries strategically
   - Show meaningful loading UI during data fetch
   - Example usage:
     ```javascript
     // loading.js
     export default function Loading() {
       return <LoadingSkeleton />;
     }
     ```

### Route Groups
1. **Organization Patterns**
   ```
   app/
     (marketing)/     # Marketing routes group
       about/
       contact/
     (shop)/         # Shop routes group
       products/
       cart/
     (auth)/         # Auth routes group
       login/
       register/
   ```
   - Use route groups to organize routes by:
     - Feature (e.g., (shop), (admin))
     - Team ownership
     - Route type (e.g., (auth), (api))
   - Route groups don't affect URL structure

2. **Multiple Root Layouts**
   ```
   app/
     (shop)/
       layout.js     # Shop layout
       products/
     (admin)/
       layout.js     # Admin layout
       dashboard/
   ```
   - Create different root layouts for different sections
   - Share components between layouts when needed

### Parallel Routes
1. **Usage Patterns**
   ```
   app/
     @modal/
       photo/[id]/
         page.js     # Modal view
     feed/
       page.js       # Main feed
     layout.js       # Shared layout
   ```
   - Use for simultaneous route rendering
   - Implement conditional rendering based on state
   - Perfect for:
     - Dashboards with multiple views
     - Split views/panels
     - Modals and dialogs

2. **Implementation Example**
   ```javascript
   // layout.js
   export default function Layout({ 
     children,
     @modal: modal
   }) {
     return (
       <>
         {children}
         {modal}
       </>
     );
   }
   ```

### Intercepting Routes
1. **Common Use Cases**
   ```
   app/
     feed/
       @modal/(.)photo/[id]/page.js  # Intercept same level
       @modal/(..)photo/[id]/page.js  # Intercept one level up
       @modal/(..)(..)photo/[id]/page.js  # Intercept two levels up
     photo/
       [id]/
         page.js
   ```
   - Modal overlays
   - Slide-out panels
   - Detail views within lists

2. **Implementation Guidelines**
   - Use (.) for same level interception
   - Use (..) for parent level interception
   - Use (...) for root level interception
   - Consider UX for direct URL access

### Best Practices
1. **Route Organization**
   - Group related routes together
   - Use meaningful folder names
   - Keep route structure flat when possible
   - Document route relationships

2. **Performance Considerations**
   - Implement proper loading states
   - Use streaming where appropriate
   - Optimize parallel route loading
   - Consider code splitting boundaries

3. **Error Handling**
   - Implement error.js for route error handling
   - Provide fallback UI for parallel routes
   - Handle loading states gracefully
   - Consider offline scenarios

4. **SEO and Metadata**
   - Use metadata API appropriately
   - Implement proper meta tags
   - Consider dynamic metadata
   - Handle canonical URLs

### When to Use What

1. **Route Groups** - Use when:
   - Organizing routes by feature/team
   - Implementing different layouts for sections
   - Separating marketing from app routes
   - Creating multiple root layouts

2. **Parallel Routes** - Use when:
   - Implementing dashboards
   - Showing multiple views simultaneously
   - Creating modals/dialogs
   - Implementing split views

3. **Intercepting Routes** - Use when:
   - Creating modal overlays
   - Implementing detail views in lists
   - Making slide-out panels
   - Preserving context during navigation

4. **Loading UI** - Use when:
   - Fetching data
   - Processing large operations
   - Implementing server components
   - Streaming content
