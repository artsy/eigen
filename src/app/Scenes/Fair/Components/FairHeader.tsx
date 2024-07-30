import { Spacer, Flex, Text, useScreenDimensions, Image, FollowButton } from "@artsy/palette-mobile"
import { FairHeader_fair$key } from "__generated__/FairHeader_fair.graphql"
import { FC } from "react"
import { graphql, useFragment, useMutation } from "react-relay"
import { FairTimingFragmentContainer as FairTiming } from "./FairTiming"
interface FairHeaderProps {
  fair: FairHeader_fair$key
}

export const FairHeader: FC<FairHeaderProps> = ({ fair }) => {
  const data = useFragment(fragment, fair)
  const { width } = useScreenDimensions()

  const [commit, isInFlight] = useMutation(FollowFairMutation)

  if (!data) {
    return null
  }

  const profileImageUrl = data.profile?.icon?.imageUrl

  const handleFollowFair = () => {
    if (!data.profile) {
      return
    }

    commit({
      variables: {
        input: {
          profileID: data.profile.internalID,
          unfollow: data.profile.isFollowed,
        },
      },
    })
  }

  return (
    <Flex pointerEvents="box-none">
      {!!data.image ? (
        <Flex alignItems="center" justifyContent="center" pointerEvents="none">
          <Image
            width={width}
            height={width / data.image.aspectRatio}
            src={data.image.imageUrl ?? ""}
          />
          {!!profileImageUrl && (
            <Flex
              alignItems="center"
              justifyContent="center"
              bg="white100"
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
      ) : (
        <Spacer y={6} />
      )}
      <Flex px={2} pointerEvents="none">
        <Text variant="lg-display" py={2}>
          {data.name}
        </Text>
        <FairTiming fair={data} />
      </Flex>

      {/* limit width because of pointer events interfering with scroll */}
      <Flex px={2} pointerEvents="box-none" width={200}>
        <FollowButton
          haptic
          isFollowed={!!data.profile?.isFollowed ? data.profile?.isFollowed : false}
          onPress={handleFollowFair}
          loading={isInFlight}
          disabled={isInFlight}
        />
      </Flex>
    </Flex>
  )
}

const FollowFairMutation = graphql`
  mutation FairHeaderFollowFairMutation($input: FollowProfileInput!) {
    followProfile(input: $input) {
      profile {
        id
        internalID
        isFollowed
      }
    }
  }
`

const fragment = graphql`
  fragment FairHeader_fair on Fair {
    name
    profile {
      isFollowed
      internalID
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
