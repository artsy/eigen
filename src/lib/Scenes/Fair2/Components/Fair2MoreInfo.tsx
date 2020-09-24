import { Fair2MoreInfo_fair } from "__generated__/Fair2MoreInfo_fair.graphql"
import { Fair2MoreInfoQuery } from "__generated__/Fair2MoreInfoQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Text, Theme } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Fair2MoreInfoQueryRendererProps {
  fairID: string
}

interface Fair2MoreInfoProps {
  fair: Fair2MoreInfo_fair
}

export const Fair2MoreInfo: React.FC<Fair2MoreInfoProps> = ({ fair }) => {
  const sections = ["foo"]
  return (
    <Theme>
      <FlatList
        data={sections}
        keyExtractor={(_item, index) => String(index)}
        renderItem={({ item }): null | any => {
          switch (item) {
            case "foo":
              return <Text variant="text">{fair.name}</Text>
          }
        }}
      />
    </Theme>
  )
}

export const Fair2MoreInfoFragmentContainer = createFragmentContainer(Fair2MoreInfo, {
  fair: graphql`
    fragment Fair2MoreInfo_fair on Fair {
      name
    }
  `,
})

export const Fair2MoreInfoQueryRenderer: React.FC<Fair2MoreInfoQueryRendererProps> = ({ fairID }) => {
  return (
    <QueryRenderer<Fair2MoreInfoQuery>
      environment={defaultEnvironment}
      query={graphql`
        query Fair2MoreInfoQuery($fairID: String!) {
          fair(id: $fairID) @principalField {
            ...Fair2MoreInfo_fair
          }
        }
      `}
      variables={{ fairID }}
      render={renderWithLoadProgress(Fair2MoreInfoFragmentContainer)}
    />
  )
}
