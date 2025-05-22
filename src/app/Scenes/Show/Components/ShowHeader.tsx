import { Box, BoxProps, Text } from "@artsy/palette-mobile"
import { ShowHeader_show$data } from "__generated__/ShowHeader_show.graphql"
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
      <Text variant="lg-display" mb={1}>
        {show.name}
      </Text>

      <Text variant="sm">
        {show.formattedStartAt} – {show.formattedEndAt}
      </Text>

      {!!show.startAt && !!show.endAt && (
        <Text variant="sm" color="mono60">
          {formattedTime}
        </Text>
      )}

      {!!show.partner && (
        <Text variant="sm" color="mono60" mt={1}>
          {show.partner.name}
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
    }
  `,
})
