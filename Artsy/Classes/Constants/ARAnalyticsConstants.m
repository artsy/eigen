#import "ARAnalyticsConstants.h"

NSString *const ARAnalyticsAppUsageCountProperty = @"app_launched_count";
NSString *const ARAnalyticsCollectorLevelProperty = @"collector_level";
NSString *const ARAnalyticsPriceRangeProperty = @"collector_price_range";

NSString *const ARAnalyticsEnabledNotificationsProperty = @"has_enabled_notifications";
NSString *const ARAnalyticsNotificationReceived = @"notification_received";
NSString *const ARAnalyticsNotificationTapped = @"notification_tapped";

NSString *const ARAnalyticsFreshInstall = @"first_user_install";

NSString *const ARAnalyticsTappedSignUp = @"tapped_sign_up";
NSString *const ARAnalyticsStartedTrial = @"tapped_start_trial";
NSString *const ARAnalyticsTappedLogIn = @"tapped_log_in";

NSString *const ARAnalyticsStartedSignup = @"started_sign_up";
NSString *const ARAnalyticsAmendingDetails = @"editing_sign_up";
NSString *const ARAnalyticsCompletedSignUp = @"signed_up";
NSString *const ARAnalyticsUserAlreadyExistedAtSignUp = @"user_already_existed_at_signup";

NSString *const ARAnalyticsDismissedActiveUserSignUp = @"dismissed_active_user_signup";

NSString *const ARAnalyticsStartedSignIn = @"started_sign_in";
NSString *const ARAnalyticsUserSignedIn = @"user_connected";
NSString *const ARAnalyticsSignInError = @"sign_in_error";
NSString *const ARAnalyticsSignInTwitter = @"sign_in_twitter";
NSString *const ARAnalyticsSignInFacebook = @"sign_in_facebook";

NSString *const ARAnalyticsUserCreationStarted = @"artsy_user_creation_started";
NSString *const ARAnalyticsUserCreationCompleted = @"artsy_user_creation_completed";
NSString *const ARAnalyticsUserCreationUserError = @"artsy_user_creation_user_error";
NSString *const ARAnalyticsUserCreationUnknownError = @"artsy_user_error";

NSString *const ARAnalyticsUserContextEmail = @"email";
NSString *const ARAnalyticsUserContextTwitter = @"twitter";
NSString *const ARAnalyticsUserContextFacebook = @"facebook";

NSString *const ARAnalyticsStartedInquiry = @"user_started_inquiry";
NSString *const ARAnalyticsCancelledInquiry = @"user_cancelled_inquiry";
NSString *const ARAnalyticsSubmittedInquiry = @"user_submitted_inquiry";
NSString *const ARAnalyticsInquiryContextSpecialist = @"inquiry_specialist";
NSString *const ARAnalyticsInquiryContextGallery = @"inquiry_gallery";

NSString *const ARAnalyticsOnboardingStarted = @"user_started_onboarding";
NSString *const ARAnalyticsOnboardingStartedCollectorLevel = @"user_started_collector_level";
NSString *const ARAnalyticsOnboardingCompletedCollectorLevel = @"user_completed_collector_level";
NSString *const ARAnalyticsOnboardingStartedPersonalize = @"user_started_personalize";
NSString *const ARAnalyticsOnboardingSkippedPersonalize = @"user_skipped_personalize";
NSString *const ARAnalyticsOnboardingCompletedPersonalize = @"user_completed_personalize";
NSString *const ARAnalyticsOnboardingStartedPriceRange = @"user_started_price_range";
NSString *const ARAnalyticsOnboardingCompletedPriceRange = @"user_completed_price_range";
NSString *const ARAnalyticsOnboardingCompleted = @"user_completed_onboarding";

NSString *const ARAnalyticsShowTrialSplash = @"user_trial_splash_presented";

NSString *const ARAnalyticsTappedHeroUnit = @"tapped_hero_unit";
NSString *const ARAnalyticsTappedMainNavigationItem = @"view main navigation item";

NSString *const ARAnalyticsArtworkView = @"artwork_view";
NSString *const ARAnalyticsArtworkViewInRoom = @"artwork_view_in_room";
NSString *const ARAnalyticsArtworkFavorite = @"artwork_favorite";

NSString *const ARAnalyticsPartnerShowView = @"partner_show_view";

NSString *const ARAnalyticsShareStarted = @"share_started";
NSString *const ARAnalyticsShareCompleted = @"share_completed";
NSString *const ARAnalyticsShareCancelled = @"share_cancelled";

NSString *const ARAnalyticsHearted = @"user_hearted";
NSString *const ARAnalyticsUnhearted = @"user_unhearted";

NSString *const ARAnalyticsProfileView = @"profile_view";
NSString *const ARAnalyticsProfileFollow = @"profile_favorite";

NSString *const ARAnalyticsFairLeaveFromArtist = @"fair_leave_from_artist";
NSString *const ARAnalyticsFairGuideView = @"fair_guide_view";
NSString *const ARAnalyticsFairGuidePartnerShowSelected = @"fair_selected_partner_show";
NSString *const ARAnalyticsFairGuideArtworkSelected = @"fair_selected_artwork";
NSString *const ARAnalyticsFairGuideArtistSelected = @"fair_selected_artist";
NSString *const ARAnalyticsFairGuideAllExhibitorsSelected = @"fair_selected_all_exhibitors";
NSString *const ARAnalyticsFairFeaturedLinkSelected = @"fair_selected_featured_link";
NSString *const ARAnalyticsFairPostSelected = @"fair_selected_post";

NSString *const ARAnalyticsArtistView = @"artist_view";
NSString *const ARAnalyticsArtistFollow = @"artist_favorite";
NSString *const ARAnalyticsArtistTappedForSale = @"artist_tapped_for_sale";

NSString *const ARAnalyticsGeneView = @"gene_view";
NSString *const ARAnalyticsGeneFollow = @"gene_favorite";

NSString *const ARAnalyticsShowMenu = @"user_opened_menu";
NSString *const ARAnalyticsMenuTappedHome = @"user_menu_tapped_home";
NSString *const ARAnalyticsMenuTappedFavorites = @"user_menu_tapped_favorites";
NSString *const ARAnalyticsMenuTappedBrowse = @"user_menu_tapped_browse";
NSString *const ARAnalyticsMenuTappedSignUp = @"user_menu_tapped_signup";
NSString *const ARAnalyticsMenuTappedFeature = @"user_menu_tapped_feature";

NSString *const ARAnalyticsSearchOpened = @"search_opened";
NSString *const ARAnalyticsSearchStartedQuery = @"seach_started";
NSString *const ARAnalyticsSearchItemSelected = @"seach_item_selected";

NSString *const ARAnalyticsTimePerSession = @"app_session_time";

NSString *const ARAnalyticsOpenedArtsyGravityURL = @"has_shown_gravity_url";

NSString *const ARAnalyticsErrorFailedToGetFacebookCredentials = @"error_failed_to_get_facebook_credentials";

NSString *const ARAnalyticsInitialFeedLoadTime = @"initial_feed_load_time";

NSString *const ARAnalyticsFairMapButtonTapped = @"fair_tapped_map_button";
NSString *const ARAnalyticsFairMapAnnotationTapped = @"fair_tapped_map_annotation";
NSString *const ARAnalyticsFairMapPartnerShowTapped = @"fair_tapped_map_partner_show";

NSString *const ARAnalyticsAuctionBidTapped = @"auction_tapped_bid";

