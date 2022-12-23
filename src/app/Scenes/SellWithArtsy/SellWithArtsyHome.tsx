import { ContextModule, OwnerType, tappedConsign, TappedConsignArgs } from "@artsy/cohesion"
import { SellWithArtsyHome_me$data } from "__generated__/SellWithArtsyHome_me.graphql"
import { SellWithArtsyHome_recentlySoldArtworksTypeConnection$data } from "__generated__/SellWithArtsyHome_recentlySoldArtworksTypeConnection.graphql"
import { SellWithArtsyHomeQuery } from "__generated__/SellWithArtsyHomeQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { useScrollToTopForTab } from "app/navigation/useScrollToTopForTab"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStore } from "app/store/GlobalStore"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { useLightStatusBarStyle } from "app/utils/useStatusBarStyle"
import { Button, Flex, Screen, Spacer, Text } from "palette"
import React, { useEffect, useRef } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { useScreenDimensions } from "shared/hooks"
import { Footer } from "./Components/Footer"
import { Header } from "./Components/Header"
import { HowItWorks } from "./Components/HowItWorks"
import { SellWithArtsyRecentlySold } from "./Components/SellWithArtsyRecentlySold"
import { WhySellWithArtsy } from "./Components/WhySellWithArtsy"

const consignArgs: TappedConsignArgs = {
  contextModule: ContextModule.sellFooter,
  contextScreenOwnerType: OwnerType.sell,
  subject: "Submit a work",
}

interface SellWithArtsyHomeProps {
  recentlySoldArtworks?: SellWithArtsyHome_recentlySoldArtworksTypeConnection$data
  me?: SellWithArtsyHome_me$data
}

export const SellWithArtsyHome: React.FC<SellWithArtsyHomeProps> = ({
  recentlySoldArtworks,
  me,
}) => {
  const listRef = useRef<ScrollView | null>(null)

  useLightStatusBarStyle()
  useScrollToTopForTab(listRef)

  const { height: screenHeight } = useScreenDimensions()
  const tracking = useTracking()

  const handleConsignPress = (tappedConsignArgs: TappedConsignArgs) => {
    tracking.trackEvent(tappedConsign(tappedConsignArgs))
    GlobalStore.actions.artworkSubmission.submission.setPhotosForMyCollection({
      photos: [],
    })
    GlobalStore.actions.artworkSubmission.submission.setSubmissionIdForMyCollection("")
    const route = "/collections/my-collection/artworks/new/submissions/new"
    navigate(route)
  }

  useEffect(() => {
    return () => {
      GlobalStore.actions.artworkSubmission.submission.resetSessionState()
      GlobalStore.actions.artworkSubmission.submission.setPhotosForMyCollection({
        photos: [],
      })
      GlobalStore.actions.artworkSubmission.submission.setSubmissionIdForMyCollection("")
    }
  }, [])

  return (
    <Screen.Background>
      <Flex flex={1} justifyContent="center" alignItems="center" minHeight={screenHeight}>
        <ScrollView ref={listRef} showsVerticalScrollIndicator={false}>
          <Flex pb={5}>
            <Header
              onConsignPress={handleConsignPress}
              onInquiryPress={() =>
                navigate("/sell/inquiry", {
                  passProps: {
                    email: me?.email ?? "",
                    name: me?.name ?? "",
                    phone: me?.phone ?? "",
                    userId: me?.internalID ?? undefined,
                  },
                })
              }
            />

            <Spacer mb={4} />

            <HowItWorks />

            <Spacer mb={4} />

            <SellWithArtsyRecentlySold recentlySoldArtworks={recentlySoldArtworks!} />

            <Spacer mb={4} />

            <WhySellWithArtsy />

            <Spacer mb={4} />

            <Flex mx={2}>
              <Button
                testID="footer-cta"
                variant="fillDark"
                block
                onPress={() => handleConsignPress(consignArgs)}
                haptic
              >
                <Text variant="sm">Submit an Artwork</Text>
              </Button>
            </Flex>

            <Spacer mb={4} />

            <Footer />
          </Flex>
        </ScrollView>
      </Flex>
    </Screen.Background>
  )
}

const SellWithArtsyHomeContainer = createFragmentContainer(SellWithArtsyHome, {
  recentlySoldArtworks: graphql`
    fragment SellWithArtsyHome_recentlySoldArtworksTypeConnection on RecentlySoldArtworkTypeConnection {
      ...SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection
    }
  `,
  me: graphql`
    fragment SellWithArtsyHome_me on Me {
      internalID
      name
      email
      phone
    }
  `,
})

interface SellWithArtsyHomeQueryRendererProps {
  environment?: RelayModernEnvironment
}

export const SellWithArtsyHomeScreenQuery = graphql`
  query SellWithArtsyHomeQuery {
    recentlySoldArtworks {
      ...SellWithArtsyHome_recentlySoldArtworksTypeConnection
    }
    me {
      ...SellWithArtsyHome_me
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
        renderPlaceholder: () => <SellWithArtsyHome recentlySoldArtworks={undefined} />,
      })}
    />
  )
}
