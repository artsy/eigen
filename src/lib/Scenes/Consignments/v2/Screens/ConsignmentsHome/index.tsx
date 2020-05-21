import { Join, Separator } from "@artsy/palette"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import React, { useRef } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

import { ConsignmentsHome_artists } from "__generated__/ConsignmentsHome_artists.graphql"
import { ConsignmentsHomeQuery } from "__generated__/ConsignmentsHomeQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"

import { ArtistListFragmentContainer as ArtistList } from "./Components/ArtistList"
import { Footer } from "./Components/Footer"
import { Header } from "./Components/Header"
import { HowItWorks } from "./Components/HowItWorks"
import { RecentlySoldFragmentContainer as RecentlySold } from "./Components/RecentlySold"

import { ProvidePlaceholderContext } from "lib/utils/placeholders"

interface Props {
  artists: ConsignmentsHome_artists
  isLoading?: boolean
}

export const ConsignmentsHome: React.FC<Props> = ({ artists, isLoading }) => {
  const navRef = useRef<ScrollView>(null)

  const presentSubmissionModal = () => {
    if (navRef.current) {
      const route = "/collections/my-collection/artworks/new/submissions/new"
      SwitchBoard.presentModalViewController(navRef.current, route)
    }
  }

  return (
    <ProvidePlaceholderContext>
      <ScrollView ref={navRef}>
        <Join separator={<Separator my={3} />}>
          <Header onCTAPress={presentSubmissionModal} />
          <RecentlySold artists={artists} isLoading={isLoading} />
          <HowItWorks />
          <ArtistList artists={artists} isLoading={isLoading} />
          <Footer onCTAPress={presentSubmissionModal} />
        </Join>
      </ScrollView>
    </ProvidePlaceholderContext>
  )
}

const ConsignmentsHomeContainer = createFragmentContainer(ConsignmentsHome, {
  artists: graphql`
    fragment ConsignmentsHome_artists on Artist @relay(plural: true) {
      ...RecentlySold_artists
      ...ArtistList_artists
    }
  `,
})

export const ConsignmentsHomeQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<ConsignmentsHomeQuery>
      environment={defaultEnvironment}
      variables={{ artistIDs: FIXME_MICROFUNNEL_ARTISTS }}
      query={graphql`
        query ConsignmentsHomeQuery($artistIDs: [String!]!) {
          artists(ids: $artistIDs) {
            ...ConsignmentsHome_artists
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: ConsignmentsHomeContainer,
        renderPlaceholder: () => <ConsignmentsHome isLoading={true} artists={null as any} />,
      })}
    />
  )
}

// TODO: Move this hardcoded list into metaphysics before this feature launches to users
const FIXME_MICROFUNNEL_ARTISTS = Object.keys({
  "4d8d120c876c697ae1000046": "Alex Katz",
  "4dd1584de0091e000100207c": "Banksy",
  "4d8b926a4eb68a1b2c0000ae": "Damien Hirst",
  "4d8b92854eb68a1b2c0001b6": "David Hockney",
  "4de3c41f7a22e70001002b13": "David Shrigley",
  "4d8b92774eb68a1b2c000138": "Ed Ruscha",
  "4d9e1a143c86c538060000a4": "Eddie Martinez",
  "4e97537ca200000001002237": "Harland Miller",
  "4d8b92904eb68a1b2c00022e": "Invader",
  "506b332d4466170002000489": "Katherine Bernhardt",
  "4e934002e340fa0001005336": "KAWS",
  "4ed901b755a41e0001000a9f": "Kehinde Wiley",
  "4e975df46ba7120001001fe2": "Mr. Brainwash",
  "4f5f64c13b555230ac000004": "Nina Chanel Abney",
  "4d8b92734eb68a1b2c00010c": "Roy Lichtenstein",
  "4d9b330cff9a375c2f0031a8": "Sterling Ruby",
  "551bcaa77261692b6f181400": "Stik",
  "4d8b92bb4eb68a1b2c000452": "Takashi Murakami",
  "4ef3c0ee9f1ce1000100022f": "Tomoo Gokita",
})

// console.log(FIXME_MICROFUNNEL_ARTISTS)
