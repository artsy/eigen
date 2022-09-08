import {
  ActionType,
  OwnerType,
  SearchedReverseImageWithNoResults,
  SearchedReverseImageWithResults,
} from "@artsy/cohesion"
import { StackScreenProps } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { navigate } from "app/navigation/navigate"
import { useImageSearch } from "app/utils/useImageSearch"
import { compact } from "lodash"
import { BackButton, Flex } from "palette"
import { useEffect } from "react"
import { Alert, Image, StyleSheet } from "react-native"
import { useTracking } from "react-tracking"
import { Background } from "../../Components/Background"
import { CameraFramesContainer } from "../../Components/CameraFramesContainer"
import { HeaderContainer } from "../../Components/HeaderContainer"
import { HeaderTitle } from "../../Components/HeaderTitle"
import { ReverseImageNavigationStack } from "../../types"
import { CAMERA_BUTTONS_HEIGHT } from "../Camera/Components/CameraButtons"

type Props = StackScreenProps<ReverseImageNavigationStack, "Preview">

export const ReverseImagePreviewScreen: React.FC<Props> = (props) => {
  const { navigation, route } = props
  const { photo, owner } = route.params
  const tracking = useTracking()
  const { handleSearchByImage } = useImageSearch()

  const handleGoBack = () => {
    navigation.goBack()
  }

  const handleSearch = async () => {
    try {
      const results = await handleSearchByImage(photo)

      if (results.length === 0) {
        const event: SearchedReverseImageWithNoResults = {
          action: ActionType.searchedReverseImageWithNoResults,
          context_screen_owner_type: OwnerType.reverseImageSearch,
          owner_type: owner.type,
          owner_id: owner.id,
          owner_slug: owner.slug,
        }

        tracking.trackEvent(event)
        return navigation.replace("ArtworkNotFound", {
          photoPath: photo.path,
        })
      }

      const event: SearchedReverseImageWithResults = {
        action: ActionType.searchedReverseImageWithResults,
        context_screen_owner_type: OwnerType.reverseImageSearch,
        owner_type: owner.type,
        owner_id: owner.id,
        owner_slug: owner.slug,
        total_matches_count: results.length,
        artwork_ids: results.join(","),
      }

      tracking.trackEvent(event)

      if (results.length === 1) {
        await navigate(`/artwork/${results[0]!.artwork!.internalID}`)
        return navigation.popToTop()
      }

      const artworkIDs = compact(results.map((result) => result?.artwork?.internalID))
      navigation.replace("MultipleResults", {
        owner,
        photoPath: photo.path,
        artworkIDs,
      })
    } catch (error) {
      console.error(error)
      if (__DEV__) {
        console.error(error)
      } else {
        captureMessage((error as Error).stack!)
      }

      Alert.alert(
        "Something went wrong.",
        "Sorry, we couldn't process the request. Please try again or contact support@artsy.net for help.",
        [
          {
            text: "Retry",
            onPress: () => {
              navigation.goBack()
            },
          },
        ]
      )
    }
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <Flex bg="black100" flex={1}>
      <Image
        source={{ uri: photo.path }}
        style={StyleSheet.absoluteFill}
        resizeMode={photo.fromLibrary ? "contain" : "cover"}
      />

      <Flex {...StyleSheet.absoluteFillObject}>
        <Background>
          <HeaderContainer>
            <BackButton color="white100" onPress={handleGoBack} />
            <HeaderTitle title="Looking for Results..." />
          </HeaderContainer>
        </Background>

        {!photo.fromLibrary && (
          <>
            <CameraFramesContainer />
            <Background height={CAMERA_BUTTONS_HEIGHT} />
          </>
        )}
      </Flex>
    </Flex>
  )
}
