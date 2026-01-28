---
name: add-route
description: Add a new global route to the Eigen React Native app that is accessible everywhere and may need deep linking support if it exists on artsy.net
---

# Add Route Skill

This skill helps you add a new route to the Eigen React Native app.

## When to Use This Skill

Use this skill when you need to add a new global route that:

- Is accessible everywhere in the app
- May need deep linking support if it exists on artsy.net
- Is not a context-specific route (which uses independent NavigationContainers)

## What This Skill Does

1. Collects information about the new route
2. Creates a stub component if it doesn't exist
3. Adds the route definition to `routes.tsx`
4. Optionally adds deep link to `AndroidManifest.xml` (if route exists on artsy.net)

## Instructions

### Step 1: Gather Route Information

Ask the user for the following information (use AskUserQuestion for multiple choice options where appropriate):

1. **Route Path**: The URL path (e.g., `/my-new-screen` or `/artist/:artistID/details`)

   - Must start with `/`
   - Can include parameters with `:paramName` syntax

2. **Route Name**: The unique name for this route (e.g., `MyNewScreen`)

   - Use PascalCase

3. **Component Name**: The React component name (e.g., `MyNewScreenQueryRenderer`)

   - Use PascalCase
   - Suggest appending `QueryRenderer` if it needs Relay data

4. **Component Path**: Where the component file should live (e.g., `app/Scenes/MyNewScreen/MyNewScreen`)

   - Relative to `src/`
   - Don't include `.tsx` extension

5. **Deep Linking**: Does this route exist on artsy.net?

   - Ask: "Does this route correspond to a page on artsy.net (e.g., artsy.net{path})?"
   - If YES: Add to AndroidManifest.xml for deep linking
   - If NO: Skip AndroidManifest.xml modification

6. **Screen Options**: Ask about common options:
   - Header title (if shown)
   - Should header be shown? (default: false)
   - Should bottom tabs be hidden? (default: false)
   - Should it always present modally? (default: false)
   - Any other screen options they want to specify

### Step 2: Validate

Before making changes:

1. **Check for duplicates**:

   - Search `routes.tsx` for the path and name to ensure they don't already exist
   - Warn if duplicates are found

2. **Validate path format**:

   - Must start with `/`
   - Should follow kebab-case convention (e.g., `/my-route` not `/myRoute`)

3. **Check component exists**:
   - Check if the component file exists at the specified path
   - If not, plan to create a stub component

### Step 3: Create Stub Component (if needed)

If the component doesn't exist, create a basic stub component.

**Important**: For components with GraphQL queries, include a working example query (not a comment inside the graphql tag) so the component can render without syntax errors. Add a JavaScript comment above the query telling the user to replace it.

For basic components without Relay:

```typescript
import { Screen } from "@artsy/palette-mobile"

export const ComponentName = () => {
  return (
    <Screen>
      <Screen.Body>
        {/* TODO: Implement screen content */}
      </Screen.Body>
    </Screen>
  )
}
```

For components that need Relay data (ends with `QueryRenderer`), create:

```typescript
import { Screen } from "@artsy/palette-mobile"
import { graphql } from "react-relay"

// TODO: Replace this example query with the actual query needed for your screen
export const ComponentNameScreenQuery = graphql`
  query ComponentNameScreenQuery {
    artist(id: "kaws") {
      name
    }
  }
`

export const ComponentNameQueryRenderer = () => {
  return (
    <Screen>
      <Screen.Body>
        {/* TODO: Implement screen content */}
      </Screen.Body>
    </Screen>
  )
}
```

### Step 4: Add Route to routes.tsx

1. **Find insertion point**:

   - Routes should be alphabetically ordered by path
   - Find the correct location in the `artsyDotNetRoutes` array
   - Place before the catch-all routes at the end (like `/:slug` and `/*`)

2. **Add the route definition**:

```typescript
{
  path: "/path",
  name: "RouteName",
  Component: ComponentName,
  options: {
    screenOptions: {
      headerShown: false, // or true with headerTitle
      // Add other options as needed
    },
    // Add hidesBottomTabs, alwaysPresentModally, etc. if needed
  },
},
```

3. **Add import statement**:
   - Add the component import at the top of `routes.tsx` with other imports
   - Keep imports alphabetically organized
   - Example: `import { ComponentName } from "app/Scenes/Path/ComponentName"`

### Step 5: Add Deep Link to AndroidManifest.xml (if applicable)

**Only do this if the user confirmed the route exists on artsy.net**

1. **Find the intent-filter section**:

   - Look for the `<intent-filter android:autoVerify="true">` section around line 47-100
   - This section contains `<data android:pathPrefix="..."/>` entries

2. **Add the pathPrefix**:

   - Extract the base path (without parameters)
   - For `/artist/:artistID/details`, use `/artist` (usually already exists) and add `/details` consideration
   - For `/my-new-screen`, add `<data android:pathPrefix="/my-new-screen"/>`
   - Keep entries alphabetically sorted

3. **Format properly**:
   ```xml
   <data android:pathPrefix="/my-new-screen"/>
   ```

### Step 6: Verify Changes

After making all changes:

1. Show a summary of what was added:

   - Component file created (if applicable)
   - Route added to routes.tsx at line X
   - Deep link added to AndroidManifest.xml at line Y (if applicable)
   - Import added to routes.tsx

2. Provide next steps:
   - Implement the component content
   - Replace the example GraphQL query with the actual query needed for the screen
   - Add prepareVariables if route has parameters
   - Test the route by navigating to it

## Important Notes

- **Conditional deep linking**: Only add to AndroidManifest.xml if the route exists on artsy.net
- **Follow existing patterns**: Look at similar routes for guidance on options and structure
- **Component location**: Scenes go in `src/app/Scenes/`, containers in `src/app/Components/Containers/`
- **GraphQL stub queries**: Include a working example query (not TODO comments inside graphql tags) so components can render without errors. The user can replace it with their actual query later
- **No webView routes**: This skill only handles native component routes
- **Parameter handling**: Routes with parameters (`:paramName`) may need special handling for deep links

## Example Workflow

1. User: "I want to add a route for /my-collection/insights"
2. Skill asks questions and gathers info
3. User confirms route exists on artsy.net
4. Skill creates component, adds to routes.tsx, and AndroidManifest.xml
5. Summary provided with next steps
