// MARK: Formatter Exempt

#import "ARAppDelegate+Analytics.h"
#import <ARAnalytics/ARAnalytics.h>
#import <ARAnalytics/ARDSL.h>
#import "ARAnalyticsConstants.h"
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
#import "ARAnalyticsVisualizer.h"
#import "ARAppNotificationsDelegate.h"

// View Controllers
#import "ARProfileViewController.h"
#import "ARAppSearchViewController.h"
#import "ARArtworkViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "ARSignUpSplashViewController.h"
#import "ARPersonalizeViewController.h"
#import "AROnboardingPersonalizeTableViewController.h"
#import "ARPriceRangeViewController.h"
#import "ARViewInRoomViewController.h"
#import "ARSharingController.h"
#import "ARBrowseCategoriesViewController.h"
#import "ARArtistBiographyViewController.h"
#import "ARBrowseViewController.h"
#import "ARSearchViewController.h"
#import "ARNavigationController.h"
#import "ARArtworkInfoViewController.h"
#import "ARSentryAnalyticsProvider.h"
#import "ARAugmentedRealityConfig.h"
#import "ARAugmentedVIRSetupViewController.h"
#import "ARAugmentedFloorBasedVIRViewController.h"

#import <Emission/ARWorksForYouComponentViewController.h>
#import <Emission/ARArtistComponentViewController.h>
#import <Emission/ARGeneComponentViewController.h>

// Views
#import "ARHeartButton.h"
#import "ARSiteHeroUnitView.h"
#import "ARButtonWithImage.h"
#import "ARTabContentView.h"
#import "ARArtworkView.h"
#import "ARSwitchView.h"
#import "ARSwitchView+Favorites.h"
#import "ARSwitchView+Artist.h"
#import "ARAppStatus.h"

// Models
#import <Keys/ArtsyKeys.h>

#import <Sentry/SentryClient.h>

// Note the Eigen Schema:
// https://docs.google.com/spreadsheets/u/1/d/1bLbeOgVFaWzLSjxLOBDNOKs757-zBGoLSM1lIz3OPiI/edit#gid=497747862

@implementation ARAppDelegate (Analytics)

- (void)lookAtURLForAnalytics:(NSURL *)url
{
    [ARUserManager identifyAnalyticsUser];
    [Adjust appWillOpenUrl:url];
    [ARAnalytics event:ARAnalyticsDeepLinkOpened withProperties:@{@"link" : url.absoluteString}];
}

- (void)setupAnalytics
{
    ArtsyKeys *keys = [[ArtsyKeys alloc] init];

    NSString *segmentWriteKey = keys.segmentProductionWriteKey;
    NSString *adjustEnv = ADJEnvironmentProduction;
    NSString *sentryEnv = keys.sentryProductionDSN;

    if (ARAppStatus.isBetaOrDev) {
        segmentWriteKey = keys.segmentDevWriteKey;
        adjustEnv = ADJEnvironmentSandbox;
    }
    
    if (ARAppStatus.isBeta) {
        sentryEnv = keys.sentryStagingDSN;
    }
    
    if (ARAppStatus.isDev) {
        sentryEnv = nil;
    }

    // For OSS builds don't ship the sentry env
    if (sentryEnv && ![sentryEnv isEqualToString:@"-"]) {
        id sentry = [[ARSentryAnalyticsProvider alloc] initWithDSN:sentryEnv];
        [ARAnalytics setupProvider:sentry];
    }

    if ([AROptions boolForOption:AROptionsShowAnalyticsOnScreen]) {
        ARAnalyticsVisualizer *visualizer = [ARAnalyticsVisualizer new];
        [ARAnalytics setupProvider:visualizer];
    }

    [ARAnalytics setupWithAnalytics:
    @{
        ARSegmentioWriteKey: segmentWriteKey,
    } configuration:
    @{
        ARAnalyticsTrackedEvents:
            @[
                @{
                    ARAnalyticsClass: ARTopMenuViewController.class,
                    ARAnalyticsDetails: @[
                            @{
                                ARAnalyticsEventName: ARAnalyticsProfileView,
                                ARAnalyticsSelectorName: NSStringFromSelector(@selector(tabContentView:didChangeSelectedIndex:)),
                                ARAnalyticsProperties: ^NSDictionary*(ARTopMenuViewController *controller, NSArray *args) {
                                        return @{
                                                 @"tab" : args.count > 1 ? [controller descriptionForNavIndex: [args[1] integerValue]] : @"unknown",
                                             };
                                        }
                                }
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
                            ARAnalyticsEventName: @"tap",
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedArtworkViewInRoom)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *_){
                                return @{
                                    @"context_screen_owner_slug": controller.artwork.artworkID ?: @"",
                                    @"context_screen_owner_type": @"Artwork",
                                    @"action_name": @"tappedArtworkViewInRoom"
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
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedBidButton:saleID:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtworkViewController *controller, NSArray *parameters){
                                NSString *saleID = parameters[1];
                                return @{
                                    @"artwork_slug": controller.artwork.artworkID ?: @"",
                                    @"artist_slug": controller.artwork.artist.artistID ?: @"",
                                    @"auction_id": saleID ?: @"",
                                    @"context_type" : @"Artwork"
                                };
                            },
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsAuctionHowBiddingWorks,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(tappedAuctionInfo)),
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
                    ARAnalyticsClass: ARSignUpSplashViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingGetStarted,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(startOnboarding:)),
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: AROnboardingViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingBudgetSelected,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(setPriceRangeDone:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *parameters){
                                NSInteger range = [parameters.firstObject integerValue];
                                NSString *stringRange = [NSString stringWithFormat:@"%@", @(range)];
                                return @{ @"budget" : stringRange };
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARAppNotificationsDelegate.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsPushNotificationLocal,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(registerUserInterest)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                ARAppNotificationsRequestContext context = ((ARAppNotificationsDelegate *)controller).requestContext;
                                NSString *analyticsContext = @"";
                                if (context == ARAppNotificationsRequestContextArtistFollow) {
                                    analyticsContext = @"ArtistFollow";
                                } else if (context == ARAppNotificationsRequestContextOnboarding) {
                                    analyticsContext = @"Onboarding";
                                } else if (context == ARAppNotificationsRequestContextLaunch) {
                                    analyticsContext = @"Launch";
                                }
        
                                analyticsContext = [@[@"PushNotification", analyticsContext] componentsJoinedByString:@""];

                                return @{
                                         @"action_type" : @"Tap",
                                         @"action_name" : @"Yes",
                                         @"context_screen" : analyticsContext,
                                         };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsPushNotificationLocal,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(registerUserDisinterest)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                ARAppNotificationsRequestContext context = ((ARAppNotificationsDelegate *)controller).requestContext;
                                NSString *analyticsContext = @"";
                                if (context == ARAppNotificationsRequestContextArtistFollow) {
                                    analyticsContext = @"ArtistFollow";
                                } else if (context == ARAppNotificationsRequestContextOnboarding) {
                                    analyticsContext = @"Onboarding";
                                } else if (context == ARAppNotificationsRequestContextLaunch) {
                                    analyticsContext = @"Launch";
                                }
        
                                analyticsContext = [@[@"PushNotification", analyticsContext] componentsJoinedByString:@""];

                                return @{
                                         @"action_type" : @"Tap",
                                         @"action_name" : @"Cancel",
                                         @"context_screen"  : analyticsContext
                                         };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsPushNotificationApple,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(application:didRegisterForRemoteNotificationsWithDeviceToken:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                ARAppNotificationsRequestContext context = ((ARAppNotificationsDelegate *)controller).requestContext;
                                NSString *analyticsContext = @"";
                                if (context == ARAppNotificationsRequestContextArtistFollow) {
                                    analyticsContext = @"ArtistFollow";
                                } else if (context == ARAppNotificationsRequestContextOnboarding) {
                                    analyticsContext = @"Onboarding";
                                } else if (context == ARAppNotificationsRequestContextLaunch) {
                                    analyticsContext = @"Launch";
                                }
                                analyticsContext = [@[@"PushNotification", analyticsContext] componentsJoinedByString:@""];

                                return @{
                                         @"action_type" : @"Tap",
                                         @"action_name" : @"Yes",
                                         @"context_screen"  : analyticsContext
                                         };
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsPushNotificationApple,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(application:didFailToRegisterForRemoteNotificationsWithError:)),
                            ARAnalyticsProperties: ^NSDictionary*(id controller, NSArray *_){
                                ARAppNotificationsRequestContext context = ((ARAppNotificationsDelegate *)controller).requestContext;
                                NSString *analyticsContext = @"";
                                if (context == ARAppNotificationsRequestContextArtistFollow) {
                                    analyticsContext = @"ArtistFollow";
                                } else if (context == ARAppNotificationsRequestContextOnboarding) {
                                    analyticsContext = @"Onboarding";
                                } else if (context == ARAppNotificationsRequestContextLaunch) {
                                    analyticsContext = @"Launch";
                                }
                                analyticsContext = [@[@"PushNotification", analyticsContext] componentsJoinedByString:@""];
                                return @{
                                         @"action_type" : @"Tap",
                                         @"action_name" : @"Cancel",
                                         @"context_screen"  : analyticsContext
                                         };
                            }
                        },
                    ]
                },
                @{
                    ARAnalyticsClass: ARPersonalizeViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingConnectWithFacebook,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(facebookTapped:)),
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeEmail);
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingForgotPassword,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(forgotPassword:)),
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                    return (controller.state == AROnboardingStagePersonalizeLogin);
                                }
                            },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingAlreadyAccountBack,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(backTapped:)),
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                    return (controller.state == AROnboardingStagePersonalizePassword);
                                }
                            },
                        @{
                            ARAnalyticsEventName: ARAnalyticsOnboardingTappedSearch,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(searchStarted:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARPersonalizeViewController *controller, NSArray *_){
                                if (controller.state == AROnboardingStagePersonalizeArtists) {
                                    return @{
                                             @"context_type": @"artists"
                                             };
                                } else if (controller.state == AROnboardingStagePersonalizeCategories) {
                                    return @{
                                             @"context_type": @"categories"
                                             };
                                } else {
                                    return @{};
                                }
                            },
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeArtists ||
                                        controller.state == AROnboardingStagePersonalizeCategories);
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(artistFollowed:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARPersonalizeViewController *controller, NSArray *params){
                                Artist *artist = params.firstObject;
                                NSString *sourceScreen = @"";
                                if (controller.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModePlaceholder) {
                                    sourceScreen = @"onboarding top artists";
                                } else if (controller.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModeSearchResults) {
                                    sourceScreen = @"onboarding search";
                                } else if (controller.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModeRelatedResults) {
                                    sourceScreen = @"onboarding recommended";
                                }
                                return @{
                                         @"artist_slug" : artist.artistID ?: @"",
                                         @"artist_id" : artist.artistID ?: @"",
                                         @"source_screen" : sourceScreen
                                        };
                            },
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeArtists);
                            }
                        },
                        @{
                            ARAnalyticsEventName: ARAnalyticsGeneFollow,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(categoryFollowed:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARPersonalizeViewController *controller, NSArray *params){
                                Gene *gene = params.firstObject;
                                NSString *sourceScreen = @"";
                                if (controller.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModePlaceholder) {
                                    sourceScreen = @"onboarding top categories";
                                } else if (controller.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModeSearchResults) {
                                    sourceScreen = @"onboarding search";
                                } else if (controller.searchResultsTable.contentDisplayMode == ARTableViewContentDisplayModeRelatedResults) {
                                    sourceScreen = @"onboarding recommended";
                                }
                                return @{
                                         @"gene_id" : gene.geneID ?: @"",
                                         @"source_screen" : sourceScreen
                                        };
                            },
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeCategories);
                            }
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
                    ARAnalyticsClass: ARArtistComponentViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: ARAnalyticsArtistView,
                            ARAnalyticsSelectorName: NSStringFromSelector(@selector(viewDidAppear:)),
                            ARAnalyticsProperties: ^NSDictionary*(ARArtistComponentViewController *controller, NSArray *_){
                                return @{
                                    @"artist_id" : controller.artistID ?: @"",
                                };
                            },
                        },
                    ],
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
                   @{
                    ARAnalyticsClass: ARAugmentedFloorBasedVIRViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsEventName: @"success",
                            ARAnalyticsSelectorName: ARAnalyticsSelector(hasRegisteredPlanes),
                            ARAnalyticsProperties: ^NSDictionary *(ARAugmentedFloorBasedVIRViewController *controller, NSArray *parameters) {
                                return @{
                                    @"action_name" : @"arDetectedPlanes",
                                    @"owner_type" : @"artwork",
                                    @"owner_id" : controller.config.artworkID ?: @"unknown",
                                    @"owner_slug": controller.config.artworkSlug ?: @"unknown",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: @"success",
                            ARAnalyticsSelectorName: ARAnalyticsSelector(hasPlacedArtwork),
                            ARAnalyticsProperties: ^NSDictionary *(ARAugmentedFloorBasedVIRViewController *controller, NSArray *parameters) {
                                return @{
                                    @"action_name" : @"arPlacedArtwork",
                                    @"owner_type" : @"artwork",
                                    @"owner_id" : controller.config.artworkID ?: @"unknown",
                                    @"owner_slug": controller.config.artworkSlug ?: @"unknown",
                                };
                            }
                        },
                        @{
                            ARAnalyticsEventName: @"ar_view_in_room_time",
                            ARAnalyticsSelectorName: ARAnalyticsSelector(exitARContext),
                            ARAnalyticsProperties: ^NSDictionary *(ARAugmentedFloorBasedVIRViewController *controller, NSArray *parameters) {
                                return @{
                                    @"length" : @([controller timeInAR])
                                };
                            }
                        }
                    ]
                },
            ], // ========== SCREENS ==========
            ARAnalyticsTrackedScreens: @[
                // ========== ONBOARDING ==========
                @{
                    ARAnalyticsClass: ARSignUpSplashViewController.class,
                    ARAnalyticsDetails: @[ @{ ARAnalyticsPageName: @"Onboarding start" } ]
                },
                @{
                    ARAnalyticsClass: ARPersonalizeViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Onboarding enter your email",
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeEmail);
                                }
                            }
                        ]
                    },
                @{
                    ARAnalyticsClass: ARPersonalizeViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Onboarding enter your password",
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeLogin);
                                }
                            }
                        ]
                    },
                @{
                    ARAnalyticsClass: ARPersonalizeViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Onboarding create a password",
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizePassword);
                                }
                            }
                        ]
                    },
                @{
                    ARAnalyticsClass: ARPersonalizeViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Onboarding enter your full name",
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeName);
                                }
                            }
                        ]
                    },
                @{
                    ARAnalyticsClass: ARPersonalizeViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Onboarding follow artists",
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeArtists);
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARPersonalizeViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Onboarding follow categories",
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeCategories);
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARPersonalizeViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Onboarding select budget",
                            ARAnalyticsShouldFire: ^BOOL(ARPersonalizeViewController *controller, NSArray *_) {
                                return (controller.state == AROnboardingStagePersonalizeBudget);
                            }
                        }
                    ]
                }, // ========== PRIMARY NAVIGATION ==========
                @{
                    ARAnalyticsClass: ARAppSearchViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Search",
                        }
                    ]
                },
                // ========== CORE CONTENT SCREENS ==========
                @{
                    ARAnalyticsClass: ARArtworkViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Artwork",
                            ARAnalyticsSelectorName: ARAnalyticsSelector(artworkHasLoaded),
                            ARAnalyticsProperties: ^NSDictionary *(ARArtworkViewController *vc, NSArray *_) {
                                ARArtworkView *view = (ARArtworkView *)vc.view;
                                NSDictionary *basics =  @{
                                    @"owner_type": @"artwork",
                                    @"owner_id": view.artwork.artworkUUID ?: @"",
                                    @"owner_slug": view.artwork.artworkID ?: @"",
                                    @"acquireable": view.artwork.isAcquireable ?: @(NO),
                                    @"offerable": view.artwork.isOfferable ?: @(NO),
                                    @"availability": view.artwork.availablityString ?: @"",
                                    @"price_listed": @(view.artwork.price.length != 0) ?: @(NO)
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
                    ARAnalyticsClass: ARArtworkInfoViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Artwork More Info",
                            ARAnalyticsSelectorName: @"viewDidAppear:",
                            ARAnalyticsProperties: ^NSDictionary *(ARArtworkInfoViewController *controller, NSArray *_) {
                                return @{
                                    @"owner_type": @"artwork",
                                    @"owner_id": controller.artwork.artworkUUID ?: @"",
                                    @"owner_slug": controller.artwork.artworkID ?: @""
                                };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARArtistComponentViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Artist",
                            ARAnalyticsProperties: ^NSDictionary *(ARArtistComponentViewController *controller, NSArray *_) {
                                return @{
                                     @"owner_type": @"artist",
                                     @"owner_id": @"",
                                     @"owner_slug": controller.artistID ?: @"",
                                     @"partial" : @"true"
                                 };
                            }
                        }
                    ]
                },
                @{
                    ARAnalyticsClass: ARGeneComponentViewController.class,
                    ARAnalyticsDetails: @[
                        @{
                            ARAnalyticsPageName: @"Category",
                            ARAnalyticsProperties: ^NSDictionary *(ARGeneComponentViewController *controller, NSArray *_) {
                                return @{
                                    @"owner-type": @"gene",
                                    @"owner-id": @"",
                                    @"owner-slug": controller.geneID ?: @"",
                                    @"partial" : @"true"
                                };
                            }
                        }
                    ]
                },
                // ========== OTHER ==========
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
                @{
                    ARAnalyticsClass: ARAugmentedVIRSetupViewController.class,
                    ARAnalyticsDetails: @[ @{ ARAnalyticsPageName: @"AR Allow Camera Access" } ]
                },
                @{
                    ARAnalyticsClass: ARAugmentedFloorBasedVIRViewController.class,
                    ARAnalyticsDetails: @[ @{ ARAnalyticsPageName: @"AR View in Room" } ]
                },
            ]
        }
    ];

    [ARUserManager identifyAnalyticsUser];
    [ARAnalytics incrementUserProperty:ARAnalyticsAppUsageCountProperty byInt:1];

    if (ARAppStatus.isRunningTests == NO) {
        // Skipping ARAnalytics because Adjust has its own expectations
        // around event names being < 6 chars
        ADJConfig *adjustConfig = [ADJConfig configWithAppToken:keys.adjustProductionAppToken environment:adjustEnv];

        // This has to be called at the absolute latest, definitely *after* identifying the user, because tracked
        // install events will not contain the associated anonymous ID otherwise.
        [Adjust appDidLaunch:adjustConfig];
    }
}

@end
