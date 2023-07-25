import { useToast } from "app/Components/Toast/toastHook"
import { GlobalStore } from "app/store/GlobalStore"
import { echoLaunchJson } from "app/utils/jsonFiles"

interface FeatureDescriptorCommonTypes {
  /** Provide a short description for the Dev Menu. */
  readonly description?: string

  /** Whether or not to show the feature flag in the Dev Menu. Consider also providing a description. */
  readonly showInDevMenu?: boolean
}

export interface FeatureDescriptorReadyForRelease {
  /**
   * Set readyForRelease to `true` when the feature is ready to be exposed outside of dev mode.
   * If an echo flag key is specified, the echo flag's value will be used after this
   * is set to `true`.
   */
  readonly readyForRelease: true
  /**
   * Provide an echo feature flag key to allow this feature to be toggled globally via echo.
   * Make sure to add the flag to echo before setting this value. Then run `./scripts/update-echo`.
   */
  readonly echoFlagKey: string
}

interface FeatureDescriptorNotReadyForRelease {
  /**
   * Set readyForRelease to `false` when the feature is still in progress.
   */
  readonly readyForRelease: false

  readonly echoFlagKey?: string
}

export type FeatureDescriptor = (
  | FeatureDescriptorReadyForRelease
  | FeatureDescriptorNotReadyForRelease
) &
  FeatureDescriptorCommonTypes

export type FeatureName = keyof typeof features

export const features: { [key: string]: FeatureDescriptor } = {
  AROptionsPriceTransparency: {
    readyForRelease: true,
    echoFlagKey: "AROptionsPriceTransparency",
    description: "Price Transparency",
  },
  AROptionsLotConditionReport: {
    readyForRelease: true,
    echoFlagKey: "AROptionsLotConditionReport",
  },
  AREnableOrderHistoryOption: {
    readyForRelease: true,
    echoFlagKey: "AREnableOrderHistoryOption",
    description: "Enable Order History in settings",
  },
  AREnableQueriesPrefetching: {
    readyForRelease: true,
    description: "Enable query prefetching",
    echoFlagKey: "AREnableQueriesPrefetching",
  },
  ARDarkModeSupport: {
    readyForRelease: false,
    description: "Support dark mode",
  },
  AREnablePriceEstimateRange: {
    readyForRelease: false,
    description: "Enable My Collection Price Estimate Range",
    showInDevMenu: false,
  },
  AREnableNewOpaqueImageComponent: {
    readyForRelease: true,
    description: "Enable New Image Component",
    echoFlagKey: "AREnableNewOpaqueImageComponent",
  },
  AREnableConversationalBuyNow: {
    readyForRelease: true,
    description: "Conversational Buy Now",
    echoFlagKey: "AREnableConversationalBuyNow",
  },
  AREnableArtworksFromNonArtsyArtists: {
    readyForRelease: true,
    description: "Enable My Collection artworks from non-Artsy artists",
    echoFlagKey: "AREnableArtworksFromNonArtsyArtists",
  },
  AREnableArtworksConnectionForAuction: {
    readyForRelease: true,
    description: "Use artworksConnection for Auction screen",
    echoFlagKey: "AREnableArtworksConnectionForAuction",
  },
  AREnableCollectionsInOnboarding: {
    readyForRelease: true,
    description: "Replace genes with collections in onboarding",
    echoFlagKey: "AREnableCollectionsInOnboarding",
  },
  AREnableNewRequestPriceEstimateLogic: {
    description: "Enable new request price estimate logic",
    readyForRelease: true,
    echoFlagKey: "AREnableNewRequestPriceEstimateLogic",
  },
  ARReorderSWAArtworkSubmissionFlow: {
    description: "Reorder SWA Artwork submission flow",
    readyForRelease: true,
    echoFlagKey: "ARReorderSWAArtworkSubmissionFlow",
  },
  AREnablePanOnStaticHeader: {
    description: "Enable Scroll/Pan on StaticHeader",
    readyForRelease: false,
  },
  AREnableSearchDiscoveryContentIOS: {
    description: "Display discovery content on Search tab on iOS",
    readyForRelease: true,
    echoFlagKey: "AREnableSearchDiscoveryContentIOS",
  },
  AREnableSearchDiscoveryContentAndroid: {
    description: "Display discovery content on Search tab on Android",
    readyForRelease: true,
    echoFlagKey: "AREnableSearchDiscoveryContentAndroid",
  },
  AREnableArtworkGridSaveIcon: {
    description: "Enable artwork grid save icon",
    readyForRelease: true,
    echoFlagKey: "AREnableArtworkGridSaveIcon",
  },
  AREnableAndroidImagesGallery: {
    description: "Enable images gallery on Android",
    readyForRelease: true,
    echoFlagKey: "AREnableAndroidImagesGallery",
  },
  AREnableLargeArtworkRailSaveIcon: {
    description: "Enable save icon for large artwork rails",
    readyForRelease: true,
    echoFlagKey: "AREnableLargeArtworkRailSaveIcon",
  },
  AREnableConsignmentInquiry: {
    description: "Enable Sell With Artsy Inquiry",
    readyForRelease: true,
    echoFlagKey: "AREnableConsignmentInquiry",
  },
  ARShowArtQuizApp: {
    description: "Show Art Quiz App",
    readyForRelease: true,
    echoFlagKey: "ARShowArtQuizApp",
  },
  AREnableMoneyFormattingInMyCollectionForm: {
    description: "Enable Money formatting in MyCollection Form",
    readyForRelease: true,
    echoFlagKey: "AREnableMoneyFormattingInMyCollectionForm",
  },
  AREnableBrowseMoreArtworksCard: {
    description: "Enable Browse All Artworks Card on Home Screen",
    readyForRelease: true,
    echoFlagKey: "AREnableBrowseMoreArtworksCard",
  },
  AREnableNewCollectionsRail: {
    description: "Enable New Collections Rail",
    readyForRelease: true,
    echoFlagKey: "AREnableNewCollectionsRail",
  },
  AREnableCuratorsPickRail: {
    description: "Enable Curators Pick Rail",
    readyForRelease: true,
    echoFlagKey: "AREnableCuratorsPickRail",
  },
  ARImpressionsTrackingHomeRailViews: {
    description: "Enable tracking rail views on home screen",
    readyForRelease: true,
    echoFlagKey: "ARImpressionsTrackingHomeRailViews",
  },
  AREnablePageableArtworkScreens: {
    description: "Enable pageable artwork screens",
    readyForRelease: false,
    showInDevMenu: true,
  },
  AREnableMyCollectionNotesField: {
    description: "Enable My Collection Notes Field",
    readyForRelease: true,
    echoFlagKey: "AREnableMyCollectionNotesField",
  },
  AREnableSWALandingPageMeetTheSpecialist: {
    description: "Enable MeetTheSpecialist on SWA Landing Page",
    readyForRelease: true,
    echoFlagKey: "AREnableSWALandingPageMeetTheSpecialist",
  },
  AREnableSWALandingPageTestimonials: {
    description: "Enable Testimonials on SWA Landing Page",
    readyForRelease: true,
    echoFlagKey: "AREnableSWALandingPageTestimonials",
  },
  AREnableInstantViewInRoom: {
    description: "Enable Instant View In Room",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableInstantViewInRoom",
  },
  AREnableSkeletonAnimation: {
    description: "Enable Skeleton Animation",
    readyForRelease: true,
    echoFlagKey: "AREnableSkeletonAnimation",
  },
  ARImpressionsTrackingHomeItemViews: {
    description: "Enable Tracking Items views on Home Screen",
    readyForRelease: true,
    echoFlagKey: "ARImpressionsTrackingHomeItemViews",
  },
  AREnableDoMoreOnArtsyRail: {
    description: "Enable Do More on Artsy Rail",
    readyForRelease: true,
    echoFlagKey: "AREnableDoMoreOnArtsyRail",
  },
  AREnableMeetYourNewAdvisorRail: {
    description: "Enable Meet your New Advisor Rail",
    readyForRelease: true,
    echoFlagKey: "AREnableMeetYourNewAdvisorRail",
  },
  AREnableArtworksLists: {
    readyForRelease: true,
    description: "Enable Artwork Lists",
    showInDevMenu: true,
    echoFlagKey: "AREnableArtworksLists",
  },
  AREnableNewAuctionsRailCard: {
    description: "Enable New Auctions Home Rail Card",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableNewAuctionsRailCard",
  },
  AREnableMyCollectionCollectedArtists: {
    description: "Enable Collected Artists in My Collection",
    readyForRelease: false,
    showInDevMenu: true,
  },
  AREnableLongPressOnArtworkCards: {
    description: "Enable Context Menu on artwork cards",
    readyForRelease: false,
    showInDevMenu: true,
    echoFlagKey: "AREnableLongPressOnArtworkCards",
  },
  AREnableShowsForYouLocation: {
    description: "Enable Shows For You Location",
    readyForRelease: false,
    showInDevMenu: true,
    echoFlagKey: "AREnableShowsForYouLocation",
  },
  AREnableGalleriesForYou: {
    description: "Enable Galleries For You",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableGalleriesForYou",
  },
  AREnablePriceControlForCreateAlertFlow: {
    description: "Enable Inline price control for Create Alert modal flow",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnablePriceControlForCreateAlertFlow",
  },
  AREnableAdditionalSiftAndroidTracking: {
    description: "Send additional events to Sift on Android",
    readyForRelease: true,
    showInDevMenu: true,
    echoFlagKey: "AREnableAdditionalSiftAndroidTracking",
  },
  ARShowCollectedArtistOnboarding: {
    description: "Show Collected Artist Onboarding",
    readyForRelease: false,
    showInDevMenu: true,
  },
}

export interface DevToggleDescriptor {
  /**
   * Provide a short description for the Dev Menu.
   */
  readonly description: string
  /**
   * Provide some action/thunk to run when the toggle value is changed.
   */
  readonly onChange?: (value: boolean, { toast }: { toast: ReturnType<typeof useToast> }) => void
}

export type DevToggleName = keyof typeof devToggles

export const devToggles: { [key: string]: DevToggleDescriptor } = {
  DTShowQuickAccessInfo: {
    description: "Quick Access Info",
  },
  DTDisableEchoRemoteFetch: {
    description: "Disable fetching remote echo",
    onChange: (value, { toast }) => {
      if (value) {
        GlobalStore.actions.artsyPrefs.echo.setEchoState(echoLaunchJson())
        toast.show("Loaded bundled echo config", "middle")
      } else {
        GlobalStore.actions.artsyPrefs.echo.fetchRemoteEcho()
        toast.show("Fetched remote echo config", "middle")
      }
    },
  },
  DTShowAnalyticsVisualiser: {
    description: "Analytics visualiser",
  },
  DTLocationDetectionVisialiser: {
    description: "Location detection visualiser",
  },
  DTShowNavigationVisualiser: {
    description: "Navigation visualiser",
  },
  DTEasyMyCollectionArtworkCreation: {
    description: "MyCollection artworks easy add",
  },
  DTMyCollectionDeleteAllArtworks: {
    description: "MyCollection delete all artworks",
  },
  DTShowWebviewIndicator: {
    description: "Webview indicator",
  },
  DTShowInstagramShot: {
    description: "Instagram viewshot debug",
  },
  DTCaptureExceptionsInSentryOnDev: {
    description: "Capture exceptions in Sentry on DEV",
  },
  DTFPSCounter: {
    description: "FPS counter",
  },
  DTUseProductionUnleash: {
    description: "Use Production Unleash",
  },
  DTShowErrorInLoadFailureView: {
    description: "Show error in load failure view",
  },
  DTEnableNewImageLabel: {
    description: "Show a label on new OpaqueImageView",
  },
}

export const isDevToggle = (name: FeatureName | DevToggleName): name is DevToggleName => {
  return Object.keys(devToggles).includes(name as string)
}
