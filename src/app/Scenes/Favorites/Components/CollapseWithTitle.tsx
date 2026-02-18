import { ChevronSmallDownIcon } from "@artsy/icons/native"
import { Collapse, Flex, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { MotiView } from "moti"
import { useState } from "react"
import { LayoutAnimation } from "react-native"

const ICON_SIZE = 18

export const CollapseWithTitle: React.FC<React.PropsWithChildren<{ title: string }>> = ({
  children,
  title,
}) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <Flex px={2}>
      <Touchable
        accessibilityRole="button"
        onPress={() => {
          // Animate the height of the content
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          setExpanded(!expanded)
        }}
      >
        <Flex flexDirection="row" alignItems="center" gap={0.5}>
          <Text variant="sm" fontWeight="bold">
            {title}
          </Text>

          <MotiView
            animate={{ rotateX: !!expanded ? "180deg" : "0deg" }}
            transition={{ type: "timing" }}
            style={{
              // This is required to remove some empty pixels from the arrow icon
              marginTop: 2,
            }}
          >
            <ChevronSmallDownIcon height={ICON_SIZE} width={ICON_SIZE} fill="mono100" />
          </MotiView>
        </Flex>
      </Touchable>

      <Spacer y={2} />

      <Collapse opened={expanded}>{children}</Collapse>
    </Flex>
  )
}
