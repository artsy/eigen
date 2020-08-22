import { Box, Flex, Separator, Spacer, Theme } from "@artsy/palette"
import React from "react"
import { ViewProperties } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { FairDetailContainer as FairDetailScreen } from "./Screens/FairDetail"

import { Fair_fair } from "__generated__/Fair_fair.graphql"
import { FairQuery } from "__generated__/FairQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox, PlaceholderImage, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"

interface Props extends ViewProperties {
  fair: Fair_fair
}

export class Fair extends React.Component<Props> {
  render() {
    return (
      <Theme>
        <FairDetailScreen {...this.props} />
      </Theme>
    )
  }
}

export const FairContainer = createFragmentContainer(Fair, {
  fair: graphql`
    fragment Fair_fair on Fair {
      id
      ...FairDetail_fair
    }
  `,
})

interface FairQueryRendererProps {
  fairID: string
}

export const FairQueryRenderer: React.SFC<FairQueryRendererProps> = ({ fairID }) => {
  return (
    <QueryRenderer<FairQuery>
      environment={defaultEnvironment}
      query={graphql`
        query FairQuery($fairID: String!) {
          fair(id: $fairID) @principalField {
            ...Fair_fair
          }
        }
      `}
      variables={{ fairID }}
      render={renderWithPlaceholder({
        Container: FairContainer,
        renderPlaceholder: () => <FairPlaceholder />,
      })}
    />
  )
}

export const FairPlaceholder: React.FC = () => (
  <Flex>
    <PlaceholderBox height={567} />
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px="2">
      <Flex>
        <Spacer mb={2} />
        {/* Works by text */}
        <PlaceholderText width={180} />
        <PlaceholderText width={100} />
        {/* opening hours text */}
        <Spacer mb={2} />
        <PlaceholderText width={140} />
      </Flex>
    </Flex>
    <Spacer mb={2} />
    <Separator />
    {/* Browse the fair text */}
    <Box mt={3} ml={2}>
      <PlaceholderText width={140} />
    </Box>
    <Spacer mb={2} />
    {/* tabs */}
    <Flex justifyContent="space-around" flexDirection="row" px={2}>
      <PlaceholderText width={40} />
      <PlaceholderText width={50} />
      <PlaceholderText width={40} />
    </Flex>
    <Spacer mb={1} />
    <Separator />
    <Spacer mb={3} />
    {/* masonry grid */}
    <Flex mx={2} flexDirection="row">
      <Flex mr={1} style={{ flex: 1 }}>
        <PlaceholderImage height={92} />
        <PlaceholderImage height={172} />
        <PlaceholderImage height={82} />
      </Flex>
      <Flex ml={1} style={{ flex: 1 }}>
        <PlaceholderImage height={182} />
        <PlaceholderImage height={132} />
        <PlaceholderImage height={86} />
      </Flex>
    </Flex>
  </Flex>
)
