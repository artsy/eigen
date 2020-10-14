import { Show2Header_show } from "__generated__/Show2Header_show.graphql"
import { useEventTiming } from "lib/utils/useEventTiming"
import { Box, BoxProps, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

export interface Show2HeaderProps extends BoxProps {
  show: Show2Header_show
}

export const Show2Header: React.FC<Show2HeaderProps> = ({ show, ...rest }) => {
  const { formattedTime } = useEventTiming({ startAt: show.startAt ?? undefined, endAt: show.endAt ?? undefined })

  return (
    <Box {...rest}>
      <Text variant="largeTitle" mb={1}>
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
        <Text variant="text" color="black60" mt={1}>
          {show.partner.name}
        </Text>
      )}
    </Box>
  )
}

export const Show2HeaderFragmentContainer = createFragmentContainer(Show2Header, {
  show: graphql`
    fragment Show2Header_show on Show {
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
