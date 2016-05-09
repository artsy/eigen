// MARK: Formatter Exempt

#import "ARAppDelegate+Analytics.h"
#import <ARAnalytics/ARAnalytics.h>
#import <ARAnalytics/ARDSL.h>
#import "ARAnalyticsConstants.h"
#import <HockeySDK_Source/BITHockeyManager.h>
#import <Mantle/NSDictionary+MTLManipulationAdditions.h>
#import <Adjust/Adjust.h>
#import <AFNetworking/AFNetworking.h>

#import "AROptions.h"
#import "Artsy-Swift.h"

#import "Artist.h"
#import "Artwork.h"
#import "ARDefaults.h"
#import "ARUserManager.h"
#import "ARTopMenuNavigationDataSource.h"
#import "Fair.h"
#import "FairOrganizer.h"
#import "FeaturedLink.h"
#import "Gene.h"
#import "Partner.h"
#import "PartnerShow.h"
#import "Profile.h"
#import "ARFairMapAnnotation.h"
#import "ARAnalyticsVisualizer.h"
#import "ARAnalyticsPapertrail.h"

// View Controllers
#import "ARFairGuideViewController.h"
#import "ARFairArtistViewController.h"
#import "ARShowViewController.h"
#import "ARProfileViewController.h"
#import "ARAppSearchViewController.h"
#import "AROnboardingGeneTableController.h"
#import "ARInquireForArtworkViewController.h"
#import "ARArtworkViewController.h"
#import "AROnboardingArtistTableController.h"
#import "ARInternalMobileWebViewController.h"
#import "ARSignUpSplashViewController.h"
#import "ARLoginViewController.h"
#import "ARSignUpActiveUserViewController.h"
#import "ARCreateAccountViewController.h"
#import "ARGeneViewController.h"
#import "ARPersonalizeViewController.h"
#import "ARViewInRoomViewController.h"
#import "AROnboardingMoreInfoViewController.h"
#import "ARArtistViewController.h"
#import "ARFairViewController.h"
#import "ARFairSearchViewController.h"
#import "ARCollectorStatusViewController.h"
#import "ARSharingController.h"
#import "ARCollectorStatusViewController.h"
#import "ARFavoritesViewController.h"
#import "ARBrowseCategoriesViewController.h"
#import "ARArtistBiographyViewController.h"
#import "ARFairMapViewController.h"
#import "ARBrowseViewController.h"
#import "ARSearchViewController.h"
#import "ARNavigationController.h"
#import "ARHeroUnitViewController.h"

// Views
#import "ARHeartButton.h"
#import "ARFairMapAnnotationCallOutView.h"
#import "ARSiteHeroUnitView.h"
#import "ARButtonWithImage.h"
#import "ARTabContentView.h"
#import "ARArtworkView.h"
#import "ARSwitchView.h"
#import "ARSwitchView+Favorites.h"
#import "ARSwitchView+Artist.h"
#import "ARAppStatus.h"

// Models
#import "ARFairFavoritesNetworkModel+Private.h"
#import <Keys/ArtsyKeys.h>

// Note the Eigen Schema:
// https://docs.google.com/spreadsheets/u/1/d/1bLbeOgVFaWzLSjxLOBDNOKs757-zBGoLSM1lIz3OPiI/edit#gid=497747862

@implementation ARAppDelegate (Analytics)

- (void)lookAtURLForAnalytics:(NSURL *)url
{
    [Adjust appWillOpenUrl:url];
}

- (void)setupAnalytics
{
    ArtsyKeys *keys = [[ArtsyKeys alloc] init];

    NSString *segmentWriteKey = keys.segmentProductionWriteKey;
    NSString *environment = ADJEnvironmentProduction;

    if (ARAppStatus.isBetaOrDev) {
        segmentWriteKey = keys.segmentDevWriteKey;
        environment = ADJEnvironmentSandbox;
    }

    if (ARAppStatus.isRunningTests == NO) {
        // Skipping ARAnalytics because Adjust has its own expectations
        // around event names being < 6 chars
        ADJConfig *adjustConfig = [ADJConfig configWithAppToken:keys.adjustProductionAppToken environment:environment];
        [Adjust appDidLaunch:adjustConfig];
    }

    if ([AROptions boolForOption:AROptionsShowAnalyticsOnScreen]) {
        ARAnalyticsVisualizer *visualizer = [ARAnalyticsVisualizer new];
        [ARAnalytics setupProvider:visualizer];
    }

    if (![[ARUserManager sharedManager] hasExistingAccount]) {
        // This data is only meant for future sign-ups, so trial users only.
        NSString *documentsDir = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES)[0];
        NSURL *papertrailURL = [NSURL fileURLWithPath:[documentsDir stringByAppendingPathComponent:@"papertrail.json"]];
        ARAnalyticsPapertrail *papertrail = [[ARAnalyticsPapertrail alloc] initWithDestinationURL:papertrailURL];
        [ARAnalytics setupProvider:papertrail];
    }

#if DEBUG
    BITHockeyManager *hockey = [BITHockeyManager sharedHockeyManager];
    hockey.disableUpdateManager = YES;
    hockey.disableCrashManager = YES;
#endif

    ARAnalyticsEventShouldFireBlock heartedShouldFireBlock = ^BOOL(id controller, NSArray *parameters) {
        ARHeartButton *sender = parameters.firstObject;
        return sender.isHearted;
    };

    ARAnalyticsEventShouldFireBlock unheartedShouldFireBlock = ^BOOL(id controller, NSArray *parameters) {
        return !heartedShouldFireBlock(controller, parameters);
    };

    [ARAnalytics setupWithAnalytics:
    @{
        ARHockeyAppBetaID: @"306e66bde3cb91a2043f2606cf335700",
        ARHockeyAppLiveID: @"d7bceb80c6fa1e83e787b3919c749311",
        ARSegmentioWriteKey: segmentWriteKey,
    } configuration:
    @{
        ARAnalyticsTrackedEvents:
            @[
                @{
                    ARAnalyticsClass: ARFairGuideViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairGuideView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairGuideViewController *controller, NSArray *_) {
                                return @{
                                     @"profile_id" : controller.fair.organizer.profileID ?: @"",
                                     @"fair_id" : controller.fair.fairID ?: @"",
                                 };
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairArtistViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairLeaveFromArtist,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(addArtistOnArtsyButton)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairArtistViewController *controller, NSArray *_) {
                                return @{
                                    @"artist_id" : controller.artist.artistID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairLeaveFromArtist,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(addArtistOnArtsyButton)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairArtistViewController *controller, NSArray *_) {
                                return @{
                                    @"followed": controller.isFollowingArtist ? @"yes" : @"no",
                                    @"artist_id" : controller.artist.artistID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairMapButtonTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(mapButtonTapped)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairArtistViewController *controller, NSArray *_) {
                                FairOrganizer *organizer = controller.fair.organizer;
                                return @{
                                    @"artist_id" : controller.artist.artistID ?: @"",
                                    @"profile_id" : organizer.fairOrganizerID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @""
                                };
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARShowViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsPartnerShowView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARShowViewController *controller, NSArray *_) {
                                return controller.dictionaryForAnalytics;
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairMapButtonTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(handleMapButtonPress:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARShowViewController *controller, NSArray *_) {
                                return controller.dictionaryForAnalytics;
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsPartnerFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowShow:)),
                            ARAnalyticsShouldFire: ^BOOL(ARShowViewController *controller, NSArray *_) {
                                return controller.isFollowing == YES;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARShowViewController *controller, NSArray *_) {
                                return @{
                                    @"gallery_slug" : controller.show.partner.partnerID ?: @"",
                                };
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARHeartButton.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsHearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(setHearted:animated:)),
                            ARAnalyticsShouldFire: ^BOOL(ARHeartButton *button, NSArray *_) {
                                return button.hearted;
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsUnhearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(setHearted:animated:)),
                            ARAnalyticsShouldFire: ^BOOL(ARHeartButton *button, NSArray *_) {
                                return !button.hearted;
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARProfileViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsProfileView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loadMartsyView)),
                            ARAnalyticsProperties: ^NSDictionary*(ARProfileViewController *controller, NSArray *_) {
                                return @{
                                    @"profile_id" : controller.profileID ?: @"",
                                    @"user_id" : [[ARUserManager sharedManager] currentUser].userID ?: @""
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairFavoritesNetworkModel.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairGuidePartnerShowSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(handleShowButtonPress:fair:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairFavoritesNetworkModel *model, NSArray *parameters) {
                                PartnerShow *show = parameters[0];
                                Fair *fair = parameters[1];
                                return @{
                                    @"profile_id" : fair.organizer.profileID ?: @"",
                                    @"fair_id" : fair.fairID ?: @"",
                                    @"partner_show_id" : show.showID ?: @"",
                                    @"partner_id" : show.partner.partnerID ?: @""
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairGuideArtworkSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(handleArtworkButtonPress:fair:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairFavoritesNetworkModel *model, NSArray *parameters) {
                                Artwork *artwork = parameters[0];
                                Fair *fair = parameters[1];
                                return @{
                                    @"profile_id" : fair.organizer.profileID ?: @"",
                                    @"fair_id" : fair.fairID ?: @"",
                                    @"artwork_id" : artwork.artworkID ?: @"",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairGuideArtistSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(handleArtistButtonPress:fair:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairFavoritesNetworkModel *model, NSArray *parameters) {
                                Artist *artist = parameters[0];
                                Fair *fair = parameters[1];
                                return @{
                                    @"profile_id" : fair.organizer.profileID ?: @"",
                                    @"fair_id" : fair.fairID ?: @"",
                                    @"artist_id" : artist.artistID ?: @"",
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARAppSearchViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsSearchItemSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(selectedResult:ofType:fromQuery:)),
                            ARAnalyticsShouldFire: ^BOOL(ARAppSearchViewController *controller, NSArray *parameters) {
                                NSString *type = parameters[1];
                                return type != nil;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARAppSearchViewController *controller, NSArray *parameters) {
                                SearchResult *result = parameters[0];
                                NSString *type = parameters[1];
                                NSString *query = parameters[2];

                                return @{
                                    type : result.modelID ?: @"",
                                    @"query" : query ?: @"",
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARArtworkViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsStartedGalleryInquiry,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedContactGallery)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters) {
                                return @{
                                    @"artwork_slug": controller.artwork.artworkID ?: @"",
                                    @"artist_slug": controller.artwork.artist.artistID ?: @"",
                                    @"partner_slug": controller.artwork.partner.partnerID ?: @"",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkSave,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedArtworkFavorite:)),
                            ARAnalyticsShouldFire: ^BOOL(ARArtworkViewController *controller, NSArray *parameters) {
                                ARHeartButton *sender = parameters.firstObject;
                                return sender.isHearted == YES;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                return @{
                                    @"artist_slug": controller.artwork.artist.artistID ?: @"",
                                    @"artwork_slug" : controller.artwork.artworkID ?: @"",
                                    @"source_screen" : @"Artwork"
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkUnsave,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedArtworkFavorite:)),
                            ARAnalyticsShouldFire: ^BOOL(ARArtworkViewController *controller, NSArray *parameters) {
                                ARHeartButton *sender = parameters.firstObject;
                                return sender.isHearted == NO;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                return @{
                                    @"artist_slug": controller.artwork.artist.artistID ?: @"",
                                    @"artwork_slug" : controller.artwork.artworkID ?: @"",
                                    @"source_screen" : @"Artwork"
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsTapPartnerName,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedOpenArtworkPartner)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                return @{
                                    @"gallery_slug": controller.artwork.partner.partnerID ?: @"",
                                };
                            },

                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairMapButtonTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedArtworkViewInMap)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *_){
                                return @{@"artwork_id" : controller.artwork.artworkID ?: @""};
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsAuctionBidTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(bidCompleted:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                SaleArtwork *saleArtwork = parameters.firstObject;
                                return @{
                                    @"artwork_slug": controller.artwork.artworkID ?: @"",
                                    @"artist_slug": controller.artwork.artist.artistID ?: @"",
                                    @"auction_id": saleArtwork.auction.saleID ?: @"",
                                    @"context_type" : @"artwork_page"
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsAuctionHowBiddingWorks,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedAuctionInfo)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                return @{
                                    @"artwork_id" : controller.artwork.artworkID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkZoom,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(tappedTileableImagePreview),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                return @{
                                    @"artwork_slug" : controller.artwork.artworkID ?: @"",
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARInquireForArtworkViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsInquiryError,
                            ARAnalyticsSelectorName: @"inquiryFailed:",
                            ARAnalyticsProperties: ^NSDictionary*(ARInquireForArtworkViewController *controller, NSArray *parameters) {

                                NSError *error = [parameters firstObject];
                                NSData *data = error.userInfo[AFNetworkingOperationFailingURLResponseDataErrorKey];
                                NSDictionary *recoverySuggestion;
                                NSString *responseString = @"";
                                if (data) {
                                    recoverySuggestion = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
                                    responseString = [recoverySuggestion objectForKey:@"message"];
                                }
        
                                return @{
                                    @"errors" : ([error localizedDescription] ?: [error description]) ?: @"",
                                    @"response" : responseString ?: @"",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSubmittedInquiry,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(inquiryCompleted:)),
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: AROnboardingArtistTableController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistUnfollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(unfollowArtist:)),
                            ARAnalyticsProperties:^NSDictionary*(AROnboardingArtistTableController *controller, NSArray *parameters) {
                                Artist *artist = parameters[0];
                                return @{
                                    @"source_screen": @"Onboarding",
                                    @"artist_slug" : artist.artistID ?: @"",
                                };
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARSignUpActiveUserViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInWebCredentials,
                            ARAnalyticsSelectorName: @"loggedInWithSharedCredentials",
                            ARAnalyticsProperties: ^NSDictionary *(ARSignUpActiveUserViewController *controller, NSArray *_) {
                                return @{@"active_user": @"true"};
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsTappedLogIn,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(goToLogin:),
                            ARAnalyticsProperties: ^NSDictionary *(ARSignUpActiveUserViewController *controller, NSArray *_) {
                                return @{@"active_user": @"true"};
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsTappedSignUp,
                            ARAnalyticsSelectorName: @"signUpWithEmail:",
                            ARAnalyticsProperties: ^NSDictionary *(ARSignUpActiveUserViewController *controller, NSArray *_) {
                                return @{@"active_user": @"true", @"type": @"email"};
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsTappedSignUp,
                            ARAnalyticsSelectorName: @"connectWithFacebook:",
                            ARAnalyticsProperties: ^NSDictionary *(ARSignUpActiveUserViewController *controller, NSArray *_) {
                                return @{@"active_user": @"true", @"type": @"facebook"};
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsTappedSignUp,
                            ARAnalyticsSelectorName: @"connectWithTwitter:",
                            ARAnalyticsProperties: ^NSDictionary *(ARSignUpActiveUserViewController *controller, NSArray *_) {
                                return @{@"active_user": @"true", @"type": @"email"};
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARLoginViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInEmail,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loggedInWithType:user:)),
                            ARAnalyticsShouldFire: ^BOOL(ARLoginViewController *controller, NSArray *parameters){
                                NSNumber *typeNumber = parameters.firstObject;
                                ARLoginViewControllerLoginType type = typeNumber.integerValue;
                                return type == ARLoginViewControllerLoginTypeEmail;
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInTwitter,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loggedInWithType:user:)),
                            ARAnalyticsShouldFire: ^BOOL(ARLoginViewController *controller, NSArray *parameters){
                                NSNumber *typeNumber = parameters.firstObject;
                                ARLoginViewControllerLoginType type = typeNumber.integerValue;
                                return type == ARLoginViewControllerLoginTypeTwitter;
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInFacebook,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loggedInWithType:user:)),
                            ARAnalyticsShouldFire: ^BOOL(ARLoginViewController *controller, NSArray *parameters){
                                NSNumber *typeNumber = parameters.firstObject;
                                ARLoginViewControllerLoginType type = typeNumber.integerValue;
                                return type == ARLoginViewControllerLoginTypeFacebook;
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInError,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(failedToLoginToTwitter)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInError,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(authenticationFailure)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInError,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(networkFailure:)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInError,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(failedToLoginToFacebook)),
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairMapAnnotationCallOutView.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairMapPartnerShowTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tapped:)),
                            ARAnalyticsShouldFire: ^BOOL(ARFairMapAnnotationCallOutView *view, NSArray *parameters) {
                                return [view.annotation.representedObject isKindOfClass:[PartnerShow class]];
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARFairMapAnnotationCallOutView *view, NSArray *_){
                                PartnerShow *partnerShow = view.annotation.representedObject;
                                return @{
                                    @"fair_id" : partnerShow.fair.fairID ?: @"",
                                    @"profile_id" : partnerShow.fair.organizer.profileID ?: @"",
                                    @"partner_show_id" : partnerShow.showID ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairMapPartnerShowTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tapped:)),
                            ARAnalyticsShouldFire: ^BOOL(ARFairMapAnnotationCallOutView *view, NSArray *parameters) {
                                return ![view.annotation.representedObject isKindOfClass:[PartnerShow class]] && view.annotation.href;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARFairMapAnnotationCallOutView *view, NSArray *_){
                                return @{
                                    @"fair_id" : view.fair.fairID ?: @"",
                                    @"profile_id" : view.fair.organizer.profileID ?: @"",
                                    @"href" : view.annotation.href ?: @""
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARGeneViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsGeneView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARGeneViewController *controller, NSArray *_){
                                return @{
                                    @"gene_id" : controller.gene.geneID ?: @"",
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsGeneFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingGene:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARGeneViewController *controller, NSArray *parameters){
                                ARHeartButton *sender = parameters.firstObject;
                                return @{
                                    @"followed": sender.isHearted? @"yes" : @"no",
                                    @"gene_id" : controller.gene.geneID ?: @"",
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsHearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingGene:)),
                            ARAnalyticsShouldFire: ^BOOL (ARGeneViewController *controller, NSArray *parameters) {
                                ARHeartButton *sender = parameters.firstObject;
                                return sender.hearted;
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsUnhearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingGene:)),
                            ARAnalyticsShouldFire: ^BOOL (ARGeneViewController *controller, NSArray *parameters) {
                                ARHeartButton *sender = parameters.firstObject;
                                return sender.hearted;
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARPersonalizeViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingCompletedPersonalize,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(continueTapped:)),
                            ARAnalyticsShouldFire: ^BOOL (ARPersonalizeViewController *controller, NSArray *parameters) {
                                return controller.followedThisSession || controller.geneController.numberOfFollowedGenes;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARPersonalizeViewController *controller, NSArray *_){
                                return @{
                                    @"artist_count": @(controller.followedThisSession),
                                    @"gene_count": @(controller.geneController.numberOfFollowedGenes)
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingSkippedPersonalize,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(continueTapped:)),
                            ARAnalyticsShouldFire: ^BOOL (ARPersonalizeViewController *controller, NSArray *parameters) {
                                return !(controller.followedThisSession || controller.geneController.numberOfFollowedGenes);
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistUnfollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(searchToggleFollowStatusForArtist:atIndexPath:)),
                            ARAnalyticsShouldFire: ^BOOL (ARPersonalizeViewController *controller, NSArray *parameters) {
                                Artist *artist = parameters.firstObject;
                                return [controller.artistController hasArtist:artist];
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARPersonalizeViewController *controller, NSArray *parameters){
                                Artist *artist = parameters.firstObject;
                                return @{
                                    @"source_screen": @"Onboarding",
                                    @"artist_slug" : artist.artistID,
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(searchToggleFollowStatusForArtist:atIndexPath:)),
                            ARAnalyticsShouldFire: ^BOOL (ARPersonalizeViewController *controller, NSArray *parameters) {
                                Artist *artist = parameters.firstObject;
                                return !([controller.artistController hasArtist:artist]);
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARPersonalizeViewController *controller, NSArray *parameters){
                                Artist *artist = parameters.firstObject;
                                return @{
                                    @"source_screen": @"Onboarding",
                                    @"artist_slug" : artist.artistID,
                                };
                            },
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARSignUpSplashViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsTappedLogIn,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(logIn:)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsTappedSignUp,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(signUp:)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInWebCredentials,
                            ARAnalyticsSelectorName: @"loggedInWithSharedCredentials",
                            ARAnalyticsProperties: ^NSDictionary *(ARSignUpSplashViewController *controller, NSArray *_) {
                                return @{@"active_user": @"true"};
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsTryWithoutAccount,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(startTrial)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                            NSInteger threshold = [[NSUserDefaults standardUserDefaults] integerForKey:AROnboardingPromptThresholdDefault];
                                return @{
                                    @"tap_threshold" : @(threshold)
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARViewInRoomViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkViewInRoom,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARViewInRoomViewController *controller, NSArray *_){
                                return @{
                                    @"interaction_type": controller.popOnRotation ? @"rotation" : @"button",
                                    @"artwork_slug": controller.artwork.artworkID ?: @"",
                                    @"artist_slug": controller.artwork.artist.artistID ?: @""
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARViewInRoomViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkViewInRoom,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARViewInRoomViewController *controller, NSArray *_){
                                return @{
                                    @"via_rotation" : @(controller.popOnRotation),
                                    @"artwork" : controller.artwork.artworkID ?: @""
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARSiteHeroUnitViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsTappedHeroUnit,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedUnit:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARSiteHeroUnitViewController *vc, NSArray *_){
                                return @{
                                    @"destination" : vc.heroUnit.link ?: @""
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARTabContentView.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsTappedMainNavigationItem,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(navigationControllerForIndex:),
                            ARAnalyticsProperties:^NSDictionary*(ARTabContentView *view, NSArray *parameters) {
                                NSInteger index = [parameters.firstObject integerValue];
                                UIButton *button = view.buttons[index];
                                NSString *title = button.accessibilityLabel ?: button.titleLabel.text;
                                NSParameterAssert(title);
                                return @{
                                    @"tab name" : (title ?: @"").lowercaseString
                                };
                            },
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                // Ignore first invocation so that we don't track when users are loading the app initially.
                                static BOOL firstInvocation = YES;
                                if (firstInvocation) {
                                    firstInvocation = NO;
                                    return NO;
                                }
 
                                return YES;
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARArtistViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidLoad)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtistViewController *controller, NSArray *_){
                                return @{
                                    @"artist_id" : controller.artist.artistID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingArtist:)),
                            ARAnalyticsShouldFire: ^BOOL(ARArtistViewController *controller, NSArray *parameters){
                                ARHeartButton *sender = parameters.firstObject;
                                return sender.isHearted == YES;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARArtistViewController *controller, NSArray *parameters){
                                return @{
                                         @"artist_slug" : controller.artist.artistID ?: @"",
                                         @"source_screen" : @"Artist"
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistUnfollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingArtist:)),
                            ARAnalyticsShouldFire: ^BOOL(ARArtistViewController *controller, NSArray *parameters){
                                ARHeartButton *sender = parameters.firstObject;
                                return sender.isHearted == NO;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARArtistViewController *controller, NSArray *parameters){
                                return @{
                                    @"artist_slug" : controller.artist.artistID ?: @"",
                                    @"source_screen" : @"Artist"
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsHearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingArtist:)),
                            ARAnalyticsShouldFire: heartedShouldFireBlock,
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsUnhearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingArtist:)),
                            ARAnalyticsShouldFire: unheartedShouldFireBlock,
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistTappedForSale,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(forSaleOnlyArtworksTapped)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtistViewController *controller, NSArray *_){
                                return @{
                                    @"artist_id" : controller.artist.artistID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @""
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsProfileView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairViewController *controller, NSArray *_){
                                return @{
                                    @"profile_id" : controller.fairProfile.profileID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairFeaturedLinkSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(didSelectFeaturedLink:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairViewController *controller, NSArray *parameters){
                                FeaturedLink *featuredLink = parameters.firstObject;
                                return @{
                                    @"profile_id" : controller.fair.organizer.profileID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                    @"url" : featuredLink.href ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairPostSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(didSelectPost:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairViewController *controller, NSArray *parameters){
                                NSString *postURL = parameters.firstObject;
                                return @{
                                    @"profile_id" : controller.fair.organizer.profileID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                    @"url" : postURL ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairFeaturedLinkSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(buttonPressed:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARFairViewController *controller, NSArray *parameters){
                                ARButtonWithImage *button = parameters.firstObject;
                                return @{
                                    @"profile_id" : controller.fair.organizer.profileID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                    @"url" : button.targetURL ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairOverviewSelection,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(buttonPressed:),
                            ARAnalyticsProperties:  ^NSDictionary*(ARFairViewController *controller, NSArray *parameters){
                                ARButtonWithImage *button = parameters.firstObject;
                                return @{
                                    @"button_text" : button.title ?: @"",
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: AROnboardingViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsSlideshowStarted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(startSlideshow)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingStarted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(splashDone:)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingStarted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(splashDoneWithLogin:)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingStartedCollectorLevel,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(collectorLevel)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingStartedPersonalize,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(personalize)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingCompletedPersonalize,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(personalizeDone)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingStartedPriceRange,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(priceRange)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingCompletedPriceRange,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(setPriceRangeDone:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *parameters){
                                NSInteger range = [parameters.firstObject integerValue];
                                NSString *stringRange = [NSString stringWithFormat:@"%@", @(range)];
                                return @{ @"price_range" : stringRange };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingCompleted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(dismissOnboardingWithVoidAnimation:)),
                            ARAnalyticsProperties: ^NSDictionary*(AROnboardingViewController *controller, NSArray *_){
                                return @{
                                    @"configuration" : [controller onboardingConfigurationString]
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingCompletedCollectorLevel,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(collectorLevelDone:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *parameters){
                                ARCollectorLevel level = [parameters.firstObject integerValue];
                                NSString *collectorLevel = [ARCollectorStatusViewController stringFromCollectorLevel:level];
                                return @{
                                    @"collector_level" : collectorLevel
                                };
                            },
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARTrialController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsShowTrialSplash,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(presentTrialWithContext:success:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARTrialController *controller, NSArray *parameters){
                                enum ARTrialContext context = [parameters.firstObject integerValue];
                                return @{
                                    @"context" : [ARTrialController stringForTrialContext:context],
                                    @"tap_threshold" : @(controller.threshold)
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARSharingController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsShare,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(handleActivityCompletion:completed:)),
                            ARAnalyticsShouldFire: ^BOOL(ARSharingController *controller, NSArray *parameters) {
                                BOOL completed = [parameters[1] boolValue];
                                return completed;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARSharingController * controller, NSArray *parameters){
                                NSString *itemType = NSStringFromClass([controller.object class]).lowercaseString;
                                NSString *activityType = parameters.firstObject;
                                return @{
                                    @"object_type" : itemType ?: @"",
                                    @"service" : activityType ?: @""
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARBrowseViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsExploreTap,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(collectionView:didSelectItemAtIndexPath:),
                            ARAnalyticsProperties:^NSDictionary *(ARBrowseViewController *controller, NSArray *parameters) {
                                NSIndexPath *indexPath = parameters[1];
                                FeaturedLink *link = [controller.networkModel.links objectAtIndex:indexPath.row];

                                return @{
                                    @"type": link.title ?: @""
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARAppSearchViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsSearchClosed,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(viewDidDisappear:)
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSearchStartedQuery,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(fetchSearchResults:replace:),
                            ARAnalyticsProperties: ^NSDictionary *(ARSearchViewController *controller, NSArray *parameters) {
                                return @{
                                    @"query": parameters.firstObject ?: @""
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSearchCleared,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(clearSearchAnimated:)
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSearchItemSelected,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(selectedResult:ofType:fromQuery:),
                            ARAnalyticsProperties: ^NSDictionary *(ARSearchViewController *controller, NSArray *parameters) {
                                return @{
                                    @"query": parameters[2] ?: @"",
                                    @"selected_object_type": parameters[1] ?: @"",
                                    @"selected_object_slug": [parameters[0] modelID] ?: @""
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairSearchViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairSearch,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(fetchSearchResults:replace:),
                            ARAnalyticsProperties: ^NSDictionary *(ARSearchViewController *controller, NSArray *parameters) {
                                return @{
                                    @"query": parameters.firstObject ?: @""
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSearchItemSelected,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(selectedResult:ofType:fromQuery:),
                            ARAnalyticsProperties: ^NSDictionary *(ARSearchViewController *controller, NSArray *parameters) {
                                return @{
                                    @"query": parameters[2] ?: @"",
                                    @"selected_object_type": parameters[1] ?: @"",
                                    @"slug": [parameters[0] modelID] ?: @""
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARNavigationController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsSelectorName: ARAnalyticsSelector(back:),
                            ARAnalyticsEventName: ARAnalyticsBackTapped
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: AuctionViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsAuctionBidButtonTapped,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(userDidPressRegister:),
                            ARAnalyticsProperties: ^NSDictionary *(AuctionViewController *controller, NSArray *parameters) {
                                return @{
                                    @"auction_slug" : controller.saleID ?: @"",
                                    @"auction_state" : controller.saleViewModel.saleAvailabilityString,
                                    @"context_type": controller.navigationController.topViewController == controller ? @"sale" : @"sale information"
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworksRefineTapped,
                            ARAnalyticsSelectorName: ARAnalyticsSelector(showRefineTapped),
                            ARAnalyticsProperties: ^NSDictionary *(AuctionViewController *controller, NSArray *parameters) {
                                return @{
                                    @"auction_slug" : controller.saleID ?: @"",
                                    @"auction_state" : controller.saleViewModel.saleAvailabilityString,
                                };
                            }
                        }
                    ]
                },
            ],
            ARAnalyticsTrackedScreens: @[
                @{
                    ARAnalyticsClass: AROnboardingViewController.class,
                    ARAnalyticsDetails: @[ @{
                        ARAnalyticsPageName: @"Splash",
                        ARAnalyticsShouldFire: ^BOOL(AROnboardingViewController *controller, NSArray *parameters) {
                            return controller.initialState == ARInitialOnboardingStateSlideShow;
                        }
                    }, @{
                        ARAnalyticsPageName: @"Onboarding",
                        ARAnalyticsSelectorName: ARAnalyticsSelector(collectorLevelDone:),
                        ARAnalyticsProperties: ^NSDictionary *(AROnboardingViewController *controller, NSArray *parameters) {
                            ARCollectorLevel level = [parameters.firstObject intValue];
                            return @{ @"onboarding_step": @"collector_level",
                                      @"collector_level": [ARCollectorStatusViewController stringFromCollectorLevel:level] };
                        }
                    }, @{
                        ARAnalyticsPageName: @"Onboarding",
                        ARAnalyticsSelectorName: ARAnalyticsSelector(setPriceRangeDone:),
                        ARAnalyticsProperties: ^NSDictionary *(AROnboardingViewController *controller, NSArray *parameters) {
                            NSString *range = [NSString stringWithFormat:@"%@", parameters.firstObject];
                            return @{ @"onboarding_step": @"price_range",
                                      @"price_range": range };
                        }
                    }, @{
                        ARAnalyticsPageName: @"Onboarding",
                        ARAnalyticsSelectorName: ARAnalyticsSelector(personalizeDone),
                        ARAnalyticsProperties: ^NSDictionary *(AROnboardingViewController *controller, NSArray *parameters) {
                            return @{ @"onboarding_step": @"personalize" };
                        }
                    }]
                },
                @{
                    ARAnalyticsClass: ARCreateAccountViewController.class,
                    ARAnalyticsDetails: @[ @{ ARAnalyticsPageName: @"Signup" } ]
                },
                @{
                    ARAnalyticsClass: ARLoginViewController.class,
                    ARAnalyticsDetails: @[ @{ ARAnalyticsPageName: @"Login" } ]
                },
                @{
                    ARAnalyticsClass: ARNavigationController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Search",
                            ARAnalyticsSelectorName: @"search:",
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARTabContentView.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Home",
                            ARAnalyticsSelectorName: @"forceSetCurrentViewIndex:animated:",
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                return [parameters.firstObject integerValue] == ARTopTabControllerIndexFeed;
                            }
                        },@{
                            ARAnalyticsPageName: @"Shows",
                            ARAnalyticsSelectorName: @"forceSetCurrentViewIndex:animated:",
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                return [parameters.firstObject integerValue] == ARTopTabControllerIndexShows;
                            }
                        },@{
                            ARAnalyticsPageName: @"Explore",
                            ARAnalyticsSelectorName: @"forceSetCurrentViewIndex:animated:",
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                return [parameters.firstObject integerValue] == ARTopTabControllerIndexBrowse;
                            }
                        },@{
                            ARAnalyticsPageName: @"Mag",
                            ARAnalyticsSelectorName: @"forceSetCurrentViewIndex:animated:",
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                return [parameters.firstObject integerValue] == ARTopTabControllerIndexMagazine;
                            }
                        },@{
                            ARAnalyticsPageName: @"You",
                            ARAnalyticsSelectorName: @"forceSetCurrentViewIndex:animated:",
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                return [parameters.firstObject integerValue] == ARTopTabControllerIndexFavorites;
                            },
                            ARAnalyticsProperties: ^NSDictionary *(ARTabContentView *view, NSArray *parameters) {
                                // Always starts on artworks tab
                                return @{ @"tab": @"Artworks" };
                            }
                        },@{
                            ARAnalyticsPageName: @"Notifications",
                            ARAnalyticsSelectorName: @"forceSetCurrentViewIndex:animated:",
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                return [parameters.firstObject integerValue] == ARTopTabControllerIndexNotifications;
                            },
                        },@{
                            ARAnalyticsPageName: @"Notifications Tab Tapped",
                            ARAnalyticsSelectorName: ARAnalyticsSelector(buttonTapped:),
                            ARAnalyticsShouldFire: ^BOOL(ARTabContentView *view, NSArray *parameters) {
                                return [parameters.firstObject tag] == ARNavButtonNotificationsTag;
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFavoritesViewController.class,
                    ARAnalyticsDetails: @[@{
                          ARAnalyticsPageName: @"You",
                        ARAnalyticsSelectorName: ARAnalyticsSelector(switchView:didPressButtonAtIndex:animated:),
                        ARAnalyticsProperties: ^NSDictionary *(ARFavoritesViewController *controller, NSArray *parameters) {
                            NSInteger buttonIndex = [parameters[1] integerValue];

                            NSString *tab = @"";
                            if (buttonIndex == ARSwitchViewFavoriteArtworksIndex) {
                                tab = @"Artworks";
                            } else if (buttonIndex == ARSwitchViewFavoriteArtistsIndex) {
                                tab = @"Artists";
                            } else if (buttonIndex == ARSwitchViewFavoriteCategoriesIndex) {
                                tab = @"Categories";
                            }
                            return @{ @"tab": tab};
                        }
                    }]
                },
                @{
                    ARAnalyticsClass: ARArtworkView.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Artwork",
                            ARAnalyticsSelectorName: @"artworkUpdated",
                            ARAnalyticsProperties: ^NSDictionary *(ARArtworkView *view, NSArray *_) {
                                NSDictionary *basics =  @{
                                    @"slug": view.artwork.artworkID ?: @"",
                                    @"artist_slug": view.artwork.artist.artistID ?: @"",
                                    @"partner": view.artwork.partner.partnerID ?: @"",
                                    @"price": view.artwork.price ?: @""
                                };

                                if (view.artwork.fair.fairID) {
                                    basics = [basics mtl_dictionaryByAddingEntriesFromDictionary:@{ @"fair_slug": view.artwork.fair.fairID }];
                                }

                                return basics;
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairArtistViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Fair artist",
                            ARAnalyticsSelectorName: @"artistDidLoad",
                            ARAnalyticsProperties: ^NSDictionary *(ARFairArtistViewController *controller, NSArray *_) {
                                // Fair artists only show all
                                NSString *fairID = controller.fair.fairID ?: @"";
                                NSString *artistID = controller.artist.artistID ?: @"";
                                return @{ @"fair_slug": fairID, @"artist_slug": artistID};
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARArtistViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Artist",
                            ARAnalyticsProperties: ^NSDictionary *(ARFairArtistViewController *controller, NSArray *_) {
                                // Displays all by default
                                NSString *artistID = controller.artist.artistID ?: @"";
                                return @{ @"tab": @"All", @"artist_slug": artistID };
                            }
                        },
                        @{
                            ARAnalyticsPageName: @"Artist",
                            ARAnalyticsSelectorName: ARAnalyticsSelector(switchView:didPressButtonAtIndex:animated:),
                            ARAnalyticsProperties: ^NSDictionary *(ARFairArtistViewController *controller, NSArray *parameters) {
                                NSInteger index = [parameters[1] integerValue];
                                NSString *artistID = controller.artist.artistID ?: @"";

                                NSString *tab = @"";
                                if (index == ARSwitchViewArtistButtonIndex) {
                                    tab = @"All";
                                } else if (index == ARSwitchViewForSaleButtonIndex) {
                                    tab = @"For Sale";
                                }
                                return @{ @"tab": tab, @"artist_slug":artistID };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARShowViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Show",
                            ARAnalyticsSelectorName: @"showDidLoad",
                            ARAnalyticsProperties:^NSDictionary *(ARShowViewController *controller, NSArray *_) {
                                NSDictionary *basics =  @{ @"slug": controller.show.showID,
                                    @"partner_slug": controller.show.partner.partnerID ?: @""
                                };

                                if (controller.show.fair.fairID) {
                                    basics = [basics mtl_dictionaryByAddingEntriesFromDictionary:@{ @"fair_slug": controller.show.fair.fairID }];
                                }

                               return basics;
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Fair",
                            ARAnalyticsSelectorName: @"fairDidLoad",
                            ARAnalyticsProperties: ^NSDictionary *(ARFairViewController *controller, NSArray *_) {
                                return @{ @"slug": controller.fair.fairID ?: @"",
                                    @"screen_type": @"Overview" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairSearchViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Fair",
                            ARAnalyticsProperties: ^NSDictionary *(ARFairSearchViewController *controller, NSArray *_) {
                                return @{ @"slug": controller.fair.fairID ?: @"",
                                    @"screen_type": @"Search" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairMapViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Fair",
                            ARAnalyticsProperties: ^NSDictionary *(ARFairMapViewController *controller, NSArray *_) {
                                return @{ @"slug": controller.fair.fairID ?: @"",
                                    @"screen_type": @"Map" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairGuideViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Fair",
                            ARAnalyticsSelectorName: @"setFairLoaded",
                            ARAnalyticsShouldFire: ^BOOL(ARFairGuideViewController *controller, BOOL newValue) {
                                return newValue == YES;
                            },
                            ARAnalyticsProperties: ^NSDictionary *(ARFairGuideViewController *controller, NSArray *_) {
                                return @{ @"slug": controller.fair.fairID ?: @"",
                                    @"screen_type": @"Personalized Guide" };
                            }
                        },
                        @{
                            ARAnalyticsPageName: @"Fair personalized guide",
                            ARAnalyticsSelectorName: ARAnalyticsSelector(setSelectedTabIndex:),
                            ARAnalyticsProperties: ^NSDictionary *(ARFairGuideViewController *controller, NSArray *parameters) {
                                NSInteger index = [parameters.firstObject integerValue];
                                NSString *tab = @"";

                                if (index == ARFairGuideSelectedTabWork) {
                                    tab = @"Work";
                                } else if (index == ARFairGuideSelectedTabArtists) {
                                    tab = @"Artists";
                                } else if (index == ARFairGuideSelectedTabExhibitors) {
                                    tab = @"Exhibitors";
                                }

                                return @{ @"tab": tab, @"slug": controller.fair.fairID ?: @"" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARArtistBiographyViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Artist Biography",
                            ARAnalyticsProperties: ^NSDictionary *(ARArtistBiographyViewController *controller, NSArray *_) {
                                return @{ @"artist_slug": controller.artist.artistID ?: @"" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARGeneViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Category",
                            ARAnalyticsProperties: ^NSDictionary *(ARGeneViewController *controller, NSArray *_) {
                                return @{ @"slug": controller.gene.geneID ?: @"" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARInternalMobileWebViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"internal_mobile_web", // convert to Mobile Web? This is backwards compat as-is
                            ARAnalyticsProperties: ^NSDictionary *(ARInternalMobileWebViewController *controller, NSArray *_) {
                                return @{ @"slug": controller.initialURL.path ?: @"" };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: AuctionViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Sale",
                            ARAnalyticsProperties: ^NSDictionary *(AuctionViewController *controller, NSArray *_) {
                                return @{ @"auction_slug": controller.saleID ?: @"",
                                          @"slug": [NSString stringWithFormat:@"/auction/%@", controller.saleID] };
                            }
                        }
                    ]
                },
            ]
        }
    ];

    [ARUserManager identifyAnalyticsUser];
    [ARAnalytics incrementUserProperty:ARAnalyticsAppUsageCountProperty byInt:1];
}

@end
