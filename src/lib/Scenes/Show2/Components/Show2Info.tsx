import { Show2Info_show } from "__generated__/Show2Info_show.graphql"
import { navigate } from "lib/navigation/navigate"
import { Box, BoxProps, ChevronIcon, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export interface Show2InfoProps extends BoxProps {
  show: Show2Info_show
}

export const Show2Info: React.FC<Show2InfoProps> = ({ show, ...rest }) => {
  return (
    <Box {...rest}>
      {!!show.about && (
        <Text variant="text" mb={1}>
          {show.about}
        </Text>
      )}

      <TouchableOpacity onPress={() => navigate(`${show.href}/info`)}>
        <Box flexDirection="row" alignItems="center">
          <Text variant="mediumText">More info</Text>
          <ChevronIcon />
        </Box>
      </TouchableOpacity>
    </Box>
  )
}

export const Show2InfoFragmentContainer = createFragmentContainer(Show2Info, {
  show: graphql`
    fragment Show2Info_show on Show {
      href
      about: description
    }
  `,
})
