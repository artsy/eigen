import { SimpleMessage, Flex } from "@artsy/palette-mobile"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack } from "app/system/navigation/navigate"

export const BrowseSimilarWorksErrorState: React.FC = () => {
  return (
    <Flex flex={1}>
      <FancyModalHeader onLeftButtonPress={goBack}>Works by -</FancyModalHeader>
      <Flex mx={2} mt={2}>
        <SimpleMessage>Could not load artwork</SimpleMessage>
      </Flex>
    </Flex>
  )
}
