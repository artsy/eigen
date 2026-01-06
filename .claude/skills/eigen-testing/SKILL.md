---
name: eigen-testing
description: Write and maintain tests for Eigen, a React Native application using React Native Testing Library and Relay Test Utils. Use this skill when writing new tests, fixing failing tests, adding test coverage, updating existing tests, or when asked about testing best practices for Eigen. Triggers on requests like "write tests for this component", "add test coverage", "fix this test", "how should I test this", or any testing-related questions for the Eigen codebase.
---

# Eigen Testing Skill

Use this skill to write high-quality tests for Eigen following established patterns and best practices.

## Quick Start

### For Non-Relay Components

Use the template at `assets/component-test-template.tsx` as a starting point:

```typescript
import { fireEvent, screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
```

### For Relay Components

Use the template at `assets/relay-test-template.tsx` as a starting point:

```typescript
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
```

## Critical Rules

1. **File Location**: Always place tests in `__tests__` directories colocated with source files
2. **File Naming**: Use `.tests.tsx` (not `.test.tsx` or `.spec.tsx`)
3. **Never Use Deprecated Utilities**: Avoid `renderWithWrappersLEGACY`, `setupTestWrapper_LEGACY`, `resolveMostRecentRelayOperation`, `flushPromiseQueue`, `waitUntil`, `extractText`, `renderWithLayout`
4. **Analytics Testing**: Always use `toMatchInlineSnapshot()` pattern for tracking events
5. **Async Operations**: Use `findBy*` queries, not `waitUntil` or promise flushing

## Test Structure Pattern

Follow Arrange-Act-Assert:

```typescript
describe("ComponentName", () => {
  it("does something specific", () => {
    // Arrange: Set up and render
    renderWithWrappers(<Component />)

    // Act: Trigger behavior
    fireEvent.press(screen.getByTestId("button-id"))

    // Assert: Verify outcome
    expect(mockNavigate).toHaveBeenCalledWith("/path")
  })
})
```

## Common Patterns

### Testing Navigation

```typescript
import { navigate } from "app/system/navigation/navigate"

expect(navigate).toHaveBeenCalledWith("/artwork/artwork-slug")
```

### Testing Analytics

```typescript
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"

expect(mockTrackEvent).toHaveBeenCalledTimes(1)
expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot()
// Run test to generate snapshot, then verify it's correct
```

### Testing Relay Data

```typescript
renderWithRelay({
  Me: () => ({
    name: "John Doe",
    artworks: {
      edges: mockEdges(10), // Use mockEdges for paginated data
    },
  }),
})
```

### Testing Error States

```typescript
const { mockRejectLastOperation } = renderWithRelay()
mockRejectLastOperation(new Error("Network error"))
```

## Detailed Guidelines

For comprehensive testing patterns, utilities, and examples, refer to:

- **[references/testing-guidelines.md](references/testing-guidelines.md)** - Complete testing documentation

Read this file when you need:

- Detailed examples of testing patterns
- Information about wrapper props and configuration
- Guidance on what to test and what not to test
- Mock helpers and utilities
- Additional resources and links

## TestID Conventions

Use descriptive, kebab-case test IDs:

- `artwork-save-button`
- `artist-series-list-item`
- `price-display-container`

## Running Tests

```bash
yarn test                                    # Run all tests
yarn test:watch                              # Watch mode
yarn test path/to/file.tests.tsx             # Test specific file
```
