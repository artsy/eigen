import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import {
  AddIcon,
  Box,
  Button,
  Flex,
  HeartIcon,
  InstitutionIcon,
  Join,
  LinkText,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
  TrendingIcon,
} from "@artsy/palette-mobile"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { AutoHeightInfoModal } from "app/Components/Buttons/InfoButton"
import { ProgressiveOnboardingOfferSettings } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingOfferSettings"
import { ProgressiveOnboardingSignalInterest } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingSignalInterest"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useState } from "react"
import { useTracking } from "react-tracking"

const PARTNER_OFFER_HELP_ARTICLE_URL = "https://support.artsy.net/s/article/Offers-on-saved-works"

export const SavesTabHeader = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const { setCreateNewArtworkListViewVisible, setOfferSettingsViewVisible } =
    ArtworkListsStore.useStoreActions((actions) => ({
      setCreateNewArtworkListViewVisible: actions.setCreateNewArtworkListViewVisible,
      setOfferSettingsViewVisible: actions.setOfferSettingsViewVisible,
    }))
  const isArtworkListOfferabilityEnabled = useFeatureFlag("AREnableArtworkListOfferability")
  const tracking = useTracking()

  const handleCreateList = () => {
    setCreateNewArtworkListViewVisible(true)
  }

  const handleOfferSettings = () => {
    setOfferSettingsViewVisible(true)
  }

  return (
    <Box>
      <ProgressiveOnboardingSignalInterest>
        <Text variant="xs" color="mono60">
          Curate your own lists of the works you love and{" "}
          <LinkText
            variant="xs"
            color="mono60"
            onPress={() => {
              tracking.trackEvent(tracks.tapFollowsInfo())
              setModalVisible(true)
            }}
          >
            signal your interest to galleries
          </LinkText>
          .
        </Text>
      </ProgressiveOnboardingSignalInterest>

      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" my={2}>
        {!!isArtworkListOfferabilityEnabled && (
          <ProgressiveOnboardingOfferSettings>
            <Button haptic variant="text" size="small" onPress={handleOfferSettings}>
              Offer Settings
            </Button>
          </ProgressiveOnboardingOfferSettings>
        )}

        <Button
          haptic
          variant="text"
          size="small"
          onPress={handleCreateList}
          icon={<AddIcon />}
          ml={-1}
        >
          Create New List
        </Button>
      </Flex>

      <AutoHeightInfoModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        modalTitle="Saves"
        modalContent={
          <Join separator={<Spacer y={2} />}>
            <Flex flexDirection="row" alignItems="flex-start">
              <HeartIcon mr={0.5} />
              <Flex flex={1}>
                <Text variant="sm-display">Curate your own list of works you love.</Text>
              </Flex>
            </Flex>
            <Flex flexDirection="row" alignItems="flex-start">
              <TrendingIcon mr={0.5} />
              <Flex flex={1}>
                <Text variant="sm-display">Get better recommendations with every Save.</Text>
              </Flex>
            </Flex>
            <Flex flexDirection="row" alignItems="flex-start">
              <InstitutionIcon mr={0.5} />
              <Flex flex={1}>
                <Text variant="sm-display">
                  Signal your interest to galleries and you could receive an offer on your saved
                  artwork from a gallery.{" "}
                  <LinkText
                    onPress={() => {
                      tracking.trackEvent(tracks.tapReadMore())
                      navigate(PARTNER_OFFER_HELP_ARTICLE_URL)
                    }}
                  >
                    Read more
                  </LinkText>
                  .
                </Text>
              </Flex>
            </Flex>
          </Join>
        }
      />
    </Box>
  )
}

export const SavesTabHeaderPlaceholder = () => {
  const isArtworkListOfferabilityEnabled = useFeatureFlag("AREnableArtworkListOfferability")

  return (
    <Skeleton>
      <SkeletonText variant="xs">
        Curate your own lists of the works you love and signal
      </SkeletonText>
      <SkeletonText variant="xs" mt={0.5}>
        your interest to galleries
      </SkeletonText>
      <Flex flexDirection="row" justifyContent="space-between">
        <SkeletonBox my={2} height={30} width="45%" />

        {!!isArtworkListOfferabilityEnabled && <SkeletonBox my={2} height={30} width="45%" />}
      </Flex>
    </Skeleton>
  )
}

const tracks = {
  tapFollowsInfo: () => ({
    action: ActionType.tappedLink,
    context_module: ContextModule.saves,
    context_screen_owner_type: OwnerType.saves,
    type: "link",
    subject: "signalYourInterestToGalleries",
  }),
  tapReadMore: () => ({
    action: ActionType.tappedLink,
    context_module: ContextModule.saves,
    context_screen_owner_type: OwnerType.savesInfoModal,
    type: "link",
  }),
}
