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

extern NSString *const ARAnalyticsStartedInquiry;
extern NSString *const ARAnalyticsCancelledInquiry;
extern NSString *const ARAnalyticsSubmittedInquiry;

extern NSString *const ARAnalyticsInquiryContextSpecialist;
extern NSString *const ARAnalyticsInquiryContextGallery;

// Trial

extern NSString *const ARAnalyticsShowTrialSplash;
extern NSString *const ARAnalyticsTappedHeroUnit;

// Sharing
extern NSString *const ARAnalyticsShareStarted;
extern NSString *const ARAnalyticsShareCompleted;
extern NSString *const ARAnalyticsShareCancelled;

extern NSString *const ARAnalyticsHearted;
extern NSString *const ARAnalyticsUnhearted;

// Artwork

extern NSString *const ARAnalyticsArtworkView;
extern NSString *const ARAnalyticsArtworkViewInRoom;
extern NSString *const ARAnalyticsArtworkFavorite;

// Artist

extern NSString *const ARAnalyticsArtistView;
extern NSString *const ARAnalyticsArtistFollow;
extern NSString *const ARAnalyticsArtistTappedForSale;

// Gene

extern NSString *const ARAnalyticsGeneView;
extern NSString *const ARAnalyticsGeneFollow;

// Profile

extern NSString *const ARAnalyticsProfileFollow;
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

// Menu

extern NSString *const ARAnalyticsShowMenu;
extern NSString *const ARAnalyticsMenuTappedHome;
extern NSString *const ARAnalyticsMenuTappedFavorites;
extern NSString *const ARAnalyticsMenuTappedBrowse;
extern NSString *const ARAnalyticsMenuTappedSignUp;
extern NSString *const ARAnalyticsMenuTappedFeature;

// Search

extern NSString *const ARAnalyticsSearchOpened;
extern NSString *const ARAnalyticsSearchStartedQuery;
extern NSString *const ARAnalyticsSearchItemSelected;

// App Session

extern NSString *const ARAnalyticsTimePerSession;

// Loading gravity pages in-app
extern NSString *const ARAnalyticsOpenedArtsyGravityURL;

// Feed
extern NSString *const ARAnalyticsInitialFeedLoadTime;

// Error

extern NSString *const ARAnalyticsErrorFailedToGetFacebookCredentials;


// Maps
extern NSString *const ARAnalyticsFairMapButtonTapped;
extern NSString *const ARAnalyticsFairMapAnnotationTapped;
extern NSString *const ARAnalyticsFairMapPartnerShowTapped;

// Auctions
extern NSString *const ARAnalyticsAuctionBidTapped;
