import { ContextModule, OwnerType } from "@artsy/cohesion"
import { ArtworkIcon, CertificateIcon } from "@artsy/icons/native"
import {
  Flex,
  SimpleMessage,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Tabs,
  Text,
} from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { NewUserOnboardingAboutTheWorkTabQuery } from "__generated__/NewUserOnboardingAboutTheWorkTabQuery.graphql"
import { NewUserOnboardingAboutTheWorkTab_artwork$key } from "__generated__/NewUserOnboardingAboutTheWorkTab_artwork.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { Divider } from "app/Components/Bidding/Components/Divider"
import { PartnerListItemShort } from "app/Components/PartnerListItemShort"
import { ACCESSIBLE_SMALL_ICON_SIZE } from "app/Components/constants"
import { ArtworkDetailSection } from "app/Scenes/InfiniteDiscovery/Components/ArtworkDetailSection"
import { InfiniteDiscoveryCollectorSignal } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryCollectorSignal"
import { useSetArtworkAsRecentlyViewed } from "app/Scenes/InfiniteDiscovery/hooks/useSetArtworkAsRecentlyViewed"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { Sentinel } from "app/utils/Sentinel"
import { useCollectorSignal } from "app/utils/artwork/useCollectorSignal"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { FC } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface AboutTheWorkTabProps {
  artwork: NewUserOnboardingAboutTheWorkTab_artwork$key
}

const AboutTheWorkTab: FC<AboutTheWorkTabProps> = ({ artwork }) => {
  const data = useFragment(fragment, artwork)
  const { setArtworkAsRecentlyViewed } = useSetArtworkAsRecentlyViewed(data?.internalID)
  const { signalTitle } = useCollectorSignal({ artwork: data })

  if (!data) {
    return null
  }

  const attributionClass = data.attributionClass?.shortArrayDescription
  const hasCertificateOfAuthenticity = data.hasCertificateOfAuthenticity && !data.isBiddable
  const hasCollectorSignal = !!signalTitle

  const handleOnVisible = (visible: boolean) => {
    if (visible) {
      setArtworkAsRecentlyViewed()
    }
  }

  return (
    <BottomSheetScrollView>
      <AnalyticsContextProvider
        contextModule={ContextModule.infiniteDiscoveryDrawer}
        contextScreenOwnerType={OwnerType.infiniteDiscoveryArtwork}
        contextScreenOwnerId={data.internalID}
        contextScreenOwnerSlug={data.slug}
      >
        <Flex flex={1} px={2} gap={2}>
          <Spacer y={1} />
          <Flex gap={1} pt={1}>
            <InfiniteDiscoveryCollectorSignal artwork={data} />

            {!!attributionClass?.length && (
              <Sentinel onChange={handleOnVisible}>
                <Flex flexDirection="row" gap={0.5} alignItems="center" testID="attribution">
                  <ArtworkIcon
                    height={ACCESSIBLE_SMALL_ICON_SIZE}
                    width={ACCESSIBLE_SMALL_ICON_SIZE}
                    fill="mono60"
                  />
                  {!!attributionClass[0] && <Text variant="xs">{attributionClass[0]}</Text>}
                  <Text variant="xs">{attributionClass[1]}</Text>
                </Flex>
              </Sentinel>
            )}

            {!!hasCertificateOfAuthenticity && (
              <Flex
                flexDirection="row"
                gap={0.5}
                alignItems="center"
                testID="authenticity-certificate"
              >
                <CertificateIcon
                  height={ACCESSIBLE_SMALL_ICON_SIZE}
                  width={ACCESSIBLE_SMALL_ICON_SIZE}
                  fill="mono60"
                  testID="certificate-icon"
                />
                <Flex flexDirection="row">
                  <Text variant="xs">Includes a </Text>
                  <Text variant="xs">Certificate of Authenticity</Text>
                </Flex>
              </Flex>
            )}
          </Flex>

          {(!!attributionClass?.length ||
            !!hasCertificateOfAuthenticity ||
            !!hasCollectorSignal) && <Divider />}

          <ArtworkDetailSection artwork={data} />

          <Divider />

          <Flex gap={1}>
            {!!data.artists?.length && (
              <Text variant="sm-display">Artist{data.artists.length > 1 ? `s` : ``}</Text>
            )}
            <Flex gap={2}>
              {data.artists?.map((artist, index) => {
                if (!artist) {
                  return null
                }

                return (
                  <ArtistListItemContainer
                    key={`artist-${index}`}
                    artist={artist}
                    disableNavigation
                    contextModule={ContextModule.infiniteDiscoveryDrawer}
                    contextScreenOwnerId={data.internalID}
                    contextScreenOwnerSlug={data.slug}
                  />
                )
              })}
            </Flex>
          </Flex>

          <Divider />

          <Flex gap={1}>
            <Text variant="sm-display">Gallery</Text>

            <PartnerListItemShort disabledLocation partner={data.partner} disableNavigation />
          </Flex>
        </Flex>

        <Spacer y={4} />
      </AnalyticsContextProvider>
    </BottomSheetScrollView>
  )
}

const fragment = graphql`
  fragment NewUserOnboardingAboutTheWorkTab_artwork on Artwork {
    ...useCollectorSignal_artwork
    ...ArtworkDetailSection_artwork

    internalID @required(action: NONE)
    slug

    attributionClass {
      shortArrayDescription
    }
    hasCertificateOfAuthenticity
    isBiddable

    artists(shallow: true) @required(action: NONE) {
      ...ArtistListItem_artist
    }

    partner(shallow: true) @required(action: NONE) {
      ...PartnerListItemShort_partner
    }
  }
`

interface NewUserOnboardingAboutTheWorkTabProps {
  artworkID: string
}

const newUserOnboardingAboutTheWorkQuery = graphql`
  query NewUserOnboardingAboutTheWorkTabQuery($id: String!) {
    artwork(id: $id) {
      ...NewUserOnboardingAboutTheWorkTab_artwork
    }
  }
`

export const NewUserOnboardingAboutTheWorkTab: FC<NewUserOnboardingAboutTheWorkTabProps> =
  withSuspense({
    Component: ({ artworkID }) => {
      const data = useLazyLoadQuery<NewUserOnboardingAboutTheWorkTabQuery>(
        newUserOnboardingAboutTheWorkQuery,
        {
          id: artworkID,
        }
      )

      if (!data?.artwork) {
        return (
          <Tabs.ScrollView>
            <SimpleMessage m={2}>No details available.</SimpleMessage>
          </Tabs.ScrollView>
        )
      }

      return <AboutTheWorkTab artwork={data.artwork} />
    },
    LoadingFallback: () => <NewUserOnboardingAboutTheWorkTabSkeleton />,
    ErrorFallback: () => {
      return (
        <Tabs.ScrollView contentContainerStyle={{ marginTop: 20 }}>
          <SimpleMessage m={2}>Cannot load work details.</SimpleMessage>
        </Tabs.ScrollView>
      )
    },
  })

const NewUserOnboardingAboutTheWorkTabSkeleton: FC = () => {
  return (
    <BottomSheetScrollView scrollEnabled={false}>
      <Skeleton>
        <Flex gap={2} px={2} flex={1}>
          <Spacer y={1} />
          <Flex gap={1} pt={1}>
            <Flex flexDirection="row" gap={0.5} alignItems="center">
              <SkeletonBox size={18} />
              <SkeletonText variant="xs">Classification</SkeletonText>
            </Flex>

            <Flex flexDirection="row" gap={0.5} alignItems="center">
              <SkeletonBox size={18} />
              <SkeletonText variant="xs">Authenticity</SkeletonText>
            </Flex>
          </Flex>

          <Divider />

          <Flex gap={1}>
            {[
              "Materials",
              "Dimensions",
              "Rarity",
              "Medium",
              "Condition",
              "Signature",
              "Certificate",
              "Publisher",
            ].map((label) => (
              <Flex key={label} flexDirection="row">
                <Flex width="35%">
                  <SkeletonText variant="xs">{label}</SkeletonText>
                </Flex>
                <SkeletonText variant="xs">{label}</SkeletonText>
              </Flex>
            ))}
          </Flex>

          <Divider />

          <Flex gap={1}>
            <SkeletonText variant="sm-display">Artist</SkeletonText>

            <Flex flexDirection="row" gap={2}>
              <SkeletonBox size={45} borderRadius={22.5} />
              <Flex flexDirection="row" justifyContent="space-between" flex={1}>
                <Flex>
                  <SkeletonText variant="sm">Artist Name</SkeletonText>
                  <SkeletonText variant="xs">birthdate</SkeletonText>
                </Flex>

                <SkeletonBox justifySelf="flex-end" height={30} width={90} borderRadius={25} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Skeleton>
    </BottomSheetScrollView>
  )
}
