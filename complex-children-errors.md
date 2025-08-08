# Complex Children Property Errors

These errors require more complex fixes than simply adding `children?: React.ReactNode` to interfaces:

## 1. OrderDetailBuyerProtection.tsx:22 - MessageProps

**Error:** `Property 'children' does not exist on type 'IntrinsicAttributes & MessageProps'.`

**Issue:** The `Message` component is imported from `@artsy/palette-mobile` external library and doesn't support children props. It expects `title` and `text` props instead.

**Current usage:**

```tsx
<Message variant="default" containerStyle={{ px: 1 }}>
  <Flex flexDirection="row" alignItems="flex-start">
    <ShieldIcon fill="mono100" mr={0.5} mt="2px" />
    <Flex flex={1}>
      <Text variant="xs">
        Your purchase is protected with{" "}
        <LinkText onPress={...} variant="xs">
          Artsy's buyer protection
        </LinkText>
        .
      </Text>
    </Flex>
  </Flex>
</Message>
```

**Proposed fix:** Replace `Message` with `Box` component and replicate the styling, or refactor to use `title`/`text` props if the complex content can be simplified.

## 2. SavedSearchAlert Test Files - Multiple errors

**Errors:**

- `src/app/Scenes/SavedSearchAlert/__tests__/CreateSavedSearchModal.tests.tsx(93,34): error TS2339: Property 'children' does not exist on type '{}'.`
- `src/app/Scenes/SavedSearchAlert/__tests__/CreateSavedSearchModal.tests.tsx(128,10): error TS2559: Type '{ children: (string | Element)[]; }' has no properties in common with type 'IntrinsicAttributes'.`
- `src/app/Scenes/SavedSearchAlert/screens/__tests__/ConfirmationScreen.tests.tsx(60,34): error TS2339: Property 'children' does not exist on type '{}'.`
- `src/app/Scenes/SavedSearchAlert/screens/__tests__/ConfirmationScreen.tests.tsx(75,8): error TS2559: Type '{ children: Element; }' has no properties in common with type 'IntrinsicAttributes'.`

**Issue:** Test wrapper components (`TestWrapper: React.FC = ({ children }) =>`) are using children but don't have proper prop interfaces.

**Status:** Need to examine the test files more carefully to determine if simple children prop addition will work or if there are more complex interface/mock issues.

## 3. HyperLink Component

**Error:** `Property 'children' does not exist on type 'IntrinsicAttributes & IntrinsicClassAttributes<HyperLink> & Readonly<Props>'.`

**Status:** Need to investigate the HyperLink component source and determine if it's internal or external library.

---

**Next Steps:**

1. Focus on simple children prop additions first
2. Return to these complex cases after completing the easy fixes
3. For external library components, prefer replacing with internal components over trying to modify library types
