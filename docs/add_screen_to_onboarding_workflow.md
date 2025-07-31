# Adding a New Screen to the Onboarding Workflow

This guide explains how to add a new screen to the onboarding workflow in the Eigen app.

## Overview

The onboarding workflow consists of:

- **Stack Navigator** (`OnboardingQuiz.tsx`) - Manages screen navigation
- **Workflow Engine** (`config.ts`) - Controls the flow logic and screen order
- **Screen Components** - Individual onboarding screens

## Step-by-Step Guide

### Step 1: Create Your New Screen Component

Create a new file in `src/app/Scenes/Onboarding/OnboardingQuiz/` directory:

```typescript
// OnboardingYourNewScreen.tsx
import { StackScreenProps } from "@react-navigation/stack"
import { Flex, Text, Button, useSpace } from "@artsy/palette-mobile"
import { OnboardingNavigationStack } from "./OnboardingQuiz"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"
import { useOnboardingTracking } from "./Hooks/useOnboardingTracking"

type Props = StackScreenProps<OnboardingNavigationStack, "OnboardingYourNewScreen">

export const OnboardingYourNewScreen: React.FC<Props> = ({ navigation }) => {
  const { next } = useOnboardingContext()
  const tracking = useOnboardingTracking()
  const space = useSpace()

  const handleContinue = () => {
    // Track the action if needed
    tracking.trackTappedNext("your_new_screen")

    // Navigate to next screen
    next()
  }

  return (
    <Flex flex={1} px={2} py={6}>
      <Flex flex={1}>
        <Text variant="lg-display" mb={2}>
          Your Screen Title
        </Text>
        <Text variant="sm" color="black60">
          Your screen description
        </Text>

        {/* Add your screen content here */}
      </Flex>

      <Button
        block
        onPress={handleContinue}
      >
        Continue
      </Button>
    </Flex>
  )
}
```

### Step 2: Add Screen to Navigation Stack Type

Update the `OnboardingNavigationStack` type in `OnboardingQuiz.tsx`:

```typescript
export type OnboardingNavigationStack = {
  OnboardingWelcomeScreen: undefined
  OnboardingQuestionOne: undefined
  OnboardingQuestionTwo: undefined
  OnboardingQuestionThree: undefined
  OnboardingArtistsOnTheRise: undefined
  OnboardingCuratedArtworks: undefined
  OnboardingTopAuctionLots: undefined
  OnboardingFollowArtists: undefined
  OnboardingFollowGalleries: undefined
  OnboardingPostFollowLoadingScreen: undefined
  OnboardingYourNewScreen: undefined // Add your new screen here
}
```

### Step 3: Import and Add Screen to Stack Navigator

In `OnboardingQuiz.tsx`, add:

```typescript
// Add import at the top
import { OnboardingYourNewScreen } from "./OnboardingYourNewScreen"

// Add screen to the navigator (placement depends on your flow)
<StackNavigator.Screen
  name="OnboardingYourNewScreen"
  component={OnboardingYourNewScreen}
/>
```

### Step 4: Update Workflow Configuration

In `config.ts`, you need to:

#### 4a. Add View Constant

```typescript
export const VIEW_YOUR_NEW_SCREEN = "VIEW_YOUR_NEW_SCREEN"
```

#### 4b. Add to Workflow Array

**Option 1: Add as a linear step**

```typescript
workflow: [
  VIEW_WELCOME,
  VIEW_QUESTION_ONE,
  VIEW_QUESTION_TWO,
  VIEW_YOUR_NEW_SCREEN, // Add here if it always appears
  VIEW_QUESTION_THREE,
  // ... rest of workflow
]
```

**Option 2: Add as a conditional branch**

```typescript
workflow: [
  VIEW_WELCOME,
  VIEW_QUESTION_ONE,
  VIEW_QUESTION_TWO,
  {
    DECISION_YOUR_CONDITION: {
      option1: [VIEW_YOUR_NEW_SCREEN],
      option2: [VIEW_QUESTION_THREE], // Skip new screen
    },
  },
  VIEW_QUESTION_THREE,
  // ... rest of workflow
]
```

#### 4c. Add Condition (if using conditional branch)

```typescript
conditions: {
  [DECISION_WHERE_WOULD_YOU_LIKE_TO_DIVE_IN]: () => {
    return basis.current?.questionThree || ""
  },
  // Add your new condition
  DECISION_YOUR_CONDITION: () => {
    // Return the option based on user state
    return basis.current?.someProperty === "someValue" ? "option1" : "option2"
  }
}
```

### Step 5: Handle Screen Navigation

The navigation is handled by the `useOnboardingContext` hook. When you call `next()`, it will:

1. Get the next screen from the WorkflowEngine
2. Navigate to that screen using React Navigation

```typescript
// In your screen component
const { next, back } = useOnboardingContext()

// To go forward
next()

// To go back
back()
```

### Step 6: Add Analytics Tracking (Optional)

If you need to track user interactions:

1. Add tracking events in `useOnboardingTracking.ts`
2. Call tracking methods in your screen component

```typescript
const tracking = useOnboardingTracking()

// Track screen view
useEffect(() => {
  tracking.trackScreenView("your_new_screen")
}, [])

// Track user actions
tracking.trackTappedOption("your_new_screen", selectedOption)
```

## Example: Adding a Price Range Screen as a Linear Screen

Here's a complete example of adding a price range selection screen:

### 1. Create `OnboardingPriceRange.tsx`

```typescript
import { StackScreenProps } from "@react-navigation/stack"
import { Flex, Text, Button, RadioButton, useSpace } from "@artsy/palette-mobile"
import { useState } from "react"
import { OnboardingNavigationStack } from "./OnboardingQuiz"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"

type Props = StackScreenProps<OnboardingNavigationStack, "OnboardingPriceRange">

const PRICE_RANGES = [
  { value: "0-1000", label: "Under $1,000" },
  { value: "1000-5000", label: "$1,000 - $5,000" },
  { value: "5000-10000", label: "$5,000 - $10,000" },
  { value: "10000+", label: "$10,000 and above" },
]

export const OnboardingPriceRange: React.FC<Props> = () => {
  const { next, state, setState } = useOnboardingContext()
  const [selected, setSelected] = useState(state.priceRange)
  const space = useSpace()

  const handleContinue = () => {
    setState({ priceRange: selected })
    next()
  }

  return (
    <Flex flex={1} px={2} py={6}>
      <Flex flex={1}>
        <Text variant="lg-display" mb={2}>
          What's your art budget?
        </Text>
        <Text variant="sm" color="black60" mb={4}>
          This helps us show you works within your price range
        </Text>

        {PRICE_RANGES.map((range) => (
          <RadioButton
            key={range.value}
            text={range.label}
            selected={selected === range.value}
            onPress={() => setSelected(range.value)}
            mb={2}
          />
        ))}
      </Flex>

      <Button
        block
        onPress={handleContinue}
        disabled={!selected}
      >
        Continue
      </Button>
    </Flex>
  )
}
```

### 2. Update Navigation Stack

```typescript
export type OnboardingNavigationStack = {
  // ... existing screens
  OnboardingPriceRange: undefined
}
```

### 3. Add to Stack Navigator

```typescript
<StackNavigator.Screen
  name="OnboardingPriceRange"
  component={OnboardingPriceRange}
/>
```

### 4. Update config.ts

```typescript
export const VIEW_PRICE_RANGE = "VIEW_PRICE_RANGE"

// Add after question two
workflow: [
  VIEW_WELCOME,
  VIEW_QUESTION_ONE,
  VIEW_QUESTION_TWO,
  VIEW_PRICE_RANGE, // New screen
  VIEW_QUESTION_THREE,
  // ... rest
]
```

## Example 2: Adding Price Range as a Conditional Screen

Here's how to show the price range screen only when the user selects specific options in question two:

### 1. First, identify which options should trigger the price range screen

In question two, these options suggest the user is interested in purchasing:

- "Finding my next great investment" (existing option)
- "Hunting for art within my budget" (new option to be added)

### 2. Add the new option constant

In `config.ts`, add the new option:

```typescript
// Existing options
export const OPTION_DEVELOPING_MY_ART_TASTES = "Developing my art tastes"
export const OPTION_KEEP_TRACK_OF_ART = "Keeping track of art I'm interested in"
export const OPTION_FINDING_GREAT_INVESTMENTS = "Finding my next great investment"
export const OPTION_COLLECTING_ART_THAT_MOVES_ME = "Collecting art that moves me"

// Add the new option
export const OPTION_HUNTING_FOR_ART_WITHIN_BUDGET = "Hunting for art within my budget"
```

### 3. Update Question Two screen to include the new option

In `OnboardingQuestionTwo.tsx`, add the new option to the list:

```typescript
const OPTIONS = [
  OPTION_DEVELOPING_MY_ART_TASTES,
  OPTION_KEEP_TRACK_OF_ART,
  OPTION_FINDING_GREAT_INVESTMENTS,
  OPTION_COLLECTING_ART_THAT_MOVES_ME,
  OPTION_HUNTING_FOR_ART_WITHIN_BUDGET, // Add this new option
]
```

### 4. Update config.ts with conditional workflow

```typescript
// Add the new constants
export const VIEW_PRICE_RANGE = "VIEW_PRICE_RANGE"
export const DECISION_SHOULD_SHOW_PRICE_RANGE = "DECISION_SHOULD_SHOW_PRICE_RANGE"

// Update the workflow to include conditional logic
export const useConfig = ({ basis, onDone }: UseConfig) => {
  const workflowEngine = useRef(
    new WorkflowEngine({
      workflow: [
        VIEW_WELCOME,
        VIEW_QUESTION_ONE,
        VIEW_QUESTION_TWO,
        {
          [DECISION_SHOULD_SHOW_PRICE_RANGE]: {
            true: [VIEW_PRICE_RANGE, VIEW_QUESTION_THREE],
            false: [VIEW_QUESTION_THREE],
          },
        },
        {
          [DECISION_WHERE_WOULD_YOU_LIKE_TO_DIVE_IN]: {
            // ... existing options
          },
        },
      ],
      conditions: {
        [DECISION_SHOULD_SHOW_PRICE_RANGE]: () => {
          // Show price range screen for investment or budget-conscious options
          const questionTwoAnswer = basis.current?.questionTwo
          const showPriceRange =
            questionTwoAnswer === OPTION_FINDING_GREAT_INVESTMENTS ||
            questionTwoAnswer === OPTION_HUNTING_FOR_ART_WITHIN_BUDGET

          return String(showPriceRange)
        },
        [DECISION_WHERE_WOULD_YOU_LIKE_TO_DIVE_IN]: () => {
          return basis.current?.questionThree || ""
        },
      },
    })
  )
  // ... rest of the hook
}
```

### 5. Create the Price Range Screen (same as before)

The `OnboardingPriceRange.tsx` component remains the same as in the previous example.

### 6. Update Navigation Stack and Stack Navigator

Same as in the linear example - add the screen type and register it with the navigator.

### 7. Understanding the Flow

With this configuration:

```
User Journey A (Shows Price Range):
Welcome → Question 1 → Question 2 (selects "Finding my next great investment") →
Price Range → Question 3 → [Continue based on Q3 answer]

User Journey B (Skips Price Range):
Welcome → Question 1 → Question 2 (selects "Developing my art tastes") →
Question 3 → [Continue based on Q3 answer]
```

### 8. Testing the Conditional Flow

To test your conditional navigation:

```typescript
// In your test file or debugging
const mockState = {
  questionTwo: OPTION_FINDING_GREAT_INVESTMENTS, // Should show price range
}

// Or to skip price range
const mockState2 = {
  questionTwo: OPTION_DEVELOPING_MY_ART_TASTES, // Should skip price range
}
```

### Key Points for Conditional Navigation

1. **Decision Points**: Create a decision constant (e.g., `DECISION_SHOULD_SHOW_PRICE_RANGE`)
2. **Condition Function**: Return a string that matches one of your branch keys
3. **Branch Structure**: Each branch is an array of screens to show
4. **Flow Continuation**: After the conditional screens, the flow continues with the remaining workflow

## Testing Your New Screen

1. Run the app and go through the onboarding flow
2. Verify your screen appears in the correct order
3. Test navigation (next/back buttons)
4. Check that any state updates are saved properly
5. Verify analytics tracking is working

## Common Pitfalls

1. **Forgetting to add the screen to the navigation stack type** - This will cause TypeScript errors
2. **Not handling the back navigation properly** - Make sure your screen works with the back button
3. **Workflow configuration errors** - Double-check your workflow array syntax
4. **State management** - Ensure you're properly saving user selections to the context
