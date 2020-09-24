import { Fair2_fair } from "__generated__/Fair2_fair.graphql"
import { Fair2Query } from "__generated__/Fair2Query.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Separator, Theme } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Fair2EditorialFragmentContainer } from "./Components/Fair2Editorial"
import { Fair2HeaderFragmentContainer } from "./Components/Fair2Header"

interface Fair2QueryRendererProps {
  fairID: string
}

interface Fair2Props {
  fair: Fair2_fair
}

export const Fair2: React.FC<Fair2Props> = ({ fair }) => {
  const sections = ["fair2Header", "fair2Editorial"]
  return (
    <Theme>
      <FlatList
        data={sections}
        keyExtractor={(_item, index) => String(index)}
        ItemSeparatorComponent={() => <Separator my={3} />}
        renderItem={({ item }): null | any => {
          switch (item) {
            case "fair2Header":
              return <Fair2HeaderFragmentContainer fair={fair} />
            case "fair2Editorial":
              return <Fair2EditorialFragmentContainer fair={fair} />
          }
        }}
      />
    </Theme>
  )
}

export const Fair2FragmentContainer = createFragmentContainer(Fair2, {
  fair: graphql`
    fragment Fair2_fair on Fair {
      ...Fair2Header_fair
      ...Fair2Editorial_fair
    }
  `,
})

export const Fair2QueryRenderer: React.FC<Fair2QueryRendererProps> = ({ fairID }) => {
  return (
    <QueryRenderer<Fair2Query>
      environment={defaultEnvironment}
      query={graphql`
        query Fair2Query($fairID: String!) {
          fair(id: $fairID) @principalField {
            ...Fair2_fair
          }
        }
      `}
      variables={{ fairID }}
      render={renderWithLoadProgress(Fair2FragmentContainer)}
    />
  )
}
