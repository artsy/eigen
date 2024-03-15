import { OwnerType } from "@artsy/cohesion"
import {
  Flex,
  FullWidthIcon,
  GridIcon,
  NAVBAR_HEIGHT,
  Screen,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
} from "@artsy/palette-mobile"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { NewWorksForYouArtworksQR } from "app/Scenes/NewWorksForYou/Components/NewWorksForYouArtworks"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
import { MotiPressable } from "moti/interactions"
import { useEffect, useState } from "react"
import { LayoutAnimation } from "react-native"
import { isTablet } from "react-native-device-info"

export const SCREEN_TITLE = "New Works for You"
export const PAGE_SIZE = 100
export const RECOMMENDATION_MODEL_EXPERIMENT_NAME = "eigen-new-works-for-you-recommendations-model"
export const DEFAULT_RECS_MODEL_VERSION = "C"

export interface NewWorksForYouScreenProps {
  maxWorksPerArtist: number
  version: string
}

interface NewWorksForYouQueryRendererProps {
  utm_medium?: string
  maxWorksPerArtist?: number
  version?: string
}
const ICON_SIZE = 26

export const NewWorksForYouQueryRenderer: React.FC<NewWorksForYouQueryRendererProps> = ({
  utm_medium,
  maxWorksPerArtist = 3,
  version: versionProp,
}) => {
  const isReferredFromEmail = utm_medium === "email"

  // Use the version specified in the URL or no version if the screen is opened from the email.
  const version =
    isReferredFromEmail && versionProp ? versionProp?.toUpperCase() : DEFAULT_RECS_MODEL_VERSION

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.newWorksForYou })}
    >
      <Screen>
        <Header />
        <Screen.Body fullwidth>
          <NewWorksForYouArtworksQR maxWorksPerArtist={maxWorksPerArtist} version={version} />
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const Header = () => {
  const [hideTitle, setHideTitle] = useState(false)
  const { currentScrollY } = Screen.useScreenScrollContext()

  // Reveal the title again after scroll down
  useEffect(() => {
    if (hideTitle) {
      if (currentScrollY >= NAVBAR_HEIGHT) {
        setHideTitle(false)
      }
    }
  }, [currentScrollY])

  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)

  const setDefaultViewOption = GlobalStore.actions.userPrefs.setDefaultViewOption

  const showToggleViewOptionIcon = !isTablet()

  return (
    <Screen.AnimatedHeader
      onBack={goBack}
      title={hideTitle ? "" : "New Works For You"}
      rightElements={
        showToggleViewOptionIcon ? (
          <MotiPressable
            onPress={() => {
              setHideTitle(true)
              setDefaultViewOption(defaultViewOption === "list" ? "grid" : "list")
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            }}
          >
            {defaultViewOption === "grid" ? (
              <FullWidthIcon height={ICON_SIZE} width={ICON_SIZE} top="2px" />
            ) : (
              <GridIcon height={ICON_SIZE} width={ICON_SIZE} top="2px" />
            )}
          </MotiPressable>
        ) : undefined
      }
    />
  )
}

export const NewWorksForYouPlaceholder: React.FC<{}> = ({}) => {
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)

  return (
    <>
      <Flex flexDirection="row">
        <Flex px={2}>
          <Flex justifyContent="space-between">
            <Skeleton>
              <SkeletonText variant="lg-display">New Works for You</SkeletonText>
              <SkeletonText variant="xs" mt={2}>
                XX Artworks
              </SkeletonText>
            </Skeleton>
          </Flex>
        </Flex>
      </Flex>
      <Skeleton>
        <Spacer y={2} />
        {defaultViewOption === "grid" ? (
          <PlaceholderGrid />
        ) : (
          <Flex width="100%" px={2}>
            {times(4).map((i) => (
              <Flex key={i} mt={1} mb={2}>
                <Flex>
                  <SkeletonBox key={i} width="100%" height={400} />
                </Flex>
                <Spacer y={1} />
                <SkeletonText>David Hockey</SkeletonText>
                <Spacer y={0.5} />
                <SkeletonText>Mercy from the Virtues H9-13 </SkeletonText>
                <Spacer y={0.5} />
                <SkeletonText>Berg Contemporary</SkeletonText>
                <Spacer y={0.5} />
                <SkeletonText>£38,000</SkeletonText>
              </Flex>
            ))}
          </Flex>
        )}
      </Skeleton>
    </>
  )
}
