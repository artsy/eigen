import { tappedConsign, TappedConsignArgs } from "@artsy/cohesion"
import { OldSellWithArtsyHome_recentlySoldArtworksTypeConnection$data } from "__generated__/OldSellWithArtsyHome_recentlySoldArtworksTypeConnection.graphql"
import { OldSellWithArtsyHome_targetSupply$data } from "__generated__/OldSellWithArtsyHome_targetSupply.graphql"
import { OldSellWithArtsyHomeQuery } from "__generated__/OldSellWithArtsyHomeQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Join, Separator } from "palette"
import React, { useEffect } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { OldArtistListFragmentContainer } from "./OldComponents/OldArtistList"
import { OldFooter } from "./OldComponents/OldFooter"
import { OldHeader } from "./OldComponents/OldHeader"
import { OldHowItWorks } from "./OldComponents/OldHowItWorks"
import { OldRecentlySoldFragmentContainer } from "./OldComponents/OldRecentlySold"
import { OldSellWithArtsyCustomRecentlySold } from "./OldComponents/OldSellWithArtsyCustomRecentlySold"

interface Props {
  isLoading?: boolean
  recentlySoldArtworks: OldSellWithArtsyHome_recentlySoldArtworksTypeConnection$data
  targetSupply: OldSellWithArtsyHome_targetSupply$data
}

export const OldSellWithArtsyHome: React.FC<Props> = ({
  isLoading,
  recentlySoldArtworks,
  targetSupply,
}) => {
  const tracking = useTracking()
  const enableCustomRecentlySold = useFeatureFlag("ARCustomRecentlySoldOnArtsy")

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
        <OldHeader onConsignPress={handleConsignPress} />
        {enableCustomRecentlySold ? (
          <OldSellWithArtsyCustomRecentlySold recentlySoldArtworks={recentlySoldArtworks} />
        ) : (
          <OldRecentlySoldFragmentContainer targetSupply={targetSupply} isLoading={isLoading} />
        )}

        <OldHowItWorks />
        <OldArtistListFragmentContainer targetSupply={targetSupply} isLoading={isLoading} />
        <OldFooter onConsignPress={handleConsignPress} />
      </Join>
    </ScrollView>
  )
}

const OldSellWithArtsyHomeContainer = createFragmentContainer(OldSellWithArtsyHome, {
  targetSupply: graphql`
    fragment OldSellWithArtsyHome_targetSupply on TargetSupply {
      ...OldRecentlySold_targetSupply
      ...OldArtistList_targetSupply
    }
  `,
  recentlySoldArtworks: graphql`
    fragment OldSellWithArtsyHome_recentlySoldArtworksTypeConnection on RecentlySoldArtworkTypeConnection {
      ...OldSellWithArtsyCustomRecentlySold_recentlySoldArtworkTypeConnection
    }
  `,
})

interface OldSellWithArtsyHomeQueryRendererProps {
  environment?: RelayModernEnvironment
}

export const OldSellWithArtsyHomeScreenQuery = graphql`
  query OldSellWithArtsyHomeQuery {
    targetSupply {
      ...OldSellWithArtsyHome_targetSupply
    }
    recentlySoldArtworks {
      ...OldSellWithArtsyHome_recentlySoldArtworksTypeConnection
    }
  }
`

export const OldSellWithArtsyHomeQueryRenderer: React.FC<
  OldSellWithArtsyHomeQueryRendererProps
> = ({ environment }) => {
  return (
    <QueryRenderer<OldSellWithArtsyHomeQuery>
      environment={environment || defaultEnvironment}
      variables={{}}
      query={OldSellWithArtsyHomeScreenQuery}
      render={renderWithPlaceholder({
        Container: OldSellWithArtsyHomeContainer,
        renderPlaceholder: () => (
          <OldSellWithArtsyHome
            isLoading
            targetSupply={null as any}
            recentlySoldArtworks={null as any}
          />
        ),
      })}
    />
  )
}
