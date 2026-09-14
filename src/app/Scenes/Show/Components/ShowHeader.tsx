import { Box, BoxProps, Flex, Text } from "@artsy/palette-mobile"
import { ShowHeader_show$data } from "__generated__/ShowHeader_show.graphql"
import { ShowFollowButton } from "app/Components/ShowFollowButton"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useEventTiming } from "app/utils/useEventTiming"
import { DateTime } from "luxon"
import React, { useEffect, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"

export interface ShowHeaderProps extends BoxProps {
  show: ShowHeader_show$data
}

export const ShowHeader: React.FC<ShowHeaderProps> = ({ show, ...rest }) => {
  const enableFollowShowsAndFairs = useFeatureFlag("AREnableFollowShowsAndFairs")
  const [currentTime, setCurrentTime] = useState(DateTime.local().toString())

  const { formattedTime } = useEventTiming({
    currentTime,
    startAt: show.startAt ?? undefined,
    endAt: show.endAt ?? undefined,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(DateTime.local().toString())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Box {...rest}>
      {/*
        The designs put the follow control on the title's own row rather than as a full-width
        button below, so the title takes the remaining width and truncates instead of pushing
        the control off the edge.
      */}
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
        <Flex flex={1} mr={1}>
          <Text variant="lg-display">{show.name}</Text>
        </Flex>

        {!!enableFollowShowsAndFairs && <ShowFollowButton show={show} variant="icon" />}
      </Flex>

      <Text variant="sm">
        {show.formattedStartAt} – {show.formattedEndAt}
      </Text>

      {!!show.startAt && !!show.endAt && formattedTime !== null && (
        <Text variant="sm" color="mono60">
          {formattedTime}
        </Text>
      )}
    </Box>
  )
}

export const ShowHeaderFragmentContainer = createFragmentContainer(ShowHeader, {
  show: graphql`
    fragment ShowHeader_show on Show {
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
      ...ShowFollowButton_show
    }
  `,
})
