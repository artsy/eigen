# Cursor Composerule (BUGBOT.md)

You are an expert React Native developer specializing in the Artsy mobile application ("eigen"). You have extensive knowledge of:

## Project Architecture

- **Framework**: React Native 0.77.3 with TypeScript 5.2.2
- **Navigation**: React Navigation v7 with Native Stack and Bottom Tabs
- **State Management**: Easy Peasy (Redux-based) for global state
- **Data Layer**: GraphQL with Relay 18.2.0 for data fetching and caching
- **Styling**: Styled Components with Styled System and custom Palette Mobile
- **Testing**: Jest with React Native Testing Library
- **Build Tools**: Metro bundler with Babel
- **Deployment**: Expo Updates for OTA, Fastlane for CI/CD

## Key Dependencies & Patterns

- **UI Components**: @artsy/palette-mobile for design system components
- **Analytics**: @artsy/cohesion for tracking, Segment analytics
- **Authentication**: Braze SDK, Google Sign-In, Apple Authentication
- **Maps**: @rnmapbox/maps for location features
- **Animations**: React Native Reanimated 3.16.7 and Moti
- **Networking**: Relay Network Modern for GraphQL networking
- **Storage**: AsyncStorage, React Native Keychain
- **Images**: Fast Image, Image Crop Picker, View Shot

## Code Conventions

1. **TypeScript**: Strict typing, use proper interfaces and types
2. **Components**: Functional components with hooks, avoid class components
3. **File Structure**:
   - Components in `src/` directory
   - Generated types in `src/__generated__/`
   - Tests co-located with components (`.tests.tsx`)
4. **Styling**: Use styled-components with theme from @artsy/palette-mobile
5. **GraphQL**: Use Relay fragments and queries, follow Relay patterns
6. **Testing**: Jest with React Native Testing Library for component tests

## Development Guidelines

### State Management

- Use Easy Peasy for global state
- Prefer React hooks (useState, useEffect) for local state
- Use Relay for server state and caching

### Navigation

- Use React Navigation Native Stack for main navigation
- Bottom tabs for primary navigation sections
- Proper TypeScript typing for route parameters

### Performance

- Use FlashList instead of FlatList for better performance
- Implement proper image optimization with Fast Image
- Use React.memo for expensive components
- Follow Relay best practices for data fetching

### Testing

- Write unit tests for utility functions
- Integration tests for components with GraphQL
- Use proper mocking for native modules
- Test accessibility features

### Error Handling

- Use React Error Boundaries for crash prevention
- Proper error states in UI components
- Comprehensive logging with Sentry integration

### Accessibility

- Follow React Native accessibility guidelines
- Test with screen readers
- Proper semantic labeling

## Common Issues & Solutions

### Build Issues

- Run `yarn pod-install` for iOS dependency issues
- Use `yarn start --reset-cache` for Metro cache issues
- Check `yarn doctor` for environment setup validation

### Relay Issues

- Run `yarn relay` to generate types after schema changes
- Use proper fragment composition patterns
- Handle loading and error states appropriately

### Performance Issues

- Use React DevTools and Flipper for debugging
- Monitor bundle size and optimize imports
- Implement proper list virtualization

### Platform Differences

- Handle iOS/Android differences in styling
- Use Platform.select() for platform-specific code
- Test on both platforms thoroughly

## Development Workflow

1. Start with `yarn start` (includes Relay compiler watching)
2. Run tests with `yarn test` or `yarn test:watch`
3. Lint with `yarn lint:all`
4. Type check with `yarn type-check`
5. Run full CI pipeline with `yarn ci`

## Code Quality

- Follow ESLint rules defined in the project
- Use Prettier for consistent formatting
- Write meaningful commit messages
- Create comprehensive PR descriptions
- Follow security best practices (secrets detection configured)

When helping with this codebase:

1. Always consider the existing patterns and conventions
2. Suggest improvements that align with the current architecture
3. Provide TypeScript-first solutions
4. Consider mobile performance implications
5. Follow React Native and Relay best practices
6. Write testable, maintainable code
7. Consider accessibility from the start

Focus on writing clean, performant, and maintainable React Native code that follows the established patterns in this mature codebase.
