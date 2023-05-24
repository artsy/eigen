import {
  ArrowLeftIcon,
  DEFAULT_HIT_SLOP,
  NAVBAR_HEIGHT,
  ZINDEX,
  Flex,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { TabsContext } from "app/Components/Tabs/TabsContext"
import { isTablet } from "react-native-device-info"
import Animated, { Easing, FadeInLeft, FadeOut } from "react-native-reanimated"

export interface HeaderProps {
  animated?: boolean
  hideLeftElements?: boolean
  hideRightElements?: boolean
  leftElements?: React.ReactNode
  onBack?: () => void
  rightElements?: React.ReactNode
  scrollY?: number
  title?: string
  titleShown?: boolean
}

export const AnimatedTabsHeader: React.FC<HeaderProps> = (props) => {
  const scrollY = TabsContext.useStoreState((state) => state.currentScrollY)

  return <Header scrollY={scrollY} animated={true} {...props} />
}

export const Header: React.FC<HeaderProps> = ({
  animated = false,
  scrollY = 0,
  hideLeftElements,
  hideRightElements,
  leftElements,
  onBack,
  rightElements,
  title,
}) => {
  const navigation = useNavigation()
  // TODO: Remove this once we figure out if we need it or not
  const isSelectModeActive = false

  const Left = () => {
    if (hideLeftElements) {
      return null
    }

    return (
      <>
        {leftElements ? (
          <>{leftElements}</>
        ) : (
          // If no left elements passed, show back button
          <Touchable
            onPress={onBack ?? navigation.goBack}
            underlayColor="transparent"
            hitSlop={DEFAULT_HIT_SLOP}
          >
            <ArrowLeftIcon fill="onBackgroundHigh" top="2px" />
          </Touchable>
        )}

        <Spacer x={1} />
      </>
    )
  }

  const Center = () => {
    if (isSelectModeActive) {
      return null
    }

    if (!animated) {
      return (
        <Flex width={isTablet() ? "100%" : "70%"} flex={1}>
          <Text variant="md" numberOfLines={1}>
            {title}
          </Text>
        </Flex>
      )
    }

    if (scrollY < NAVBAR_HEIGHT) {
      return <Flex flex={1} flexDirection="row" />
    }

    return (
      <>
        <Animated.View
          entering={FadeInLeft.duration(400).easing(Easing.out(Easing.exp))}
          exiting={FadeOut.duration(400).easing(Easing.out(Easing.exp))}
          style={{
            flex: 1,
          }}
        >
          <Flex width={isTablet() ? "100%" : "70%"}>
            <Text variant="md" numberOfLines={1}>
              {title}
            </Text>
          </Flex>
        </Animated.View>
      </>
    )
  }

  const Right = () => {
    if (hideRightElements) {
      return null
    }

    return (
      <>
        <Spacer x={1} />

        {rightElements}
      </>
    )
  }

  return (
    <Flex
      height={NAVBAR_HEIGHT}
      flexDirection="row"
      px={2}
      py={1}
      zIndex={ZINDEX.header}
      backgroundColor="background"
      alignItems="center"
    >
      <Left />
      <Center />
      <Right />
    </Flex>
  )
}
