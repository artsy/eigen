import { Flex, useTheme, Text } from "@artsy/palette-mobile"
import { FadeInLeft } from "app/utils/animations/FadeInLeft"
import { ReactNode, useEffect } from "react"
import { View } from "react-native"
import { useAnimatableHeaderContext } from "./AnimatableHeaderContext"

export interface AnimatableCustomHeaderProps {
  title?: string
  rightButton?: ReactNode
}

export const AnimatableCustomHeader = (props: AnimatableCustomHeaderProps) => {
  const { title = "", rightButton } = props
  const { space } = useTheme()
  const { headerHeight, setTitle } = useAnimatableHeaderContext()

  useEffect(() => {
    setTitle(title)
  }, [title])

  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: space(2),
        alignItems: "center",
        height: headerHeight,
        backgroundColor: "white",
      }}
    >
      {!!title && (
        <Flex
          flex={1}
          height={headerHeight}
          justifyContent="center"
          ml={`${space(0.5) + space(1)}px`}
        >
          <FadeInLeft show={false}>
            <Text testID="animated-header-title" variant="sm" numberOfLines={2}>
              {title}
            </Text>
          </FadeInLeft>
        </Flex>
      )}

      {rightButton}
    </View>
  )
}
