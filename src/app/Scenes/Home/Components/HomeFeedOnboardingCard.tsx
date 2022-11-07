import { navigate, switchTab } from "app/navigation/navigate"
import { Button, Flex, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { HomeFeedOnboardingRailItemProps } from "./HomeFeedOnboardingRail"

export const HomeFeedOnboardingCard: React.FC<{ item: HomeFeedOnboardingRailItemProps }> = ({
  item,
}) => {
  if (!item.shouldShow) {
    return <></>
  }
  return (
    <Flex width={295}>
      <Image source={item.image} borderTopLeftRadius={4} borderTopRightRadius={4} />
      <Flex p={2} backgroundColor="black100" borderBottomLeftRadius={4} borderBottomRightRadius={4}>
        <Text variant="md" mb={0.5} color="white100">
          {item.title}
        </Text>
        <Text variant="xs" mb={2} color="white100">
          {item.subtitle}
        </Text>
        <Button
          size="small"
          variant="fillLight"
          onPress={() => {
            switch (item.type) {
              case "MyC":
                return navigate("/") // TODO: navigate the the full screen carousel
              case "SWA":
                return switchTab("sell")
            }
          }}
        >
          {item.button}
        </Button>
      </Flex>
    </Flex>
  )
}
