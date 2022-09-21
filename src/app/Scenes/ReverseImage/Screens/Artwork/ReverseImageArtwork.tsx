import { StackScreenProps } from "@react-navigation/stack"
import { navigate } from "app/navigation/navigate"
import { BackButton, Button, Flex, Spacer, Text } from "palette"
import { HeaderContainer } from "../../Components/HeaderContainer"
import { HeaderTitle } from "../../Components/HeaderTitle"
import { ReverseImageNavigationStack } from "../../types"

type Props = StackScreenProps<ReverseImageNavigationStack, "Artwork">

export const ReverseImageArtworkScreen: React.FC<Props> = (props) => {
  const { navigation, route } = props
  const { id } = route.params

  const handleGoBack = () => {
    navigation.goBack()
  }

  const handleNavigateToArtwork = () => {
    navigate(`/artwork/${id}`)
  }

  return (
    <Flex bg="black100" flex={1}>
      <HeaderContainer>
        <BackButton color="white100" onPress={handleGoBack} />
        <HeaderTitle title="Artwork" />
      </HeaderContainer>

      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text color="white100">Artwork id: {id}</Text>
        <Spacer mt={2} />
        <Button variant="fillGray" onPress={handleNavigateToArtwork}>
          Go to full screen
        </Button>
      </Flex>
    </Flex>
  )
}
