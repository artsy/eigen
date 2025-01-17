import { SimpleMessage, Flex } from "@artsy/palette-mobile"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { goBack } from "app/system/navigation/navigate"

export const BrowseSimilarWorksErrorState: React.FC = () => {
  return (
    <Flex flex={1}>
      <NavigationHeader onLeftButtonPress={goBack}>Works by -</NavigationHeader>
      <Flex mx={2} mt={2}>
        <SimpleMessage>Could not load artwork</SimpleMessage>
      </Flex>
    </Flex>
  )
}
