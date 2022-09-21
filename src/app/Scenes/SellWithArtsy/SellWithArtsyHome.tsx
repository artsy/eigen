import { ContextModule, OwnerType, tappedConsign, TappedConsignArgs } from "@artsy/cohesion"
import { SellWithArtsyHome_recentlySoldArtworksTypeConnection$data } from "__generated__/SellWithArtsyHome_recentlySoldArtworksTypeConnection.graphql"
import { SellWithArtsyHome_targetSupply$data } from "__generated__/SellWithArtsyHome_targetSupply.graphql"
import { SellWithArtsyHomeQuery } from "__generated__/SellWithArtsyHomeQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStore } from "app/store/GlobalStore"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Button, Flex, Screen, Separator, Spacer, Text } from "palette"
import React, { useEffect } from "react"
import { SafeAreaView, ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { space } from "styled-system"
import { useFeatureFlag } from "../../store/GlobalStore"
import { Header } from "./Components/Header"
import { HowItWorks } from "./Components/HowItWorks"
import { RecentlySoldFragmentContainer as RecentlySold } from "./Components/RecentlySold"
import { SellWithArtsyCustomRecentlySold } from "./Components/SellWithArtsyCustomRecentlySold"
import { WhySellWithArtsy } from "./Components/WhySellWithArtsy"

const consignArgs: TappedConsignArgs = {
  contextModule: ContextModule.sellFooter,
  contextScreenOwnerType: OwnerType.sell,
  subject: "Submit a work",
}

interface SellWithArtsyHomeProps {
  isLoading?: boolean
  recentlySoldArtworks: SellWithArtsyHome_recentlySoldArtworksTypeConnection$data
  targetSupply: SellWithArtsyHome_targetSupply$data
}

export const SellWithArtsyHome: React.FC<SellWithArtsyHomeProps> = ({
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
    <Screen.Background>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: space(2),
          backgroundColor: "transparent",
          top: -50,
        }}
      >
        <Flex flex={1}>
          <ScrollView>
            <Header onConsignPress={handleConsignPress} />

            <Spacer mb={4} />

            <HowItWorks />

            <Spacer mb={4} />

            {enableCustomRecentlySold ? (
              <SellWithArtsyCustomRecentlySold recentlySoldArtworks={recentlySoldArtworks} />
            ) : (
              <RecentlySold targetSupply={targetSupply} isLoading={isLoading} />
            )}

            <Spacer mb={4} />

            <WhySellWithArtsy />

            <Spacer mb={5} />

            <Flex mx={2}>
              <Button
                testID="footer-cta"
                variant="fillDark"
                block
                onPress={() => handleConsignPress(consignArgs)}
                haptic
              >
                <Text variant="sm">Submit a work</Text>
              </Button>
            </Flex>

            <Spacer mb={4} />

            <Flex mx={2}>
              <Separator />

              <Text variant="lg" mb={1} mt={2}>
                Gallerist or Art Dealer?
              </Text>
              <Text variant="sm" color="black60" mb={2}>
                Become a partner to access the world’s largest online art marketplace.
              </Text>

              <Separator />

              <Text variant="lg" mb={1} mt={2}>
                Have a Question?
              </Text>
              <Text variant="sm" color="black60" mb={2}>
                Visit our Help Center or read our FAQs.
              </Text>
            </Flex>
          </ScrollView>
        </Flex>
      </SafeAreaView>
    </Screen.Background>
  )
}

const SellWithArtsyHomeContainer = createFragmentContainer(SellWithArtsyHome, {
  targetSupply: graphql`
    fragment SellWithArtsyHome_targetSupply on TargetSupply {
      ...RecentlySold_targetSupply
    }
  `,
  recentlySoldArtworks: graphql`
    fragment SellWithArtsyHome_recentlySoldArtworksTypeConnection on RecentlySoldArtworkTypeConnection {
      ...SellWithArtsyCustomRecentlySold_recentlySoldArtworkTypeConnection
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
      ...SellWithArtsyHome_recentlySoldArtworksTypeConnection
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
            targetSupply={null as any}
            recentlySoldArtworks={null as any}
          />
        ),
      })}
    />
  )
}
