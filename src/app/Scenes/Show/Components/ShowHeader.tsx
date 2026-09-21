import { OwnerType } from "@artsy/cohesion"
import { Box, BoxProps, Flex, Text } from "@artsy/palette-mobile"
import { ShowHeader_show$data } from "__generated__/ShowHeader_show.graphql"
import { ItineraryItemSaveControl } from "app/Components/ItineraryItemSaveControl"
import { useEventTiming } from "app/utils/useEventTiming"
import { DateTime } from "luxon"
import React, { useEffect, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"

export interface ShowHeaderProps extends BoxProps {
  show: ShowHeader_show$data
}

export const ShowHeader: React.FC<ShowHeaderProps> = ({ show, ...rest }) => {
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
        The designs put the follow control on the title's own row, so the title takes the
        remaining width and truncates instead of pushing the control off the edge.
      */}
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
        <Flex flex={1} mr={1}>
          <Text variant="lg-display">{show.name}</Text>
        </Flex>

        {!show.isOnlineExclusive && !!show.location?.address && (
          <ItineraryItemSaveControl
            itemType="SHOW"
            itemID={show.internalID}
            itemSlug={show.slug ?? undefined}
            name={show.name ?? ""}
            contextScreenOwnerType={OwnerType.show}
            contextScreenOwnerId={show.internalID}
            contextScreenOwnerSlug={show.slug ?? undefined}
          />
        )}
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
      internalID
      slug
      isOnlineExclusive
      location {
        address
      }
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
