import { tappedConsign, TappedConsignArgs, TappedConsignmentInquiry } from "@artsy/cohesion"
import { Flex, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { SellWithArtsyHomeQuery } from "__generated__/SellWithArtsyHomeQuery.graphql"
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
import { useBottomTabsScrollToTop } from "app/utils/bottomTabsHelper"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { RefreshEvents, SELL_SCREEN_REFRESH_KEY } from "app/utils/refreshHelpers"
import { useSwitchStatusBarStyle } from "app/utils/useStatusBarStyle"
import { compact } from "lodash"
import { Suspense, useEffect, useReducer } from "react"
import { FlatList, StatusBarStyle } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { Footer } from "./Components/Footer"
import { Header } from "./Components/Header"
import { HowItWorks } from "./Components/HowItWorks"
import { SellWithArtsyRecentlySold } from "./Components/SellWithArtsyRecentlySold"

export const SellWithArtsyHome: React.FC = () => {
  const { draft } = GlobalStore.useAppState((state) => state.artworkSubmission)

  const submissionID = draft?.submissionID

  const [fetchKey, increaseFetchKey] = useReducer((state) => state + 1, 0)

  useEffect(() => {
    RefreshEvents.addListener(SELL_SCREEN_REFRESH_KEY, handleRefreshEvent)
    return () => {
      RefreshEvents.removeListener(SELL_SCREEN_REFRESH_KEY, handleRefreshEvent)
    }
  }, [])

  const handleRefreshEvent = () => {
    increaseFetchKey()
  }

  const { recentlySoldArtworks, me, submission } = useLazyLoadQuery<SellWithArtsyHomeQuery>(
    SellWithArtsyHomeScreenQuery,
    { submissionID: submissionID, includeSubmission: !!submissionID },
    {
      fetchPolicy: "store-and-network",
      fetchKey: fetchKey ?? 0,
    }
  )

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
    const route = "/sell/submissions/new"
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

  const data = compact([
    {
      key: "header",
      content: <Header submission={submission || null} />,
    },
    {
      key: "highlights",
      content: <Highlights />,
    },
    {
      key: "ways-we-sell",
      content: <WaysWeSell />,
    },
    {
      key: "how-it-works",
      content: <HowItWorks />,
    },
    {
      key: "faq-swa",
      content: <FAQSWA />,
    },
    {
      key: "meet-the-specialists",
      content: <MeetTheSpecialists onInquiryPress={handleInquiryPress} />,
    },
    {
      key: "collectors-network",
      content: <CollectorsNetwork />,
    },
    !!recentlySoldArtworks && {
      key: "recently-sold-artworks",
      content: <SellWithArtsyRecentlySold recentlySoldArtworks={recentlySoldArtworks} />,
    },
    {
      key: "testimonials",
      content: <Testimonials />,
    },
    {
      key: "speak-to-the-team",
      content: <SpeakToTheTeam onInquiryPress={handleInquiryPress} />,
    },
    {
      key: "footer",
      content: <Footer />,
    },
  ])

  return (
    <Flex flex={1}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => item.content}
        ItemSeparatorComponent={() => <Spacer y={6} />}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
      />

      <StickySWAHeader onConsignPress={handleConsignPress} onInquiryPress={handleInquiryPress} />
    </Flex>
  )
}

export const SellWithArtsyHomeScreenQuery = graphql`
  query SellWithArtsyHomeQuery($submissionID: ID, $includeSubmission: Boolean = false) {
    recentlySoldArtworks {
      ...SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection
    }
    me {
      internalID
      name
      email
      phone
    }
    submission(id: $submissionID) @include(if: $includeSubmission) {
      ...Header_submission
    }
  }
`

export const SellWithArtsyHomeQueryRenderer: React.FC = () => {
  return (
    <Suspense fallback={<SellWithArtsyHomePlaceholder />}>
      <SellWithArtsyHome />
    </Suspense>
  )
}

const SellWithArtsyHomePlaceholder: React.FC = () => {
  return (
    <Skeleton>
      <SkeletonBox
        style={{
          width: "100%",
          height: 400,
        }}
      />

      <Flex mx={2} mt={2}>
        <SkeletonText variant="xl" mb={1}>
          Sell art from your collection
        </SkeletonText>

        <SkeletonText variant="xs">
          With our global reach and art market expertise, our specialists will find the best sales
          option for your work.
        </SkeletonText>
      </Flex>
    </Skeleton>
  )
}
