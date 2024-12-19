import {
  ArtworkIcon,
  CertificateIcon,
  EnvelopeIcon,
  Flex,
  FlexProps,
  LinkText,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
  TextProps,
  useSpace,
} from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { InfiniteDiscoveryAboutTheWorkTab_artwork$key } from "__generated__/InfiniteDiscoveryAboutTheWorkTab_artwork.graphql"
import { InfiniteDiscoveryBottomSheetTabsQuery } from "__generated__/InfiniteDiscoveryBottomSheetTabsQuery.graphql"
import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { useSendInquiry_me$key } from "__generated__/useSendInquiry_me.graphql"
import { ArtistListItemShort } from "app/Components/ArtistListItemShort"
import { Divider } from "app/Components/Bidding/Components/Divider"
import { PartnerListItemShort } from "app/Components/PartnerListItemShort"
import { dimensionsPresent } from "app/Scenes/Artwork/Components/ArtworkDimensionsClassificationAndAuthenticity/ArtworkDimensionsClassificationAndAuthenticity"
import { ContactGalleryButton } from "app/Scenes/Artwork/Components/CommercialButtons/ContactGalleryButton"
import { aboutTheWorkQuery } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet"
import { navigate } from "app/system/navigation/navigate"
import { FC } from "react"
import { graphql, PreloadedQuery, useFragment, usePreloadedQuery } from "react-relay"

interface AboutTheWorkTabProps {
  artwork: InfiniteDiscoveryAboutTheWorkTab_artwork$key
  me: MyProfileEditModal_me$key & useSendInquiry_me$key
}

// TODO: export TAB_BAR_HEIGHT from palette-mobile
export const AboutTheWorkTab: FC<AboutTheWorkTabProps> = ({ artwork, me }) => {
  const data = useFragment(fragment, artwork)
  const space = useSpace()

  if (!data) {
    return null
  }

  const attributionClass = data.attributionClass?.shortArrayDescription
  const hasCertificateOfAuthenticity = data.hasCertificateOfAuthenticity && !data.isBiddable

  return (
    <BottomSheetScrollView>
      <Flex flex={1} px={2} style={{ paddingTop: 50 + space(2) }} gap={2}>
        <Flex gap={1}>
          {!!attributionClass?.length && (
            <Flex flexDirection="row" gap={0.5} alignItems="center">
              <ArtworkIcon height={18} width={18} fill="black60" />
              <Text variant="xs">
                {attributionClass[0]}{" "}
                <LinkText variant="xs" onPress={() => navigate(`/artwork-classifications`)}>
                  {attributionClass[1]}
                </LinkText>
              </Text>
            </Flex>
          )}

          {!!hasCertificateOfAuthenticity && (
            <Flex flexDirection="row" gap={0.5} alignItems="center">
              <CertificateIcon height={18} width={18} fill="black60" testID="certificate-icon" />
              <Text variant="xs">
                Includes a{" "}
                <LinkText
                  variant="xs"
                  onPress={() => navigate(`/artwork-certificate-of-authenticity`)}
                >
                  Certificate of Authenticity
                </LinkText>
              </Text>
            </Flex>
          )}
        </Flex>

        {!!attributionClass?.length && !!hasCertificateOfAuthenticity && <Divider />}

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

              return <ArtistListItemShort key={`artist-${index}`} artist={artist} />
            })}
          </Flex>
        </Flex>

        <Divider />

        <Flex gap={1}>
          <Text variant="sm-display">Gallery</Text>

          <PartnerListItemShort partner={data.partner} />
          <Flex
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text variant="xs" color="black60">
              Questions about this piece?
            </Text>
            <ContactGalleryButton
              artwork={data}
              me={me}
              variant="outlineGray"
              size="small"
              icon={<EnvelopeIcon fill="black100" width={16} height={16} />}
            />
          </Flex>
        </Flex>
      </Flex>

      <Spacer y={12} />
      <Spacer y={6} />
    </BottomSheetScrollView>
  )
}

const fragment = graphql`
  fragment InfiniteDiscoveryAboutTheWorkTab_artwork on Artwork {
    ...ContactGalleryButton_artwork

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
      ...ArtistListItemShort_artist
    }

    partner(shallow: true) @required(action: NONE) {
      ...PartnerListItemShort_partner
    }
  }
`

interface InfiniteDiscoveryAboutTheWorkTabProps {
  queryRef: PreloadedQuery<InfiniteDiscoveryBottomSheetTabsQuery>
}

export const InfiniteDiscoveryAboutTheWorkTab: FC<InfiniteDiscoveryAboutTheWorkTabProps> = ({
  queryRef,
}) => {
  const data = usePreloadedQuery(aboutTheWorkQuery, queryRef)

  if (!data?.artwork || !data?.me) {
    return <InfiniteDiscoveryAboutTheWorkTabSkeleton />
  }

  return <AboutTheWorkTab artwork={data.artwork} me={data.me} />
}

export const InfiniteDiscoveryAboutTheWorkTabSkeleton: FC = () => {
  const space = useSpace()

  return (
    <BottomSheetScrollView scrollEnabled={false}>
      <Skeleton>
        <Flex gap={2} px={2} flex={1} style={{ paddingTop: 50 + space(2) }}>
          <Flex gap={1}>
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
  color: "black60",
} satisfies TextProps | FlexProps

const valueStyle = {
  width: "65%",
  variant: "xs",
} satisfies TextProps | FlexProps
