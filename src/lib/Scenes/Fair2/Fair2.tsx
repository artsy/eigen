import { Fair2_fair } from "__generated__/Fair2_fair.graphql"
import { Fair2Query } from "__generated__/Fair2Query.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Separator, Theme } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Fair2CollectionsFragmentContainer as FairCollections } from "./Components/Fair2Collections"
import { Fair2EditorialFragmentContainer as FairEditorial } from "./Components/Fair2Editorial"
import { Fair2HeaderFragmentContainer as FairHeader } from "./Components/Fair2Header"

interface Fair2QueryRendererProps {
  fairID: string
}

interface Fair2Props {
  fair: Fair2_fair
}

export const Fair2: React.FC<Fair2Props> = ({ fair }) => {
  const hasArticles = !!fair.articles?.edges?.length
  const hasCollections = !!fair.marketingCollections.length

  const sections = [
    <FairHeader fair={fair} />,
    ...(hasArticles ? [<FairEditorial fair={fair} />] : []),
    ...(hasCollections ? [<FairCollections fair={fair} />] : []),
  ]

  return (
    <Theme>
      <FlatList
        data={sections}
        ItemSeparatorComponent={() => <Separator my={3} />}
        keyExtractor={(_item, index) => String(index)}
        renderItem={({ item }) => item}
      />
    </Theme>
  )
}

export const Fair2FragmentContainer = createFragmentContainer(Fair2, {
  fair: graphql`
    fragment Fair2_fair on Fair {
      articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC) {
        edges {
          __typename
        }
      }
      marketingCollections(size: 4) {
        __typename
      }
      ...Fair2Header_fair
      ...Fair2Editorial_fair
      ...Fair2Collections_fair
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
