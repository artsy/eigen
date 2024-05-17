import { tappedConsign, TappedConsignArgs, TappedConsignmentInquiry } from "@artsy/cohesion"
import { Join, Screen, Spacer } from "@artsy/palette-mobile"
import { SellWithArtsyHomeQuery } from "__generated__/SellWithArtsyHomeQuery.graphql"
import { SellWithArtsyHome_me$data } from "__generated__/SellWithArtsyHome_me.graphql"
import { SellWithArtsyHome_recentlySoldArtworksTypeConnection$data } from "__generated__/SellWithArtsyHome_recentlySoldArtworksTypeConnection.graphql"
import { CollectorsNetwork } from "app/Scenes/SellWithArtsy/Components/CollectorsNetwork"
import { FAQSWA } from "app/Scenes/SellWithArtsy/Components/FAQSWA"
import { Highlights } from "app/Scenes/SellWithArtsy/Components/Highlights"
import { MeetTheSpecialists } from "app/Scenes/SellWithArtsy/Components/MeetTheSpecialists"
import { SpeakToTheTeam } from "app/Scenes/SellWithArtsy/Components/SpeakToTheTeam"
import { StickySWAHeader } from "app/Scenes/SellWithArtsy/Components/StickySWAHeader"
import { Testimonials } from "app/Scenes/SellWithArtsy/Components/Testimonials"
import { WaysWeSell } from "app/Scenes/SellWithArtsy/Components/WaysWeSell"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useBottomTabsScrollToTop } from "app/utils/bottomTabsHelper"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { useSwitchStatusBarStyle } from "app/utils/useStatusBarStyle"
import { useEffect } from "react"
import { ScrollView, StatusBarStyle } from "react-native"
import { createFragmentContainer, Environment, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { Footer } from "./Components/Footer"
import { Header } from "./Components/Header"
import { HowItWorks } from "./Components/HowItWorks"
import { SellWithArtsyRecentlySold } from "./Components/SellWithArtsyRecentlySold"

interface SellWithArtsyHomeProps {
  recentlySoldArtworks?: SellWithArtsyHome_recentlySoldArtworksTypeConnection$data
  me?: SellWithArtsyHome_me$data
}

export const SellWithArtsyHome: React.FC<SellWithArtsyHomeProps> = ({
  recentlySoldArtworks,
  me,
}) => {
  const onFocusStatusBarStyle: StatusBarStyle = "dark-content"
  const onBlurStatusBarStyle: StatusBarStyle = "dark-content"

  const scrollViewRef = useBottomTabsScrollToTop("sell")

  useSwitchStatusBarStyle(onFocusStatusBarStyle, onBlurStatusBarStyle)

  const enableNewSubmissionFlow = useFeatureFlag("AREnableNewSubmissionFlow")

  const tracking = useTracking()

  const handleConsignPress = (tappedConsignArgs: TappedConsignArgs) => {
    tracking.trackEvent(tappedConsign(tappedConsignArgs))

    if (enableNewSubmissionFlow) {
      navigate("/sell/submissions/new")
      return
    }

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
    if (enableNewSubmissionFlow) {
      return
    }

    return () => {
      GlobalStore.actions.artworkSubmission.submission.resetSessionState()
      GlobalStore.actions.artworkSubmission.submission.setPhotosForMyCollection({
        photos: [],
      })
      GlobalStore.actions.artworkSubmission.submission.setSubmissionIdForMyCollection("")
    }
  }, [])

  return (
    <Screen>
      <Screen.Body fullwidth>
        <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef}>
          <Join separator={<Spacer y={6} />}>
            <Header />

            <Highlights />

            <WaysWeSell />

            <HowItWorks />

            <FAQSWA />

            <MeetTheSpecialists onInquiryPress={handleInquiryPress} />

            <CollectorsNetwork />

            {!!recentlySoldArtworks && (
              <SellWithArtsyRecentlySold recentlySoldArtworks={recentlySoldArtworks} />
            )}

            <Testimonials />

            <SpeakToTheTeam onInquiryPress={handleInquiryPress} />

            <Footer />
          </Join>

          <Spacer y={2} />
        </ScrollView>

        <StickySWAHeader onConsignPress={handleConsignPress} onInquiryPress={handleInquiryPress} />
      </Screen.Body>
    </Screen>
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
  environment?: Environment
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
      environment={environment || getRelayEnvironment()}
      variables={{}}
      query={SellWithArtsyHomeScreenQuery}
      render={renderWithPlaceholder({
        Container: SellWithArtsyHomeContainer,
        renderPlaceholder: () => <SellWithArtsyHome recentlySoldArtworks={undefined} />,
      })}
    />
  )
}
