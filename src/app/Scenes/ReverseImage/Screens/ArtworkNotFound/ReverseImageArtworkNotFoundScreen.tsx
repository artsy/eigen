import { goBack } from "app/navigation/navigate"
import { BackButton, Button, Flex, Text } from "palette"
import { Image } from "react-native"
import { HeaderContainer } from "../../Components/HeaderContainer"
import { HeaderTitle } from "../../Components/HeaderTitle"

interface Props {
  photoPath: string
}

export const ReverseImageArtworkNotFoundScreen: React.FC<Props> = (props) => {
  const { photoPath } = props

  const handleGoBack = () => {
    goBack()
  }

  return (
    <Flex flex={1} bg="black100">
      <HeaderContainer>
        <BackButton color="white100" onPress={handleGoBack} />
        <HeaderTitle title="Artwork Not Found" />
      </HeaderContainer>

      <Flex flex={1} m={2} justifyContent="center" alignItems="center">
        <Flex my={2}>
          <Image
            source={{ uri: photoPath }}
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
