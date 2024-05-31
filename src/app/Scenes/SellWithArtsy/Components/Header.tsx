import {
  ArrowRightIcon,
  Box,
  EntityHeader,
  Flex,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { Header_submission$key } from "__generated__/Header_submission.graphql"
import { useSubmitArtworkTracking } from "app/Scenes/SellWithArtsy/Hooks/useSubmitArtworkTracking"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { useScreenDimensions } from "app/utils/hooks"
import { Image } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

interface HeaderProps {
  submission?: Header_submission$key
}

export const Header: React.FC<HeaderProps> = (props) => {
  const { draft } = GlobalStore.useAppState((state) => state.artworkSubmission)
  const { width } = useScreenDimensions()

  const submission = useFragment(FRAGMENT, props.submission)

  const artist = submission?.artist

  const { trackTappedContinueSubmission } = useSubmitArtworkTracking()

  return (
    <Flex>
      <Image
        source={require("images/swa-landing-page-header.webp")}
        style={{ width: isTablet() ? "100%" : width, height: isTablet() ? 480 : 340 }}
        resizeMode={isTablet() ? "contain" : "cover"}
      />

      <Spacer y={2} />

      <Flex mx={2}>
        {!!draft && !!submission && (
          <Box mb={2}>
            <Touchable
              onPress={() => {
                trackTappedContinueSubmission(draft.currentStep)
                navigate(
                  `/sell/submissions/${draft.submissionID}/edit?initialStep=${draft.currentStep}`
                )
              }}
            >
              <Flex py={1} flexDirection="column">
                <Text variant="xs" mb={1}>
                  Continue submission:
                </Text>

                <EntityHeader
                  name={artist?.name || "Unknown artist"}
                  meta={submission?.title || "Untitled"}
                  imageUrl={artist?.imageUrl || ""}
                  RightButton={<ArrowRightIcon />}
                  backgroundColor="black5"
                  px={2}
                  py={1}
                  borderRadius={10}
                />

                <Flex alignSelf="center">
                  <ArrowRightIcon fill="white100" height={18} width={18} />
                </Flex>
              </Flex>
            </Touchable>
          </Box>
        )}

        <Text variant="xl" mb={1}>
          Sell art from your collection
        </Text>

        <Text variant="xs">
          With our global reach and art market expertise, our specialists will find the best sales
          option for your work.
        </Text>
      </Flex>
    </Flex>
  )
}

const FRAGMENT = graphql`
  fragment Header_submission on ConsignmentSubmission {
    title
    artist {
      name
      imageUrl
    }
  }
`
