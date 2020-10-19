import { Show2_show } from "__generated__/Show2_show.graphql"
import { Show2Query } from "__generated__/Show2Query.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox, PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Flex, Separator, Spacer } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Show2HeaderFragmentContainer as ShowHeader } from "./Components/Show2Header"
import { Show2InfoFragmentContainer as ShowInfo } from "./Components/Show2Info"
import { Show2InstallShotsFragmentContainer as ShowInstallShots } from "./Components/Show2InstallShots"

interface Show2QueryRendererProps {
  showID: string
}

interface Show2Props {
  show: Show2_show
}

export const Show2: React.FC<Show2Props> = ({ show }) => {
  const sections = [
    <ShowHeader show={show} mx={2} />,
    ...(!!show.images?.length ? [<ShowInstallShots show={show} />] : []),
    <ShowInfo show={show} mx={2} />,
  ]

  return (
    <FlatList<typeof sections[number]>
      data={sections}
      keyExtractor={(_, i) => String(i)}
      ListHeaderComponent={<Spacer mt={6} pt={2} />}
      ListFooterComponent={<Spacer my={2} />}
      ItemSeparatorComponent={() => <Spacer my={15} />}
      renderItem={({ item }) => item}
    />
  )
}

export const Show2FragmentContainer = createFragmentContainer(Show2, {
  show: graphql`
    fragment Show2_show on Show {
      ...Show2Header_show
      ...Show2InstallShots_show
      ...Show2Info_show
      images {
        __typename
      }
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
