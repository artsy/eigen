import { navigate, switchTab } from "app/navigation/navigate"
import { Button, Flex, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { HomeFeedOnboardingRailItemProps } from "./HomeFeedOnboardingRail"

const CARD_BORDER_RADIUS = 4
const CARD_WIDTH = 295

export const HomeFeedOnboardingCard: React.FC<{ item: HomeFeedOnboardingRailItemProps }> = ({
  item,
}) => {
  return (
    <Flex width={CARD_WIDTH} testID="my-collection-hf-onboadring-card">
      <Image
        width={CARD_WIDTH}
        source={item.image}
        borderTopLeftRadius={CARD_BORDER_RADIUS}
        borderTopRightRadius={CARD_BORDER_RADIUS}
      />
      <Flex
        p={2}
        backgroundColor="black100"
        borderBottomLeftRadius={CARD_BORDER_RADIUS}
        borderBottomRightRadius={CARD_BORDER_RADIUS}
      >
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
