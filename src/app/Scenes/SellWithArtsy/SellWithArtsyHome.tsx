import {
  ContextModule,
  OwnerType,
  tappedConsign,
  TappedConsignArgs,
  TappedConsignmentInquiry,
} from "@artsy/cohesion"
import { Spacer, Flex, Join } from "@artsy/palette-mobile"
import { SellWithArtsyHomeQuery } from "__generated__/SellWithArtsyHomeQuery.graphql"
import { SellWithArtsyHome_me$data } from "__generated__/SellWithArtsyHome_me.graphql"
import { SellWithArtsyHome_recentlySoldArtworksTypeConnection$data } from "__generated__/SellWithArtsyHome_recentlySoldArtworksTypeConnection.graphql"
import { CollectorsNetwork } from "app/Scenes/SellWithArtsy/Components/CollectorsNetwork"
import { FAQSWA } from "app/Scenes/SellWithArtsy/Components/FAQSWA"
import { Highlights } from "app/Scenes/SellWithArtsy/Components/Highlights"
import { MeetTheSpecialists } from "app/Scenes/SellWithArtsy/Components/MeetTheSpecialists"
import { SpeakToTheTeam } from "app/Scenes/SellWithArtsy/Components/SpeakToTheTeam"
import { Testimonials } from "app/Scenes/SellWithArtsy/Components/Testimonials"
import { WaysWeSell } from "app/Scenes/SellWithArtsy/Components/WaysWeSell"
import { GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { useSwitchStatusBarStyle } from "app/utils/useStatusBarStyle"
import { Button, Screen } from "palette"
import { useEffect } from "react"
import { ScrollView, StatusBarStyle } from "react-native"
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
  subject: "Submit an Artwork",
}

interface SellWithArtsyHomeProps {
  recentlySoldArtworks?: SellWithArtsyHome_recentlySoldArtworksTypeConnection$data
  me?: SellWithArtsyHome_me$data
}

export const SellWithArtsyHome: React.FC<SellWithArtsyHomeProps> = ({
  recentlySoldArtworks,
  me,
}) => {
  const enableNewSWALandingPage = useFeatureFlag("AREnableNewSWALandingPage")

  const onFocusStatusBarStyle: StatusBarStyle = enableNewSWALandingPage
    ? "dark-content"
    : "light-content"
  const onBlurStatusBarStyle: StatusBarStyle = "dark-content"

  useSwitchStatusBarStyle(onFocusStatusBarStyle, onBlurStatusBarStyle)

  const { height: screenHeight, safeAreaInsets } = useScreenDimensions()
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

  const handleInquiryPress = (
    inquiryTrackingArgs?: TappedConsignmentInquiry,
    recipientEmail?: string,
    recipientName?: string
  ) => {
    if (inquiryTrackingArgs) {
      tracking.trackEvent(inquiryTrackingArgs)
    }
    navigate("/sell/inquiry", {
      passProps: {
        email: me?.email ?? "",
        name: me?.name ?? "",
        phone: me?.phone ?? "",
        userId: me?.internalID ?? undefined,
        recipientEmail: recipientEmail ?? null,
        recipientName: recipientName ?? null,
      },
    })
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
      <Flex
        flex={1}
        justifyContent="center"
        alignItems="center"
        minHeight={screenHeight}
        style={{ paddingTop: enableNewSWALandingPage ? safeAreaInsets.top : undefined }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Flex pb={6}>
            <Header onConsignPress={handleConsignPress} onInquiryPress={handleInquiryPress} />

            <Spacer y={4} />

            {enableNewSWALandingPage && (
              <Join separator={<Spacer y={4} />}>
                <Highlights />
                <WaysWeSell />
              </Join>
            )}
            {enableNewSWALandingPage && <Spacer y={6} />}

            <HowItWorks onConsignPress={handleConsignPress} />
            {enableNewSWALandingPage && <Spacer y={2} />}
            <Spacer y={4} />

            {enableNewSWALandingPage && (
              <Join separator={<Spacer y={6} />}>
                <SpeakToTheTeam onInquiryPress={handleInquiryPress} />
                <MeetTheSpecialists onInquiryPress={handleInquiryPress} />
              </Join>
            )}
            {enableNewSWALandingPage && <Spacer y={6} />}
            {enableNewSWALandingPage && <CollectorsNetwork />}
            {enableNewSWALandingPage && <Spacer y={6} />}
            <SellWithArtsyRecentlySold recentlySoldArtworks={recentlySoldArtworks!} />

            {enableNewSWALandingPage && (
              <Join separator={<Spacer y={6} />}>
                <></>
                <Testimonials />
                <FAQSWA />
              </Join>
            )}

            <Spacer y={4} />
            {enableNewSWALandingPage && <Spacer y={2} />}

            {!enableNewSWALandingPage && <WhySellWithArtsy />}

            {!enableNewSWALandingPage && (
              <>
                <Spacer y={4} />
                <Flex mx={2}>
                  <Button
                    testID="footer-cta"
                    variant="fillDark"
                    block
                    onPress={() => handleConsignPress(consignArgs)}
                    haptic
                  >
                    Submit an Artwork
                  </Button>
                </Flex>
                <Spacer y={4} />
              </>
            )}

            <Footer onConsignPress={handleConsignPress} />
            {enableNewSWALandingPage && <Spacer y={4} />}
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
