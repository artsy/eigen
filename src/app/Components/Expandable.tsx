import { ChevronSmallRightIcon } from "@artsy/icons/native"
import {
  Collapse,
  DEFAULT_ANIMATION_DURATION,
  Flex,
  Text,
  Touchable,
  useColor,
} from "@artsy/palette-mobile"
import { MAX_WIDTH_BIO } from "app/Components/Artist/Biography"
import { useEffect, useState } from "react"
import { Animated, useAnimatedValue } from "react-native"

interface ExpandableProps {
  label?: string
  expanded?: boolean
  children: React.ReactNode
  onTrack?: () => void
}

/**
 * Expandable component used only by Artist About tab, if there's a need to use it elsewhere
 * move it to palette
 */
export const Expandable: React.FC<ExpandableProps> = ({
  children,
  expanded: propExpanded,
  label,
  onTrack,
}) => {
  const [expanded, setExpanded] = useState(propExpanded)
  const color = useColor()

  const rotateAnimated = useAnimatedValue(expanded ? 1 : 0)

  useEffect(() => {
    Animated.timing(rotateAnimated, {
      toValue: expanded ? 1 : 0,
      duration: DEFAULT_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start()
  }, [expanded, rotateAnimated])

  const handleToggle = () => {
    setExpanded((prev) => !prev)

    if (onTrack) {
      onTrack()
    }
  }

  return (
    <Flex
      borderTopWidth={1}
      py={1}
      accessibilityHint="Toggles the accordion"
      maxWidth={MAX_WIDTH_BIO}
      borderColor={color("mono100")}
    >
      <Touchable
        onPress={handleToggle}
        accessibilityRole="togglebutton"
        accessibilityLabel={label}
        accessibilityState={{ expanded }}
        hitSlop={{ top: 10, bottom: 10 }}
        testID="expandableAccordion"
      >
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text variant="sm" selectable={false}>
            {label}
          </Text>

          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotateAnimated.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["-90deg", "90deg"],
                  }),
                },
              ],
            }}
          >
            <ChevronSmallRightIcon fill="mono100" />
          </Animated.View>
        </Flex>
      </Touchable>

      <Collapse opened={!!expanded}>{children}</Collapse>
    </Flex>
  )
}
