import { Flex, Text } from "@artsy/palette-mobile"

export const CityGuideMetaData = ({ cityName }: { cityName: string }) => {
  return (
    <Flex backgroundColor="mono100" pb={2}>
      <Flex px={2} pt={2}>
        <Text variant="lg-display" color="mono0">
          {cityName}
        </Text>
      </Flex>
    </Flex>
  )
}
