#import "ARAppDelegate+Analytics.h"
#import <ARAnalytics/ARAnalytics.h>
#import <ARAnalytics/ARDSL.h>
#import "ARAnalyticsConstants.h"
#import <HockeySDK/BITHockeyManager.h>

#import "ARUserManager.h"

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
#import "ARLoginViewController.h"
#import "ARSignUpActiveUserViewController.h"
#import "ARSignupViewController.h"
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

// Views
#import "ARHeartButton.h"
#import "ARFairMapAnnotationCallOutView.h"
#import "ARSiteHeroUnitView.h"
#import "ARButtonWithImage.h"
#import "ARTabContentView.h"

// Models
#import "ARFairFavoritesNetworkModel+Private.h"
#import <Keys/ArtsyKeys.h>

@implementation ARAppDelegate (Analytics)

- (void)setupAnalytics
{
    ArtsyKeys *keys = [[ArtsyKeys alloc] init];
    NSString *segmentWriteKey = keys.segmentProductionWriteKey;

    NSString *bundleID = [[NSBundle mainBundle] bundleIdentifier];
    if ([bundleID containsString:@".dev"] || [bundleID containsString:@".beta"]) {
        segmentWriteKey = keys.segmentDevWriteKey;
    }

    ARAppDelegate *appDelegate = [ARAppDelegate sharedInstance];

#if DEBUG
    [[BITHockeyManager sharedHockeyManager] setDisableUpdateManager:YES];
    [[BITHockeyManager sharedHockeyManager] setDisableCrashManager: YES];
#endif

    ARAnalyticsPropertiesBlock fairAndProfileIDBlock = ^NSDictionary*(ARFairGuideViewController *controller, NSArray *_) {
        return @{
             @"profile_id" : controller.fair.organizer.profileID ?: @"",
             @"fair_id" : controller.fair.fairID ?: @"",
        };
    };

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
        ARSegmentioWriteKey: segmentWriteKey
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
                            ARAnalyticsProperties: fairAndProfileIDBlock
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
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(mapButtonTapped:)),
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
                            ARAnalyticsEventName: ARAnalyticsProfileFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowShow:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARShowViewController *controller, NSArray *_) {
                                return @{
                                    @"followed": controller.isFollowing ? @"yes" : @"no",
                                    @"profile_id" : controller.show.partner.profileID ?: @"",
                                    @"partner_show_id" : controller.show.showID ?: @"",
                                    @"partner_id" : controller.show.partner.partnerID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
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
                    ARAnalyticsClass: AROnboardingGeneTableController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkFavorite,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tableView:didSelectRowAtIndexPath:)),
                            ARAnalyticsProperties: ^NSDictionary*(AROnboardingGeneTableController *controller, NSArray *parameters) {
                                NSIndexPath *indexPath = parameters[1];
                                Gene *gene = [controller.genes objectAtIndex:indexPath.row];
                                return @{
                                    @"followed": gene.followed? @"yes" : @"no",
                                    @"gene_id" : gene.geneID ?: @"",
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARArtworkViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsStartedInquiry,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedContactRepresentative:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters) {
                                return @{
                                    @"context" : ARAnalyticsInquiryContextSpecialist,
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsStartedInquiry,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedContactGallery:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters) {
                                return @{
                                    @"context" : ARAnalyticsInquiryContextGallery,
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtworkFavorite,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedArtworkFavorite:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                ARHeartButton *sender = parameters.first;
                                return @{
                                    @"followed": sender.isHearted? @"yes" : @"no",
                                    @"artwork_id" : controller.artwork.artworkID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsHearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedArtworkFavorite:)),
                            ARAnalyticsShouldFire: heartedShouldFireBlock,
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsUnhearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedArtworkFavorite:)),
                            ARAnalyticsShouldFire: unheartedShouldFireBlock,
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsFairMapButtonTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedArtworkViewInMap:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *_){
                                return @{@"artwork_id" : controller.artwork.artworkID ?: @""};
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsAuctionBidTapped,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(bidCompelted:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                SaleArtwork *saleArtwork = parameters.first;
                                return @{
                                    @"artwork_id" : controller.artwork.artworkID ?: @"",
                                    @"sale_id" : saleArtwork.auction.saleID ?: @""
                                };
                            },
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
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARInquireForArtworkViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsCancelledInquiry,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(cancelButtonTapped:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARInquireForArtworkViewController *controller, NSArray *_) {
                                return @{
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSubmittedInquiry,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(inquiryCompleted:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARInquireForArtworkViewController *controller, NSArray *_) {
                                return @{
                                    @"body_length": controller.body ?: @"",
                                    @"type": (controller.state == ARInquireStatePartner) ? @"partner" : @"representative",
                                    @"artwork_id": controller.artwork.artworkID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                    @"inquiry_url": controller.inquiryURLRepresentation ?: @"",
                                    @"referring_url": appDelegate.referralURLRepresentation ?: @"",
                                    @"landing_url": appDelegate.landingURLRepresentation ?: @"",
                                };
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: AROnboardingArtistTableController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(unfollowArtist:)),
                            ARAnalyticsProperties:^NSDictionary*(AROnboardingArtistTableController *controller, NSArray *parameters) {
                                Artist *artist = parameters[0];
                                return @{
                                    @"followed": @"no",
                                    @"artist_id" : artist.artistID?: @"",
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARLoginViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsStartedSignIn,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(twitter:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARLoginViewController *controller, NSArray *_){
                                return @{ @"context" : ARAnalyticsUserContextTwitter };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsUserSignedIn,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loggedInWithType:user:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARLoginViewController *controller, NSArray *parameters){
                                NSNumber *typeNumber = parameters.first;

                                ARLoginViewControllerLoginType type = typeNumber.integerValue;

                                NSString *context = @"";

                                switch (type) {
                                    case ARLoginViewControllerLoginTypeTwitter:
                                        context = ARAnalyticsUserContextTwitter;
                                        break;
                                    case ARLoginViewControllerLoginTypeFacebook:
                                        context = ARAnalyticsUserContextFacebook;
                                        break;
                                    case ARLoginViewControllerLoginTypeEmail:
                                        context = ARAnalyticsUserContextFacebook;
                                        break;
                                }

                                return @{ @"context" : context };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInTwitter,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loggedInWithType:user:)),
                            ARAnalyticsShouldFire: ^BOOL(ARLoginViewController *controller, NSArray *parameters) {
                                ARLoginViewControllerLoginType type = [parameters.first integerValue];
                                return type == ARLoginViewControllerLoginTypeTwitter;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARLoginViewController *controller, NSArray *parameters){
                                User *currentUser = parameters[1];
                                return @{ @"user_id": currentUser.userID ?: @"" };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInFacebook,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loggedInWithType:user:)),
                            ARAnalyticsShouldFire: ^BOOL(ARLoginViewController *controller, NSArray *parameters) {
                                ARLoginViewControllerLoginType type = [parameters.first integerValue];
                                return type == ARLoginViewControllerLoginTypeFacebook;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARLoginViewController *controller, NSArray *parameters){
                                User *currentUser = parameters[1];
                                return @{ @"user_id": currentUser.userID ?: @"" };
                            },
                        },
                        @{
                            ARAnalyticsEventName: @"Log in",
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loggedInWithType:user:)),
                            ARAnalyticsShouldFire: ^BOOL(ARLoginViewController *controller, NSArray *parameters) {
                                ARLoginViewControllerLoginType type = [parameters.first integerValue];
                                return type == ARLoginViewControllerLoginTypeEmail;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARLoginViewController *controller, NSArray *parameters){
                                User *currentUser = parameters[1];
                                return @{ @"user_id": currentUser.userID ?: @"" };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInError,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(failedToLoginToTwitter)),
                            ARAnalyticsProperties: ^NSDictionary*(ARLoginViewController *controller, NSArray *parameters){
                                return @{ @"context" : ARAnalyticsUserContextTwitter };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsStartedSignIn,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(fb:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARLoginViewController *controller, NSArray *_){
                                return @{ @"context" : ARAnalyticsUserContextFacebook };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsStartedSignIn,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loginWithUsername:andPassword:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARLoginViewController *controller, NSArray *_){
                                return @{ @"context" : ARAnalyticsUserContextEmail };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInError,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(authenticationFailure)),
                            ARAnalyticsProperties: ^NSDictionary*(ARLoginViewController *controller, NSArray *_){
                                return @{ @"context" : ARAnalyticsUserContextEmail };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInError,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(networkFailure:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARLoginViewController *controller, NSArray *_){
                                return @{ @"context" : ARAnalyticsUserContextEmail };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsSignInError,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(failedToLoginToFacebook)),
                            ARAnalyticsProperties: ^NSDictionary*(ARLoginViewController *controller, NSArray *_){
                                return @{ @"context" : ARAnalyticsUserContextFacebook };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARSignUpActiveUserViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsDismissedActiveUserSignUp,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(goBackToApp:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARSignUpActiveUserViewController *controller, NSArray *_){
                                return @{ @"context" : [ARTrialController stringForTrialContext:controller.trialContext] };
                            },
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
                    ARAnalyticsClass: ARSignupViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsStartedSignup,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(twitter:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context" : ARAnalyticsUserContextTwitter };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsStartedSignup,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(email:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context" : ARAnalyticsUserContextEmail };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsStartedSignup,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(fb:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context" : ARAnalyticsUserContextFacebook };
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
                                ARHeartButton *sender = parameters.first;
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
                                ARHeartButton *sender = parameters.first;
                                return sender.hearted;
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsUnhearted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingGene:)),
                            ARAnalyticsShouldFire: ^BOOL (ARGeneViewController *controller, NSArray *parameters) {
                                ARHeartButton *sender = parameters.first;
                                return sender.hearted;
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARInternalMobileWebViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsOpenedArtsyGravityURL,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(webView:shouldStartLoadWithRequest:navigationType:)),
                            ARAnalyticsShouldFire: ^BOOL (ARInternalMobileWebViewController *controller, NSArray *parameters) {
                                NSURLRequest *request = parameters[1];
                                return [request.URL.absoluteString containsString:@"stop_microgravity_redirect"];
                            },
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *parameters){
                                NSURLRequest *request = parameters[1];
                                return @{ @"url" : request.URL.absoluteString ?: @"" };
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
                            ARAnalyticsEventName: ARAnalyticsArtistFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(searchToggleFollowStatusForArtist:atIndexPath:)),
                            ARAnalyticsShouldFire: ^BOOL (ARPersonalizeViewController *controller, NSArray *parameters) {
                                Artist *artist = parameters.first;
                                return [controller.artistController hasArtist:artist];
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARPersonalizeViewController *controller, NSArray *parameters){
                                Artist *artist = parameters.first;
                                return @{
                                    @"followed": @"no",
                                    @"artist_id" : artist.artistID,
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(searchToggleFollowStatusForArtist:atIndexPath:)),
                            ARAnalyticsShouldFire: ^BOOL (ARPersonalizeViewController *controller, NSArray *parameters) {
                                Artist *artist = parameters.first;
                                return !([controller.artistController hasArtist:artist]);
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARPersonalizeViewController *controller, NSArray *parameters){
                                Artist *artist = parameters.first;
                                return @{
                                    @"followed": @"yes",
                                    @"artist_id" : artist.artistID,
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
                            ARAnalyticsEventName: ARAnalyticsStartedTrial,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(startTrial)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                            NSInteger threshold = [[NSUserDefaults standardUserDefaults] integerForKey:AROnboardingPromptThresholdDefault];
                                return @{
                                    @"tap_threshold" : @(threshold)
                                };
                            },
                        },
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
                    ARAnalyticsClass: AROnboardingMoreInfoViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsAmendingDetails,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(initForFacebookWithToken:email:name:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context" : ARAnalyticsUserContextFacebook };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsAmendingDetails,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(initForTwitterWithToken:andSecret:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context" : ARAnalyticsUserContextTwitter };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsUserAlreadyExistedAtSignUp,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(userAlreadyExistsForLoginType:)),
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsCompletedSignUp,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(loginCompletedForLoginType:skipAhead:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *parameters){
                                NSString *context = @"";

                                AROnboardingMoreInfoViewControllerLoginType type = [parameters.first integerValue];

                                switch (type) {
                                    case AROnboardingMoreInfoViewControllerLoginTypeFacebook:
                                        context = ARAnalyticsUserContextFacebook;
                                        break;
                                    case AROnboardingMoreInfoViewControllerLoginTypeTwitter:
                                        context = ARAnalyticsUserContextTwitter;
                                        break;
                                }

                                return @{ @"context" : context };
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
                    ARAnalyticsClass: ARSiteHeroUnitView.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsTappedHeroUnit,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedView:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARSiteHeroUnitView *view, NSArray *_){
                                return @{
                                    @"url" : view.linkAddress ?: @""
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
                                NSString *title = button.titleLabel.text.lowercaseString;
                                return @{
                                    @"tab name" : title ?: @""
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
                                    @"fair_id" : controller.fair.fairID ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(toggleFollowingArtist:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtistViewController *controller, NSArray *parameters){
                            ARHeartButton *sender = parameters.first;
                                return @{
                                    @"followed": sender.isHearted? @"yes" : @"no",
                                    @"artist_id" : controller.artist.artistID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @""
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
                                FeaturedLink *featuredLink = parameters.first;
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
                                NSString *postURL = parameters.first;
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
                                ARButtonWithImage *button = parameters.first;
                                return @{
                                    @"profile_id" : controller.fair.organizer.profileID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                    @"url" : button.targetURL ?: @""
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARFairSearchViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsSearchItemSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(selectedResult:ofType:fromQuery:)),
                            ARAnalyticsShouldFire: ^BOOL(ARFairSearchViewController *controller, NSArray *parameters) {
                                NSString *type = parameters[1];
                                return type != nil;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARFairSearchViewController *controller, NSArray *parameters){
                                SearchResult *result = parameters[0];
                                NSString *type = parameters[1];
                                NSString *query = parameters[2];
                                return  @{
                                    type ?: @"" : result.modelID ?: @"",
                                    @"fair_id" : controller.fair.fairID ?: @"",
                                    @"query" : query.length > 0 ? query : @"",
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: AROnboardingViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingStarted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(signupDone)),
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
                                NSInteger range = [parameters.first integerValue];
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
                            ARAnalyticsEventName: ARAnalyticsStartedSignup,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(signUpWithFacebook)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context" : ARAnalyticsUserContextFacebook };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsStartedSignup,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(signUpWithTwitter)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                return @{ @"context" : ARAnalyticsUserContextTwitter };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingCompletedCollectorLevel,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(collectorLevelDone:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *parameters){
                                ARCollectorLevel level = [parameters.first integerValue];
                                NSString *collectorLevel = [ARCollectorStatusViewController stringFromCollectorLevel:level];
                                return @{
                                    @"collector_level" : collectorLevel
                                };
                            },
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARTrialController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsShowTrialSplash,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(presentTrialWithContext:fromTarget:selector:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARTrialController *controller, NSArray *parameters){
                                enum ARTrialContext context = [parameters.first integerValue];
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
                            ARAnalyticsEventName: ARAnalyticsShareStarted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(presentActivityViewController)),
                            ARAnalyticsProperties: ^NSDictionary*(ARSharingController *controller, NSArray *_){
                                NSString *itemType = [NSStringFromClass([controller.object class])
                                                      stringByReplacingOccurrencesOfString:@"partner"
                                                      withString:@""].lowercaseString;
                                NSString *itemId = [controller objectID];
                                return @{
                                    @"context" : itemType ?: @"",
                                    @"id" : itemId ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsShareCompleted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(handleActivityCompletion:completed:)),
                            ARAnalyticsShouldFire: ^BOOL(ARSharingController *controller, NSArray *parameters) {
                                BOOL completed = [parameters[1] boolValue];
                                return completed;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARSharingController * controller, NSArray *parameters){
                                NSString *itemType = [NSStringFromClass([controller.object class])
                                                      stringByReplacingOccurrencesOfString:@"partner"
                                                      withString:@""].lowercaseString;
                                NSString *itemId = [controller objectID];
                                NSString *activityType = parameters.first;
                                return @{
                                    @"context" : itemType ?: @"",
                                    @"id" : itemId ?: @"",
                                    @"service" : activityType ?: @""
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsShareCancelled,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(handleActivityCompletion:completed:)),
                            ARAnalyticsShouldFire: ^BOOL(ARSharingController *controller, NSArray *parameters) {
                                BOOL completed = [parameters[1] boolValue];
                                return !completed;
                            },
                            ARAnalyticsProperties: ^NSDictionary*(ARSharingController * controller, NSArray *parameters){
                                NSString *itemType = [NSStringFromClass([controller.object class])
                                                      stringByReplacingOccurrencesOfString:@"partner"
                                                      withString:@""].lowercaseString;
                                NSString *itemId = [controller objectID];
                                return @{
                                   @"context" : itemType ?: @"",
                                   @"id" : itemId ?: @""
                                };
                            },
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
                    ARAnalyticsClass: ARSignupViewController.class,
                    ARAnalyticsDetails: @[ @{ ARAnalyticsPageName: @"Signup" } ]
                },
                @{
                    ARAnalyticsClass: ARLoginViewController.class,
                    ARAnalyticsDetails: @[ @{ ARAnalyticsPageName: @"Login" } ]
                }
            ]
        }
    ];

    [ARUserManager identifyAnalyticsUser];
    [ARAnalytics incrementUserProperty:ARAnalyticsAppUsageCountProperty byInt:1];
}

@end
