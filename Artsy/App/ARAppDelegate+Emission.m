#import "ARAppDelegate+Emission.h"

#import "ARUserManager.h"
#import "Artist.h"
#import "Gene.h"
#import "ArtsyAPI+Following.h"
#import "ArtsyAPI+Notifications.h"
#import "ARDispatchManager.h"
#import "ARNetworkErrorManager.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARTopMenuViewController.h"
#import "ARAppConstants.h"
#import "AROptions.h"
#import "ARMenuAwareViewController.h"
#import "ARAppNotificationsDelegate.h"
#import "ARDefaults.h"
#import "ARNavigationController.h"
#import "ARTopMenuViewController.h"

#import <Aerodramus/Aerodramus.h>
#import <Emission/AREmission.h>
#import <Emission/ARTemporaryAPIModule.h>
#import <Emission/ARSwitchBoardModule.h>
#import <Emission/AREventsModule.h>
#import <Emission/ARRefineOptionsModule.h>
#import <Emission/ARWorksForYouModule.h>
#import <Emission/ARArtistComponentViewController.h>

#import <React/RCTUtils.h>
#import <objc/runtime.h>
#import <ARAnalytics/ARAnalytics.h>
#import <AppHub/AppHub.h>
#import "Artsy-Swift.h"

static void
FollowRequestSuccess(RCTResponseSenderBlock block, BOOL following)
{
    block(@[ [NSNull null], @(following) ]);
}

static void
FollowRequestFailure(RCTResponseSenderBlock block, BOOL following, NSError *error)
{
    ar_dispatch_main_queue(^{
        [ARNetworkErrorManager presentActiveError:error withMessage:@"Failed to follow artist."];
    });
    block(@[ RCTJSErrorFromNSError(error), @(following) ]);
}


@implementation ARAppDelegate (Emission)

- (void)setupEmission;
{
    // AppHub's loading of our Emission instance is Async, so we let
    // the normal JS run, then if we get the notification of a new build
    // we switch out the current emission instance.
    //
    if ([AROptions boolForOption:AROptionsStagingReactEnv]) {
        [AppHub setLogLevel:AHLogLevelDebug];
        [AppHub setApplicationID:@"Z6IwqK52JBXrKLI4kpvJ"];

        NSString *emissionHeadVersion = [[NSUserDefaults standardUserDefaults] valueForKey:AREmissionHeadVersionDefault];
        [[AppHub buildManager] setAutomaticPollingEnabled:NO];
        [[AppHub buildManager] setInstalledAppVersion:emissionHeadVersion];
        [[AppHub buildManager] setDebugBuildsEnabled:YES];

        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(newEmissionBuild) name:AHBuildManagerDidMakeBuildAvailableNotification object:nil];

        [[AppHub buildManager] fetchBuildWithCompletionHandler:^(AHBuild *result, NSError *error) {
            [self newEmissionBuild];
        }];
    }

    // Allow using the local version of Emission
    if ([AROptions boolForOption:AROptionsDevReactEnv]) {
        NSURL *packagerURL = [NSURL URLWithString:@"http://localhost:8081/Example/Emission/index.ios.bundle?platform=ios&dev=true"];
        [self setupSharedEmissionWithPackagerURL:packagerURL];

    } else {
        // The normal flow for users
        [self setupSharedEmissionWithPackagerURL:nil];
    }
}

- (void)newEmissionBuild
{
    AHBuild *build = [[AppHub buildManager] currentBuild];
    NSURL *jsCodeLocation = [build.bundle URLForResource:@"main" withExtension:@"jsbundle"];
    [self setupSharedEmissionWithPackagerURL:jsCodeLocation];
}

- (void)setupSharedEmissionWithPackagerURL:(NSURL *)packagerURL;
{
    NSString *userID = [[[ARUserManager sharedManager] currentUser] userID];
    NSString *authenticationToken = [[ARUserManager sharedManager] userAuthenticationToken];
    NSParameterAssert(userID);
    NSParameterAssert(authenticationToken);

    AREmission *emission = [[AREmission alloc] initWithUserID:userID
                                          authenticationToken:authenticationToken
                                                  packagerURL:packagerURL
                                        useStagingEnvironment:[AROptions boolForOption:ARUseStagingDefault]];
    [AREmission setSharedInstance:emission];

#pragma mark - Native Module: Follow status

    emission.APIModule.artistFollowStatusProvider = ^(NSString *artistID, RCTResponseSenderBlock block) {
        [ArtsyAPI checkFavoriteStatusForArtist:[[Artist alloc] initWithArtistID:artistID]
                                       success:^(BOOL following) {
                                         FollowRequestSuccess(block, following);
                                       }
                                       failure:^(NSError *error) {
                                         FollowRequestFailure(block, NO, error);
                                       }];
    };
    emission.APIModule.artistFollowStatusAssigner = ^(NSString *artistID, BOOL following, RCTResponseSenderBlock block) {
        [ArtsyAPI setFavoriteStatus:following
                          forArtist:[[Artist alloc] initWithArtistID:artistID]
                            success:^(id response) {
                                FollowRequestSuccess(block, following);
                            }
                            failure:^(NSError *error) {
                                FollowRequestFailure(block, !following, error);
                            }];
    };

    emission.APIModule.geneFollowStatusProvider = ^(NSString *geneID, RCTResponseSenderBlock block) {
        [ArtsyAPI checkFavoriteStatusForGene:[[Gene alloc] initWithGeneID:geneID]
                                     success:^(BOOL following) {
                                         FollowRequestSuccess(block, following);
                                     }
                                     failure:^(NSError *error) {
                                         FollowRequestFailure(block, NO, error);
                                     }];
    };

    emission.APIModule.geneFollowStatusAssigner = ^(NSString *geneID, BOOL following, RCTResponseSenderBlock block) {
        [ArtsyAPI setFavoriteStatus:following
                            forGene:[[Gene alloc] initWithGeneID:geneID]
                            success:^(id response) {
                                FollowRequestSuccess(block, following);
                            }
                            failure:^(NSError *error) {
                                FollowRequestFailure(block, !following, error);
                            }];
    };

    emission.APIModule.notificationReadStatusAssigner = ^(RCTResponseSenderBlock block) {
        NSLog(@"notificationsReadStatusAssigner");
        [ArtsyAPI markUserNotificationsReadWithSuccess:^(id response) {
            block(@[[NSNull null]]);
        } failure:^(NSError *error) {
            block(@[ RCTJSErrorFromNSError(error)]);
        }];
    };

#pragma mark - Native Module: Refine filter

    emission.refineModule.triggerRefine = ^(NSDictionary *_Nonnull initial, NSDictionary *_Nonnull current, UIViewController *_Nonnull controller, RCTPromiseResolveBlock resolve, RCTPromiseRejectBlock reject) {
        [RefineSwiftCoordinator showRefineSettingForGeneSettings:controller initial:initial current:current completion:^(NSDictionary<NSString *,id> * _Nullable newRefineSettings) {
            if (newRefineSettings) {
                resolve(newRefineSettings);
            } else {
                reject(@"no_changes", @"No refinement changes were made", nil);
            }
        }];
    };

#pragma mark - Native Module: SwitchBoard

    emission.switchBoardModule.presentNavigationViewController = ^(UIViewController *_Nonnull fromViewController,
                                                                   NSString *_Nonnull route) {
        UIViewController *viewController = [[ARSwitchBoard sharedInstance] loadPath:route];
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
    };

    emission.switchBoardModule.presentModalViewController = ^(UIViewController *_Nonnull fromViewController,
                                                              NSString *_Nonnull route) {
        if ([route isEqualToString:@"/search"]) {
            [[ARTopMenuViewController sharedController].rootNavigationController toggleSearch];
        } else {
            UIViewController *viewController = [[ARSwitchBoard sharedInstance] loadPath:route];
            [[ARTopMenuViewController sharedController] presentViewController:viewController
                                                                     animated:ARPerformWorkAsynchronously
                                                                   completion:nil];
        }
    };

#pragma mark - Native Module: Events/Analytics

    emission.eventsModule.eventOccurred = ^(UIViewController *_Nonnull fromViewController, NSDictionary *_Nonnull info) {
        NSMutableDictionary *properties = [info mutableCopy];
        [properties removeObjectForKey:@"name"];
        [ARAnalytics event:info[@"name"] withProperties:[properties copy]];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if ([info[@"name"] isEqual:@"Follow artist"] && [fromViewController isKindOfClass:[ARArtistComponentViewController class]]) {
                ARAppNotificationsDelegate *remoteNotificationsDelegate = [[JSDecoupledAppDelegate sharedAppDelegate] remoteNotificationsDelegate];
                [remoteNotificationsDelegate registerForDeviceNotificationsWithContext:ARAppNotificationsRequestContextArtistFollow];
            }
        });
    };

#pragma mark - Native Module: WorksForYou

    emission.worksForYouModule.setNotificationsCount = ^(NSInteger count) {
        [[ARTopMenuViewController sharedController] setNotificationCount:0 forControllerAtIndex:ARTopTabControllerIndexNotifications];
    };
}

@end

#pragma mark - ARMenuAwareViewController additions


@interface ARArtistComponentViewController (ARMenuAwareViewController) <ARMenuAwareViewController>
@end


@implementation ARArtistComponentViewController (ARMenuAwareViewController)

static UIScrollView *
FindFirstScrollView(UIView *view)
{
    for (UIView *subview in view.subviews) {
        if ([subview isKindOfClass:UIScrollView.class]) {
            return (UIScrollView *)subview;
        }
    }
    for (UIView *subview in view.subviews) {
        UIScrollView *result = FindFirstScrollView(subview);
        if (result) return result;
    }
    return nil;
}

- (void)viewDidLayoutSubviews;
{
    [super viewDidLayoutSubviews];
    self.menuAwareScrollView = FindFirstScrollView(self.view);
}

static char menuAwareScrollViewKey;

- (void)setMenuAwareScrollView:(UIScrollView *)scrollView;
{
    if (scrollView != self.menuAwareScrollView) {
        [self willChangeValueForKey:@"menuAwareScrollView"];
        objc_setAssociatedObject(self, &menuAwareScrollViewKey, scrollView, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
        [self didChangeValueForKey:@"menuAwareScrollView"];
    }
}

- (UIScrollView *)menuAwareScrollView;
{
    return objc_getAssociatedObject(self, &menuAwareScrollViewKey);
}

@end
