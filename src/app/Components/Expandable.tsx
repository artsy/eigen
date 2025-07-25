import { ChevronSmallRightIcon } from "@artsy/icons/native"
import { Collapse, Flex, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { MAX_WIDTH_BIO } from "app/Components/Artist/Biography"
import { MotiView } from "moti"
import { useState } from "react"

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
        onPress={() => handleToggle()}
        accessibilityRole="togglebutton"
        accessibilityLabel={label}
        accessibilityState={{ expanded }}
        hitSlop={{ top: 10, bottom: 10 }}
        testID="expandableAccordion"
      >
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text variant="sm">{label}</Text>

          <MotiView
            animate={{ transform: [{ rotate: !!expanded ? "-90deg" : "90deg" }] }}
            style={{ transform: [{ rotate: !!expanded ? "-90deg" : "90deg" }] }}
            transition={{ type: "timing" }}
          >
            <ChevronSmallRightIcon fill="mono100" />
          </MotiView>
        </Flex>
      </Touchable>

      <Collapse opened={!!expanded}>{children}</Collapse>
    </Flex>
  )
}
