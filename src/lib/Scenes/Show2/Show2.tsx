import { Show2_show } from "__generated__/Show2_show.graphql"
import { Show2Query } from "__generated__/Show2Query.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox, PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Box, Flex, Separator, Spacer, Text, Theme } from "palette"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Show2QueryRendererProps {
  showID: string
}

interface Show2Props {
  show: Show2_show
}

export const Show2: React.FC<Show2Props> = ({ show }) => {
  const { name } = show
  return (
    <Theme>
      <Box p={2}>
        <Text variant="largeTitle">{name}</Text>
      </Box>
    </Theme>
  )
}

export const Show2FragmentContainer = createFragmentContainer(Show2, {
  show: graphql`
    fragment Show2_show on Show {
      name
    }
  `,
})

export const Show2QueryRenderer: React.FC<Show2QueryRendererProps> = ({ showID }) => {
  return (
    <QueryRenderer<Show2Query>
      environment={defaultEnvironment}
      query={graphql`
        query Show2Query($showID: String!) {
          show(id: $showID) @principalField {
            ...Show2_show
          }
        }
      `}
      variables={{ showID }}
      render={renderWithPlaceholder({
        Container: Show2FragmentContainer,
        renderPlaceholder: () => <Show2Placeholder />,
      })}
    />
  )
}

export const Show2Placeholder: React.FC = () => (
  <Flex>
    <PlaceholderBox height={400} />
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px="2">
      <Flex>
        <Spacer mb={2} />
        {/* Show name */}
        <PlaceholderText width={220} />
        {/* Show info */}
        <PlaceholderText width={190} />
        <PlaceholderText width={190} />
      </Flex>
    </Flex>
    <Spacer mb={2} />
    <Separator />
    <Spacer mb={2} />
    {/* masonry grid */}
    <PlaceholderGrid />
  </Flex>
)
