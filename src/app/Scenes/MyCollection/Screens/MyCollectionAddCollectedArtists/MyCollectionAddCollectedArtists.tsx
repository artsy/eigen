import { Flex, Text } from "@artsy/palette-mobile"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"

export const MyCollectionAddCollectedArtists: React.FC<{}> = () => {
  return (
    <Flex flex={1}>
      <FancyModalHeader hideBottomDivider>
        <Text textAlign="center">Add Artists You Collect</Text>
      </FancyModalHeader>
      <Flex flex={1} px={2}></Flex>
    </Flex>
  )
}
