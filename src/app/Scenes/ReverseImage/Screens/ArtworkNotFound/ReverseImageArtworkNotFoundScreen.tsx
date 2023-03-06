import { Flex, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { HeaderBackButton } from "app/Scenes/ReverseImage/Components/HeaderBackButton"
import { HeaderContainer } from "app/Scenes/ReverseImage/Components/HeaderContainer"
import { HeaderTitle } from "app/Scenes/ReverseImage/Components/HeaderTitle"
import { ReverseImageNavigationStack } from "app/Scenes/ReverseImage/types"
import { Button } from "palette"
import { Image } from "react-native"

type Props = StackScreenProps<ReverseImageNavigationStack, "ArtworkNotFound">

export const ReverseImageArtworkNotFoundScreen: React.FC<Props> = (props) => {
  const { navigation, route } = props

  const handleGoBack = () => {
    navigation.goBack()
  }

  return (
    <Flex flex={1} bg="black100">
      <HeaderContainer>
        <HeaderBackButton onPress={handleGoBack} />
        <HeaderTitle title="Artwork Not Found" />
      </HeaderContainer>

      <Flex flex={1} m={2} justifyContent="center" alignItems="center">
        <Flex my={2}>
          <Image
            source={{ uri: route.params.photoPath }}
            style={{ height: "100%", aspectRatio: 1, resizeMode: "contain" }}
          />
        </Flex>

        <Text color="white100" variant="xs" textAlign="center">
          We couldn’t find an artwork based on your photo.{"\n"}
          Please try again, or use the fair’s QR code.
        </Text>
      </Flex>

      <Flex m={2} mt={4}>
        <Button variant="fillLight" block onPress={handleGoBack}>
          Camera
        </Button>
      </Flex>
    </Flex>
  )
}
