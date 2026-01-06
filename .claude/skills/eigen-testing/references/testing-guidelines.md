# Copilot Context for Eigen Testing

## Project Overview

Eigen is a React Native application for Artsy. This document provides context for writing and maintaining tests in this codebase.

## Testing Stack

- **Component Testing**: React Native Testing Library (@testing-library/react-native)
- **GraphQL/Relay**: Relay Test Utils (relay-test-utils)
- **Mocking**: jest-fetch-mock, custom mocks in setupJest.tsx

## File Structure & Naming

### Test File Location

- Place tests in `__tests__` directories colocated with source files
- Example structure:
  ```
  src/app/Components/Feature/
  ├── Feature.tsx
  └── __tests__/
      └── Feature.tests.tsx
  ```

### Naming Convention

- Use `.tests.tsx` for React component tests
- Use `.tests.ts` for utility/model tests

### Module Aliases

Use these path aliases in imports:

```typescript
import { Component } from "app/Components/Feature/Component"
import { colors } from "palette"
import { type } from "shared/utils"
```

## Running Tests

```bash
yarn test              # Run all tests
yarn test:watch       # Watch mode
yarn test:debug       # Debug with node inspector
```

## Core Testing Utilities

### 1. Component Testing (Non-Relay)

Use `renderWithWrappers` for components without Relay dependencies:

```typescript
import { fireEvent, screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ComponentName", () => {
  it("renders correctly", () => {
    renderWithWrappers(<Component prop="value" />)

    expect(screen.getByText("Expected Text")).toBeOnTheScreen()
  })

  it("handles user interaction", () => {
    renderWithWrappers(<Component />)

    fireEvent.press(screen.getByTestId("button-id"))

    expect(mockNavigate).toHaveBeenCalledWith("/path")
  })
})
```

**Wrapper Props:**

```typescript
renderWithWrappers(<Component />, {
  skipRelay: true,           // Skip Relay environment provider
  includeNavigation: true,   // Include navigation context
  includeArtworkLists: true  // Include artwork lists context
})
```

### 2. Relay Component Testing

Use `setupTestWrapper` for components that use Relay queries:

```typescript
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { screen } from "@testing-library/react-native"

describe("RelayComponent", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: YourComponent,
    query: graphql`
      query ComponentTestQuery @relay_test_operation {
        me {
          ...Component_me
        }
      }
    `,
  })

  it("renders data from GraphQL", () => {
    renderWithRelay({
      Me: () => ({
        name: "John Doe",
        email: "john@example.com",
      }),
    })

    expect(screen.getByText("John Doe")).toBeOnTheScreen()
  })

  it("handles error states", () => {
    const { mockRejectLastOperation } = renderWithRelay()

    mockRejectLastOperation(new Error("Network error"))

    expect(screen.getByText("Error message")).toBeOnTheScreen()
  })
})
```

**Mock Helpers:**

```typescript
import { mockEdges } from "app/utils/tests/mockEdges"

// Mock paginated data
renderWithRelay({
  Me: () => ({
    artworks: {
      edges: mockEdges(10), // Creates 10 edge nodes
    },
  }),
})
```

## Testing Patterns

### Navigation Testing

Navigation is globally mocked. Use `mockNavigate`:

```typescript
import { navigate } from "app/system/navigation/navigate"

it("navigates on button press", () => {
  renderWithWrappers(<Component />)

  fireEvent.press(screen.getByText("View Details"))

  expect(navigate).toHaveBeenCalledWith("/artwork/artwork-slug")
})
```

### Tracking/Analytics Testing

To test these, the best way is something like the following:

```ts
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"

it("tracks analytics event when button is tapped", () => {
  const { getByText } = renderWithWrappers(<TestScreen />)

  fireEvent.press(getByText("my button"))

  expect(mockTrackEvent).toHaveBeenCalledTimes(1)
  expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "action": "tappedInfoBubble",
        "context_module": "myCollectionArtwork",
        "context_screen_owner_id": "artwork-id",
        "context_screen_owner_slug": "artwork-slug",
        "context_screen_owner_type": "myCollectionArtwork",
        "subject": "demandIndex",
      },
    ]
  `)
})
```

You can start with an empty snapshot like `expect(trackEvent.mock.calls[0]).toMatchInlineSnapshot()` and when you run the tests, jest will fill it in. Then check if it is correct, and you are ready to commit.

If at some point the track properties change, then the snapshot will need to be updated. If there is a breakage and for some reason a property is not sent, then this snapshot will alert us correctly.

### Async Testing

Use `findBy*` for async operations:

```typescript
it("loads data asynchronously", async () => {
  renderWithRelay()

  await screen.findByText("Loaded Data").toBeOnTheScreen()
})
```

## Important Testing Rules

### 1. Mock Tracking Auto-Clear

`mockTrackEvent` and `mockPostEventToProviders` are automatically cleared in `beforeEach`. No manual clearing needed.

### 2. Do not use Deprecated Utilities

These utilities are deprecated - avoid in new tests:

- `renderWithWrappersLEGACY` → use `renderWithWrappers`
- `setupTestWrapper_LEGACY` → use `setupTestWrapper`
- `resolveMostRecentRelayOperation` → use `setupTestWrapper`
- `flushPromiseQueue` → use `findBy*`
- `waitUntil` → use `waitFor`
- `extractText` → use Testing Library queries
- `renderWithLayout` → use `renderWithWrappers`

### 3. TestID Naming

Use descriptive, kebab-case test IDs:

```typescript
<TouchableOpacity testID="artwork-save-button">
<View testID="artist-series-list-item">
```

## What to Test

### DO Test:

- Component rendering with different props
- User interactions (press, scroll, input)
- Navigation behavior
- Error states and loading states
- Conditional rendering logic
- Analytics tracking calls
- Accessibility features

### DON'T Test:

- Implementation details (internal state, private methods)
- Third-party library functionality
- Styling details (unless critical to functionality)
- Exact DOM structure (use semantic queries)
- React Native framework behavior

## Test Structure

Follow the Arrange-Act-Assert pattern:

```typescript
describe("Component/Feature Name", () => {
  // Setup that applies to all tests
  beforeEach(() => {
    // Clear mocks, reset state
  })

  describe("specific functionality", () => {
    it("does something specific", () => {
      // Arrange: Set up test data and render component
      const props = { title: "Test" }
      renderWithWrappers(<Component {...props} />)

      // Act: Perform user action or trigger behavior
      fireEvent.press(screen.getByTestId("button"))

      // Assert: Verify expected outcome
      expect(mockNavigate).toHaveBeenCalledWith("/path")
    })
  })
})
```

## Getting Help

- Run tests: `yarn test`
- Debug tests: `yarn test:debug`
- Watch mode: `yarn test --watch`
- Check specific file: `yarn test path/to/file.tests.tsx`

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Relay Test Utils](https://relay.dev/docs/guides/testing-relay-components/)
- Setup file: `src/setupJest.tsx`
- Test utilities: `src/app/utils/tests/`
