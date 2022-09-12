import { tappedConsign, TappedConsignArgs } from "@artsy/cohesion"
import { SellWithArtsyHome_recentlySoldArtworks$data } from "__generated__/SellWithArtsyHome_recentlySoldArtworks.graphql"
import { SellWithArtsyHome_targetSupply$data } from "__generated__/SellWithArtsyHome_targetSupply.graphql"
import { SellWithArtsyHomeQuery } from "__generated__/SellWithArtsyHomeQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStore } from "app/store/GlobalStore"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Join, Separator } from "palette"
import React, { useEffect } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { ArtistListFragmentContainer as ArtistList } from "./Components/ArtistList"
import { Footer } from "./Components/Footer"
import { Header } from "./Components/Header"
import { HowItWorks } from "./Components/HowItWorks"
import { RecentlySoldFragmentContainer as RecentlySold } from "./Components/RecentlySold"

interface Props {
  targetSupply: SellWithArtsyHome_targetSupply$data
  recentlySoldArtworks: SellWithArtsyHome_recentlySoldArtworks$data
  isLoading?: boolean
}

export const SellWithArtsyHome: React.FC<Props> = ({
  targetSupply,
  recentlySoldArtworks,
  isLoading,
}) => {
  const tracking = useTracking()
  const handleConsignPress = (tappedConsignArgs: TappedConsignArgs) => {
    tracking.trackEvent(tappedConsign(tappedConsignArgs))
    GlobalStore.actions.artworkSubmission.submission.setPhotosForMyCollection({
      photos: [],
    })
    const route = "/collections/my-collection/artworks/new/submissions/new"
    navigate(route)
  }

  useEffect(() => {
    return () => {
      GlobalStore.actions.artworkSubmission.submission.resetSessionState()
      GlobalStore.actions.artworkSubmission.submission.setPhotosForMyCollection({
        photos: [],
      })
    }
  }, [])

  return (
    <ScrollView>
      <Join separator={<Separator my={3} />}>
        <Header onConsignPress={handleConsignPress} />
        <RecentlySold recentlySoldArtworks={recentlySoldArtworks} isLoading={isLoading} />
        <HowItWorks />
        <ArtistList targetSupply={targetSupply} isLoading={isLoading} />
        <Footer onConsignPress={handleConsignPress} />
      </Join>
    </ScrollView>
  )
}

const SellWithArtsyHomeContainer = createFragmentContainer(SellWithArtsyHome, {
  targetSupply: graphql`
    fragment SellWithArtsyHome_targetSupply on TargetSupply {
      ...ArtistList_targetSupply
    }
  `,
  recentlySoldArtworks: graphql`
    fragment SellWithArtsyHome_recentlySoldArtworks on RecentlySoldArtworkTypeConnection {
      ...RecentlySold_recentlySoldArtworks
    }
  `,
})

interface SellWithArtsyHomeQueryRendererProps {
  environment?: RelayModernEnvironment
}

export const SellWithArtsyHomeScreenQuery = graphql`
  query SellWithArtsyHomeQuery {
    targetSupply {
      ...SellWithArtsyHome_targetSupply
    }
    recentlySoldArtworks {
      ...SellWithArtsyHome_recentlySoldArtworks
    }
  }
`

export const SellWithArtsyHomeQueryRenderer: React.FC<SellWithArtsyHomeQueryRendererProps> = ({
  environment,
}) => {
  return (
    <QueryRenderer<SellWithArtsyHomeQuery>
      environment={environment || defaultEnvironment}
      variables={{}}
      query={SellWithArtsyHomeScreenQuery}
      render={renderWithPlaceholder({
        Container: SellWithArtsyHomeContainer,
        renderPlaceholder: () => (
          <SellWithArtsyHome
            isLoading
            recentlySoldArtworks={null as any}
            targetSupply={null as any}
          />
        ),
      })}
    />
  )
}
