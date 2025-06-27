# Testing Best Practices

- [React Native Testing](#react-native-testing)
  - [How Should I Query?](#how-should-i-query)
  - [Testing examples for:](#examples)
    - [useLazyLoadQuery](#testing-a-component-that-has-uselazyloadquery)
    - [useFragment](#testing-a-component-with-usefragment)
  - [setupTestWrapper for relay components](#setuptestwrapper)
  - [renderWithWrappers for non relay components](#renderwithwrappers)
- [Android Native Testing](#android-native-testing)

# React Native Testing

## How should I query

Under the hood we are using `@testing-library/react-native` to render the component for the testing environment. This means that you can use the query methods that you would use with `@testing-library/react-native`.

Remember in your tests to always try to **resemble how the user interacts with the UI** as much as possible.

You can read more on how to query on the official docs [here](https://callstack.github.io/react-native-testing-library/docs/how-should-i-query).

## Examples

### Testing a component that has useLazyLoadQuery

- [ArticleScreen.tests.tsx](/src/app/Scenes/Article/__tests__/ArticleScreen.tests.tsx)

```tsx
const Foo = () => {
  const data = useLazyLoadQuery(graphql`
    query FooQuery {
      me {
        name
      }
    }
  `)

  return <Text>{data.me.name}</Text>
}

export const FooScreen = () => {
  return (
    <Suspense fallback={<Flex testID="loading" />}>
      <Foo />
    </Suspense>
  )
}

const { renderWithRelay } = setupTestWrapper<FooQuery>({
  Component: FooScreen,
})

it("Displays the user's profile name", async () => {
  renderWithRelay({
    Me: () => ({ name: "name" }),
  })

  await waitForElementToBeRemoved(() => screen.getByTestId("loading"))

  expect(screen.queryByText("name")).toBeTruthy()
})
```

### Testing a component with useFragment

- [ArticleBody.tests.tsx](/src/app/Scenes/Article/Components/__tests__/ArticleBody.tests.tsx)
- [ArticleHero.tests.tsx](/src/app/Scenes/Article/Components/__tests__/ArticleHero.tests.tsx)

```tsx
const Bar = () => {
  const data = useFragment(graphql`
    fragment Bar_me on Me {
      name
    }
  `)

  return <Text>{data.name}</Text>
}

const { renderWithRelay } = setupTestWrapper<BarTestQuery>({
  Component: Bar,
  query: graphql`
    query BarTestQuery @relay_test_operation {
      me {
        ...Bar_me
      }
    }
  `,
})

it("Displays the user's profile name", () => {
  renderWithRelay({
    Me: () => ({ name: "Mock Name" }),
  })

  expect(screen.queryByText("name")).toEqual("Mock Name")
})
```

TODO: add more examples from the codebase

## `setupTestWrapper`

The `setupTestWrapper` function is a testing helper designed to simplify the testing of components that use Relay for data fetching in a React/ React Native environment. It provides a way to render components under different Relay query configurations, allowing you to test various scenarios efficiently and easily.

#### `setupTestWrapper params`

| Parameter   | Description                                                                                                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Component` | The React component you want to test. This component should be typed with the expected response shape for your GraphQL query.                                                                                            |
| `preloaded` | A boolean flag that indicates whether you want to simulate preloaded data. When set to true, you must provide a query as well. Preloading is useful when you want to test scenarios where data is available immediately. |
| `query`     | The Relay query you want to test. This query should be typed with the expected response shape for your GraphQL query.                                                                                                    |
| `variables` | The variables to be used with the GraphQL query. You can provide default values if needed.                                                                                                                               |

#### `renderWithRelay` function

The renderWithRelay function is returned by setupTestWrapper. It can be used to render your component and control the Relay environment for testing purposes.

```tsx
const { renderWithRelay } = setupTestWrapper({
  Component: Foo,
  query: graphql`
    query FooQuery {
      me {
        name
      }
    }
  `,
})

const { env, mockResolveLastOperation, mockRejectLastOperation } = renderWithRelay()
```

#### `renderWithRelay params`

| Parameter       | Description                                                                   |
| --------------- | ----------------------------------------------------------------------------- |
| `mockResolvers` | The resolvers for your top level component query                              |
| `props`         | Any initial prop that you want to pass to the component that you are testing. |

#### `renderWithRelay return values`

| Parameter                  | Description                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| `env`                      | The Relay environment that is used to render your component.                                  |
| `mockResolveLastOperation` | A relay resolver that resolves the last operation that was executed by the Relay environment. |
| `mockRejectLastOperation`  | A relay resolver that rejects the last operation that was executed by the Relay environment.  |

## `renderWithWrappers`

The `renderWithWrappers` function is a testing helper designed to simplify the testing of components in our React Native testing environment. It provides a way to render components wrapped with our wrappers, allowing you to test various scenarios efficiently and easily.

We use this function when we want to test something that is not related to Relay but needs the rest of the wrappers of our app, for example, a component that uses `useNavigation` hook.

# Android Native Testing

For Android native code (Java/Kotlin), we use JUnit and MockK for unit testing. The tests are located in `android/app/src/test/java/` and follow the standard Android testing patterns.

## Running Android Tests

To run Android native tests during development:

```bash
# Run all Android unit tests
yarn android:test

# Or run directly with Gradle
cd android && ./gradlew testDebugUnitTest

# Run specific test class
cd android && ./gradlew testDebugUnitTest --tests "net.artsy.app.widgets.FullBleedWidgetProviderTest"

# Run tests matching a pattern
cd android && ./gradlew testDebugUnitTest --tests "net.artsy.app.widgets.*"
```

## Android Test Examples

Widget tests are located in `android/app/src/test/java/net/artsy/app/widgets/`:

- **FullBleedWidgetProviderTest.kt** - Tests core widget functionality
- **ArtworkRotationTest.kt** - Comprehensive tests for artwork selection and state management

## Test Reports

After running tests, HTML reports are generated at:
`android/app/build/reports/tests/testDebugUnitTest/index.html`

The tests integrate with the existing development workflow and can be run alongside React Native tests in CI/CD pipelines.
