import { Box, BoxProps, FollowButton, Text } from "@artsy/palette-mobile"
import { ShowHeader_show$data } from "__generated__/ShowHeader_show.graphql"
import { useEventTiming } from "app/utils/useEventTiming"
import { DateTime } from "luxon"
import React, { useEffect, useState } from "react"
import { createFragmentContainer, graphql, useMutation } from "react-relay"

export interface ShowHeaderProps extends BoxProps {
  show: ShowHeader_show$data
}

export const ShowHeader: React.FC<ShowHeaderProps> = ({ show, ...rest }) => {
  const [currentTime, setCurrentTime] = useState(DateTime.local().toString())

  const [commit, isInFlight] = useMutation(FollowShowMutation)

  const { formattedTime } = useEventTiming({
    currentTime,
    startAt: show.startAt ?? undefined,
    endAt: show.endAt ?? undefined,
  })

  const handleFollowShow = () => {
    commit({
      variables: {
        input: {
          partnerShowID: show?.internalID,
          unfollow: !!show?.isFollowed,
        },
      },
      // TODO: handle errors? we don't seem to handle elsewhere :(
      // onError(error) {
      //   console.error("errors", error)
      // },
      // onCompleted() {
      //   console.log("onCompleted")
      // },
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(DateTime.local().toString())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  // TODO:
  // - any circumstances we should not show it?

  return (
    <Box {...rest}>
      <Text variant="lg-display" mb={1}>
        {show.name}
      </Text>

      <Text variant="sm">
        {show.formattedStartAt} – {show.formattedEndAt}
      </Text>

      {!!show.startAt && !!show.endAt && (
        <Text variant="sm" color="black60">
          {formattedTime}
        </Text>
      )}

      <FollowButton
        haptic
        isFollowed={!!show.isFollowed ? show.isFollowed : false}
        onPress={handleFollowShow}
        loading={isInFlight}
        disabled={isInFlight}
      />

      {!!show.partner && (
        <Text variant="sm" color="black60" mt={1}>
          {show.partner.name}
        </Text>
      )}
    </Box>
  )
}

const FollowShowMutation = graphql`
  mutation ShowHeaderFollowShowMutation($input: FollowShowInput!) {
    followShow(input: $input) {
      show {
        id
        internalID
        isFollowed
      }
    }
  }
`

export const ShowHeaderFragmentContainer = createFragmentContainer(ShowHeader, {
  show: graphql`
    fragment ShowHeader_show on Show {
      isFollowed
      internalID
      name
      startAt
      endAt
      formattedStartAt: startAt(format: "MMMM D")
      formattedEndAt: endAt(format: "MMMM D, YYYY")
      partner {
        ... on Partner {
          name
        }
        ... on ExternalPartner {
          name
        }
      }
    }
  `,
})
