import { Join, Separator } from "@artsy/palette"
import { ConsignmentsHome_artists } from "__generated__/ConsignmentsHome_artists.graphql"
import { ConsignmentsHomeQuery } from "__generated__/ConsignmentsHomeQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { FooterCTA } from "./Components/FooterCTA"
import { HeaderCTA } from "./Components/HeaderCTA"
import { HowItWorks } from "./Components/HowItWorks"
import { RecentlySold } from "./Components/RecentlySold"
import { useCTA } from "./Utils/useCTA"

import {
  ArtistListFragmentContainer as ArtistList,
  ArtistListPlaceholder,
  FOCUSED_20_ARTIST_IDS,
} from "./Components/ArtistList"

interface Props {
  artists: ConsignmentsHome_artists
}

export const ConsignmentsHome: React.FC<Props> = ({ artists }) => {
  const { navRef } = useCTA()

  return (
    <ScrollView ref={navRef}>
      <Join separator={<Separator my={3} />}>
        <HeaderCTA />
        <RecentlySold />
        <HowItWorks />
        <ArtistList artists={artists} />
        <FooterCTA />
      </Join>
    </ScrollView>
  )
}

const ConsignmentsHomeContainer = createFragmentContainer(ConsignmentsHome, {
  artists: graphql`
    fragment ConsignmentsHome_artists on Artist @relay(plural: true) {
      ...ArtistList_artists
    }
  `,
})

export const ConsignmentsHomeQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<ConsignmentsHomeQuery>
      environment={defaultEnvironment}
      variables={{ artistIDs: FOCUSED_20_ARTIST_IDS }}
      query={graphql`
        query ConsignmentsHomeQuery($artistIDs: [String!]!) {
          artists(ids: $artistIDs) {
            ...ConsignmentsHome_artists
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: ConsignmentsHomeContainer,
        renderPlaceholder: () => (
          <ScrollView>
            <Join separator={<Separator my={3} />}></Join>
            <HeaderCTA />
            <HowItWorks />
            <ArtistListPlaceholder />
            <FooterCTA />
          </ScrollView>
        ),
      })}
    />
  )
}
