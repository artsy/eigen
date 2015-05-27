// Glbal

extern NSString *const ARAnalyticsBackTapped;

// User properties

extern NSString *const ARAnalyticsAppUsageCountProperty;
extern NSString *const ARAnalyticsPriceRangeProperty;
extern NSString *const ARAnalyticsCollectorLevelProperty;

// Notifications

extern NSString *const ARAnalyticsEnabledNotificationsProperty;
extern NSString *const ARAnalyticsNotificationReceived;
extern NSString *const ARAnalyticsNotificationTapped;

// Keep track of some raw numbers re:total installs

extern NSString *const ARAnalyticsFreshInstall;

// Initial Splash Screen only, not trial splash

extern NSString *const ARAnalyticsTappedSignUp;
extern NSString *const ARAnalyticsStartedTrial;
extern NSString *const ARAnalyticsTappedLogIn;

// Sign up

extern NSString *const ARAnalyticsStartedSignup;
extern NSString *const ARAnalyticsAmendingDetails;
extern NSString *const ARAnalyticsCompletedSignUp;
extern NSString *const ARAnalyticsUserAlreadyExistedAtSignUp;

extern NSString *const ARAnalyticsDismissedActiveUserSignUp;

// Onboarding

extern NSString *const ARAnalyticsOnboardingStarted;
extern NSString *const ARAnalyticsOnboardingStartedCollectorLevel;
extern NSString *const ARAnalyticsOnboardingCompletedCollectorLevel;
extern NSString *const ARAnalyticsOnboardingStartedPersonalize;
extern NSString *const ARAnalyticsOnboardingSkippedPersonalize;
extern NSString *const ARAnalyticsOnboardingCompletedPersonalize;
extern NSString *const ARAnalyticsOnboardingStartedPriceRange;
extern NSString *const ARAnalyticsOnboardingCompletedPriceRange;
extern NSString *const ARAnalyticsOnboardingCompleted;

// Sign in

extern NSString *const ARAnalyticsStartedSignIn;
extern NSString *const ARAnalyticsUserSignedIn;
extern NSString *const ARAnalyticsSignInError;
extern NSString *const ARAnalyticsSignInTwitter;
extern NSString *const ARAnalyticsSignInFacebook;

// User creation abstracted from specifics like facebook / twitter / email

extern NSString *const ARAnalyticsUserCreationStarted;
extern NSString *const ARAnalyticsUserCreationCompleted;
extern NSString *const ARAnalyticsUserCreationUserError;
extern NSString *const ARAnalyticsUserCreationUnknownError;

extern NSString *const ARAnalyticsUserContextEmail;
extern NSString *const ARAnalyticsUserContextTwitter;
extern NSString *const ARAnalyticsUserContextFacebook;

// Inquiring

extern NSString *const ARAnalyticsStartedGalleryInquiry;
extern NSString *const ARAnalyticsStartedSpecialistInquiry;
extern NSString *const ARAnalyticsSubmittedInquiry;
extern NSString *const ARAnalyticsInquiryError;

// Trial

extern NSString *const ARAnalyticsShowTrialSplash;
extern NSString *const ARAnalyticsTappedHeroUnit;
extern NSString *const ARAnalyticsTappedMainNavigationItem;

// Sharing
extern NSString *const ARAnalyticsShare;

extern NSString *const ARAnalyticsHearted;
extern NSString *const ARAnalyticsUnhearted;

// Artwork

extern NSString *const ARAnalyticsArtworkView;
extern NSString *const ARAnalyticsArtworkViewInRoom;
extern NSString *const ARAnalyticsArtworkSave;
extern NSString *const ARAnalyticsArtworkUnsave;
extern NSString *const ARAnalyticsArtworkZoom;

// Artist

extern NSString *const ARAnalyticsArtistView;
extern NSString *const ARAnalyticsArtistFollow;
extern NSString *const ARAnalyticsArtistUnfollow;
extern NSString *const ARAnalyticsArtistTappedForSale;

// Gene

extern NSString *const ARAnalyticsGeneView;
extern NSString *const ARAnalyticsGeneFollow;

// Profile

extern NSString *const ARAnalyticsPartnerFollow;
extern NSString *const ARAnalyticsProfileView;

// Fair

extern NSString *const ARAnalyticsFairGuideView;
extern NSString *const ARAnalyticsFairGuideArtistSelected;
extern NSString *const ARAnalyticsFairGuideArtworkSelected;
extern NSString *const ARAnalyticsFairGuidePartnerShowSelected;
extern NSString *const ARAnalyticsFairGuideAllExhibitorsSelected;
extern NSString *const ARAnalyticsFairFeaturedLinkSelected;
extern NSString *const ARAnalyticsFairPostSelected;
extern NSString *const ARAnalyticsFairLeaveFromArtist;

// PartnerShow

extern NSString *const ARAnalyticsPartnerShowView;

// Search

extern NSString *const ARAnalyticsSearchClosed;
extern NSString *const ARAnalyticsSearchCleared;
extern NSString *const ARAnalyticsSearchStartedQuery;
extern NSString *const ARAnalyticsSearchItemSelected;

extern NSString *const ARAnalyticsFairSearch;
extern NSString *const ARAnalyticsFairSearchItemSelected;

// App Session

extern NSString *const ARAnalyticsTimePerSession;

// Loading gravity pages in-app
extern NSString *const ARAnalyticsOpenedArtsyGravityURL;

// Feed
extern NSString *const ARAnalyticsInitialFeedLoadTime;

// Error

extern NSString *const ARAnalyticsErrorFailedToGetFacebookCredentials;

// Explore

extern NSString *const ARAnalyticsExploreTap;

// Maps

extern NSString *const ARAnalyticsFairMapButtonTapped;
extern NSString *const ARAnalyticsFairMapAnnotationTapped;
extern NSString *const ARAnalyticsFairMapPartnerShowTapped;

// Auctions

extern NSString *const ARAnalyticsAuctionBidTapped;
