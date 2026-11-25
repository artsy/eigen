import { Flex, Text, Touchable } from "@artsy/palette-mobile"

interface MyCollectionListingButtonProps {
  variant: "outline" | "fill"
  disabled?: boolean
  testID?: string
  onPress: () => void
  children: string
}

/** Palette’s Button has no red variant */
export const MyCollectionListingButton: React.FC<MyCollectionListingButtonProps> = ({
  variant,
  disabled,
  testID,
  onPress,
  children,
}) => {
  const filled = variant === "fill"

  return (
    <Touchable
      haptic
      accessibilityRole="button"
      disabled={disabled}
      testID={testID}
      onPress={onPress}
    >
      <Flex
        height={50}
        borderRadius={25}
        borderWidth={1}
        borderColor="red100"
        bg={filled ? "red100" : "mono0"}
        alignItems="center"
        justifyContent="center"
        opacity={disabled ? 0.5 : 1}
      >
        <Text variant="sm-display" color={filled ? "mono0" : "red100"}>
          {children}
        </Text>
      </Flex>
    </Touchable>
  )
}
