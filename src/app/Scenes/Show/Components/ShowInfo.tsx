import { ChevronSmallRightIcon } from "@artsy/icons/native"
import { Box, BoxProps, Text } from "@artsy/palette-mobile"
import { ShowInfo_show$data } from "__generated__/ShowInfo_show.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { createFragmentContainer, graphql } from "react-relay"

export interface ShowInfoProps extends BoxProps {
  show: ShowInfo_show$data
}

export const ShowInfo: React.FC<ShowInfoProps> = ({ show, ...rest }) => {
  return (
    <Box {...rest}>
      {!!show.about && (
        <Text variant="sm" mb={1}>
          {show.about}
        </Text>
      )}

      <RouterLink to={`${show.href}/info`}>
        <Box flexDirection="row" alignItems="center">
          <Text variant="sm">More info</Text>
          <ChevronSmallRightIcon />
        </Box>
      </RouterLink>
    </Box>
  )
}

export const ShowInfoFragmentContainer = createFragmentContainer(ShowInfo, {
  show: graphql`
    fragment ShowInfo_show on Show {
      href
      about: description
    }
  `,
})
