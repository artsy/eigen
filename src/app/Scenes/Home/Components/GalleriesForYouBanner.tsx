import { ActionType, ContextModule, OwnerType, TappedShowGroup } from "@artsy/cohesion"
import { Flex, SpacingUnit, useScreenDimensions } from "@artsy/palette-mobile"
import { GalleriesForYouBannerQuery } from "__generated__/GalleriesForYouBannerQuery.graphql"
import { GalleriesForYouBanner_galleriesForYou$key } from "__generated__/GalleriesForYouBanner_galleriesForYou.graphql"
import { isPad } from "app/utils/hardware"
import { Location, useLocationOrIpAddress } from "app/utils/hooks/useLocationOrIpAddress"
import { PlaceholderBox } from "app/utils/placeholders"
import { Suspense } from "react"
import { Image } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

const IMAGE_ASPECT_RATIO = 0.74

interface GalleriesForYouBannerProps {
  location?: Location | null
  ipAddress?: string | null
  mb?: SpacingUnit
}

export const GalleriesForYouBanner: React.FC<GalleriesForYouBannerProps> = ({ location, mb }) => {
  const { width } = useScreenDimensions()
  const isTablet = isPad()
  // const tracking = useTracking()

  const queryVariables = location ? { near: `${location?.lat},${location.lng}` } : {}

  const queryData = useLazyLoadQuery<GalleriesForYouBannerQuery>(GalleriesQuery, queryVariables)

  const galleriesConnection = useFragment<GalleriesForYouBanner_galleriesForYou$key>(
    galleriesFragment,
    queryData?.galleriesForYou
  )

  if (!galleriesConnection?.totalCount) {
    return null
  }

  return (
    <Flex mb={mb}>
      <Image
        source={require("images/galleries_for_you.webp")}
        // style={{ width: isTablet ? "100%" : width }}
        resizeMode="contain"
      />
    </Flex>
  )
}

const GalleriesQuery = graphql`
  query GalleriesForYouBannerQuery($near: String) {
    galleriesForYou: partnersConnection(first: 10, type: GALLERY, near: $near) @optionalField {
      ...GalleriesForYouBanner_galleriesForYou
    }
  }
`

const galleriesFragment = graphql`
  fragment GalleriesForYouBanner_galleriesForYou on PartnerConnection {
    totalCount
  }
`

export const tracks = {
  tappedThumbnail: (showID?: string, gallerieslug?: string, index?: number): TappedShowGroup => ({
    action: ActionType.tappedShowGroup,
    context_module: ContextModule.galleriesForYouRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.show,
    destination_screen_owner_id: showID,
    destination_screen_owner_slug: gallerieslug,
    horizontal_slide_position: index,
    type: "thumbnail",
  }),
}

interface GalleriesForYouBannerContainerProps {
  mb?: SpacingUnit
}

export const GalleriesForYouBannerContainer: React.FC<GalleriesForYouBannerContainerProps> = (
  props
) => {
  const { location, ipAddress, isLoading } = useLocationOrIpAddress()

  if (isLoading) {
    return <GalleriesForYouBannerPlaceholder />
  }

  return (
    <Suspense fallback={<GalleriesForYouBannerPlaceholder />}>
      <GalleriesForYouBanner {...props} location={location} ipAddress={ipAddress} />
    </Suspense>
  )
}

const GalleriesForYouBannerPlaceholder: React.FC = () => {
  const { width } = useScreenDimensions()

  return <PlaceholderBox width={width} height={width / IMAGE_ASPECT_RATIO} />
}
