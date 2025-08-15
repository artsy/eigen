import { Flex, Image, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { FairHeader_fair$key } from "__generated__/FairHeader_fair.graphql"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"
import { FairTimingFragmentContainer as FairTiming } from "./FairTiming"
interface FairHeaderProps {
  fair: FairHeader_fair$key
}

export const FairHeader: FC<FairHeaderProps> = ({ fair }) => {
  const data = useFragment(fragment, fair)
  const { width } = useScreenDimensions()

  if (!data) {
    return null
  }

  const isArtsyEditionShop = data.slug === "the-artsy-edition-shop"
  const profileImageUrl = data.profile?.icon?.imageUrl

  return (
    <Flex pointerEvents="none">
      {!!data.image ? (
        <Flex alignItems="center" justifyContent="center">
          <Image
            width={width}
            height={width / data.image.aspectRatio}
            src={data.image.imageUrl ?? ""}
          />
          {!!profileImageUrl && (
            <Flex
              alignItems="center"
              justifyContent="center"
              bg="mono0"
              width={80}
              height={60}
              px={1}
              position="absolute"
              bottom={0}
              left={2}
            >
              <Image width={60} height={40} src={profileImageUrl} testID="fair-profile-image" />
            </Flex>
          )}
        </Flex>
      ) : null}
      <Flex px={2} pointerEvents="none">
        <Text variant="lg-display" pt={2} pb={isArtsyEditionShop ? 0 : 2}>
          {data.name}
        </Text>
        {isArtsyEditionShop ? (
          <Text variant="sm" pb={2} color="mono60">
            Your Chance to Own an Icon
          </Text>
        ) : (
          <FairTiming fair={data} />
        )}
      </Flex>
    </Flex>
  )
}

const fragment = graphql`
  fragment FairHeader_fair on Fair {
    name
    slug
    profile {
      icon {
        imageUrl: url(version: "untouched-png")
      }
    }
    image {
      imageUrl: url(version: "large_rectangle")
      aspectRatio
    }
    ...FairTiming_fair
  }
`
