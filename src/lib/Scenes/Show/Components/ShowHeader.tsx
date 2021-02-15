import { ShowHeader_show } from "__generated__/ShowHeader_show.graphql"
import { useEventTiming } from "lib/utils/useEventTiming"
import { DateTime } from "luxon"
import { Box, BoxProps, Text } from "palette"
import React, { useEffect, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"

export interface ShowHeaderProps extends BoxProps {
  show: ShowHeader_show
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
      <Text variant="largeTitle" mb="1">
        {show.name}
      </Text>

      <Text variant="mediumText">
        {show.formattedStartAt} – {show.formattedEndAt}
      </Text>

      {!!show.startAt && !!show.endAt && (
        <Text variant="text" color="black60">
          {formattedTime}
        </Text>
      )}

      {!!show.partner && (
        <Text variant="text" color="black60" mt="1">
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
