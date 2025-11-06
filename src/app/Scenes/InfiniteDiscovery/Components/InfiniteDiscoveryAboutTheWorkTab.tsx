import { ContextModule, OwnerType } from "@artsy/cohesion"
import { ArtworkIcon, CertificateIcon, EnvelopeIcon } from "@artsy/icons/native"
import {
  Flex,
  FlexProps,
  LinkText,
  SimpleMessage,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Tabs,
  Text,
  TextProps,
} from "@artsy/palette-mobile"
import { BottomSheetScrollView, useBottomSheet } from "@gorhom/bottom-sheet"
import { InfiniteDiscoveryAboutTheWorkTabQuery } from "__generated__/InfiniteDiscoveryAboutTheWorkTabQuery.graphql"
import { InfiniteDiscoveryAboutTheWorkTab_artwork$key } from "__generated__/InfiniteDiscoveryAboutTheWorkTab_artwork.graphql"
import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { useSendInquiry_me$key } from "__generated__/useSendInquiry_me.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { Divider } from "app/Components/Bidding/Components/Divider"
import { PartnerListItemShort } from "app/Components/PartnerListItemShort"
import { dimensionsPresent } from "app/Scenes/Artwork/Components/ArtworkDimensionsClassificationAndAuthenticity/ArtworkDimensionsClassificationAndAuthenticity"
import { ContactGalleryButton } from "app/Scenes/Artwork/Components/CommercialButtons/ContactGalleryButton"
import { InfiniteDiscoveryCollectorSignal } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryCollectorSignal"
import { useSetArtworkAsRecentlyViewed } from "app/Scenes/InfiniteDiscovery/hooks/useSetArtworkAsRecentlyViewed"
import { AnalyticsContextProvider } from "app/system/analytics/AnalyticsContext"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Sentinel } from "app/utils/Sentinel"
import { useCollectorSignal } from "app/utils/artwork/useCollectorSignal"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { FC } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface AboutTheWorkTabProps {
  artwork: InfiniteDiscoveryAboutTheWorkTab_artwork$key
  me: MyProfileEditModal_me$key & useSendInquiry_me$key
}

// TODO: export TAB_BAR_HEIGHT from palette-mobile
export const AboutTheWorkTab: FC<AboutTheWorkTabProps> = ({ artwork, me }) => {
  const data = useFragment(fragment, artwork)
  const { collapse } = useBottomSheet()
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

  const handleCollapse = () => {
    collapse()
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
          <Spacer y={4} />
          <Flex gap={1} pt={1}>
            <InfiniteDiscoveryCollectorSignal artwork={data} />

            {!!attributionClass?.length && (
              <Sentinel onChange={handleOnVisible}>
                <Flex flexDirection="row" gap={0.5} alignItems="center" testID="attribution">
                  <ArtworkIcon height={18} width={18} fill="mono60" />
                  {!!attributionClass[0] && <Text variant="xs">{attributionClass[0]}</Text>}
                  <RouterLink
                    to="/artwork-classifications"
                    hasChildTouchable
                    onPress={handleCollapse}
                  >
                    <LinkText variant="xs">{attributionClass[1]}</LinkText>
                  </RouterLink>
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
                <CertificateIcon height={18} width={18} fill="mono60" testID="certificate-icon" />
                <Flex flexDirection="row">
                  <Text variant="xs">Includes a </Text>
                  <RouterLink
                    to="/artwork-certificate-of-authenticity"
                    hasChildTouchable
                    onPress={handleCollapse}
                  >
                    <LinkText variant="xs">Certificate of Authenticity</LinkText>
                  </RouterLink>
                </Flex>
              </Flex>
            )}
          </Flex>

          {(!!attributionClass?.length ||
            !!hasCertificateOfAuthenticity ||
            !!hasCollectorSignal) && <Divider />}

          <Flex gap={1}>
            <Flex flexDirection="row">
              <Text {...labelStyle}>Materials</Text>
              <Text {...valueStyle}>{data.medium}</Text>
            </Flex>

            {dimensionsPresent(data.dimensions) && (
              <Flex flexDirection="row">
                <Text {...labelStyle}>Dimensions</Text>
                <Text {...valueStyle}>{`${data.dimensions?.in} | ${data.dimensions?.cm}`}</Text>
              </Flex>
            )}

            <Flex flexDirection="row">
              <Text {...labelStyle}>Rarity</Text>
              <Text {...valueStyle}>{data.attributionClass?.name}</Text>
            </Flex>

            {!!data.mediumType?.name && (
              <Flex flexDirection="row" width="100%">
                <Text {...labelStyle}>Medium</Text>
                <Text {...valueStyle}>{data.mediumType?.name}</Text>
              </Flex>
            )}

            {!!data.condition?.displayText && (
              <Flex flexDirection="row">
                <Text {...labelStyle}>Condition</Text>
                <Text {...valueStyle}>{data.condition.displayText}</Text>
              </Flex>
            )}

            {!!data.signatureInfo?.details && (
              <Flex flexDirection="row">
                <Text {...labelStyle}>Signature</Text>
                <Text {...valueStyle}>{data.signatureInfo.details}</Text>
              </Flex>
            )}

            {!!data.certificateOfAuthenticity?.details && (
              <Flex flexDirection="row">
                <Text {...labelStyle}>Certificate of Authenticity</Text>
                <Text {...valueStyle}>{data.certificateOfAuthenticity.details}</Text>
              </Flex>
            )}

            {!!data.publisher && (
              <Flex flexDirection="row">
                <Text {...labelStyle}>Publisher</Text>
                <Text {...valueStyle}>{data.publisher}</Text>
              </Flex>
            )}

            <Flex flexDirection="row">
              <Text {...labelStyle}>Frame</Text>
              <Text {...valueStyle}>{data.isFramed ? "Frame included" : "Frame not included"}</Text>
            </Flex>
          </Flex>

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
                    onPress={() => handleCollapse()}
                  />
                )
              })}
            </Flex>
          </Flex>

          <Divider />

          <Flex gap={1}>
            <Text variant="sm-display">Gallery</Text>

            <PartnerListItemShort
              disabledLocation
              partner={data.partner}
              onPress={() => handleCollapse()}
            />
            <Flex
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text variant="xs" color="mono60">
                Questions about this piece?
              </Text>

              <Flex>
                <ContactGalleryButton
                  artwork={data}
                  me={me}
                  variant="outlineGray"
                  size="small"
                  icon={<EnvelopeIcon fill="mono100" width={16} height={16} />}
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Spacer y={12} />
        <Spacer y={6} />
      </AnalyticsContextProvider>
    </BottomSheetScrollView>
  )
}

const fragment = graphql`
  fragment InfiniteDiscoveryAboutTheWorkTab_artwork on Artwork {
    ...ContactGalleryButton_artwork
    ...useCollectorSignal_artwork

    internalID @required(action: NONE)
    slug

    attributionClass {
      shortArrayDescription
    }
    hasCertificateOfAuthenticity
    isBiddable

    medium
    dimensions {
      in
      cm
    }
    attributionClass {
      name
    }
    mediumType {
      name
    }
    condition {
      description
      displayText
      value
    }
    signatureInfo {
      details
    }
    certificateOfAuthenticity {
      details
    }
    publisher
    isFramed

    artists(shallow: true) @required(action: NONE) {
      ...ArtistListItem_artist
    }

    partner(shallow: true) @required(action: NONE) {
      ...PartnerListItemShort_partner
    }
  }
`

interface InfiniteDiscoveryAboutTheWorkTabProps {
  artworkID: string
}

const infiniteDiscoveryAboutTheWorkQuery = graphql`
  query InfiniteDiscoveryAboutTheWorkTabQuery($id: String!) {
    artwork(id: $id) {
      ...InfiniteDiscoveryAboutTheWorkTab_artwork
    }
    me {
      ...useSendInquiry_me
      ...MyProfileEditModal_me
      ...BidButton_me
      ...InfiniteDiscoveryBottomSheetFooter_me
    }
  }
`

export const InfiniteDiscoveryAboutTheWorkTab: FC<InfiniteDiscoveryAboutTheWorkTabProps> =
  withSuspense({
    Component: ({ artworkID }) => {
      const data = useLazyLoadQuery<InfiniteDiscoveryAboutTheWorkTabQuery>(
        infiniteDiscoveryAboutTheWorkQuery,
        {
          id: artworkID,
        }
      )

      if (!data?.artwork || !data?.me) {
        return (
          <Tabs.ScrollView>
            {/* This should never be the case, but we'll handle it anyway */}
            <SimpleMessage m={2}>No details available.</SimpleMessage>
          </Tabs.ScrollView>
        )
      }

      return <AboutTheWorkTab artwork={data.artwork} me={data.me} />
    },
    LoadingFallback: () => <InfiniteDiscoveryAboutTheWorkTabSkeleton />,
    ErrorFallback: () => {
      return (
        <Tabs.ScrollView contentContainerStyle={{ marginTop: 20 }}>
          <SimpleMessage m={2}>Cannot load work details.</SimpleMessage>
        </Tabs.ScrollView>
      )
    },
  })

export const InfiniteDiscoveryAboutTheWorkTabSkeleton: FC = () => {
  return (
    <BottomSheetScrollView scrollEnabled={false}>
      <Skeleton>
        <Flex gap={2} px={2} flex={1}>
          <Spacer y={4} />
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
                <SkeletonText variant="xs">{label + "a".repeat(Math.random() * 10)}</SkeletonText>
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

            <SkeletonText variant="xs">{"Biogr ".repeat(20)}</SkeletonText>
          </Flex>
        </Flex>
      </Skeleton>
    </BottomSheetScrollView>
  )
}

const labelStyle = {
  width: "35%",
  variant: "xs",
  color: "mono60",
} satisfies TextProps | FlexProps

const valueStyle = {
  width: "65%",
  variant: "xs",
} satisfies TextProps | FlexProps
