#import "ARAppDelegate+Emission.h"

#import "ARUserManager.h"
#import "Artist.h"
#import "ArtsyAPI+Following.h"
#import "ARTrialController.h"
#import "ARDispatchManager.h"
#import "ARNetworkErrorManager.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARTopMenuViewController.h"
#import "ARAppConstants.h"
#import "ARMenuAwareViewController.h"

#import <Aerodramus/Aerodramus.h>
#import <Emission/AREmission.h>
#import <Emission/ARTemporaryAPIModule.h>
#import <Emission/ARSwitchBoardModule.h>
#import <Emission/AREventsModule.h>
#import <Emission/ARArtistComponentViewController.h>

#import <React/RCTUtils.h>
#import <objc/runtime.h>
#import <ARAnalytics/ARAnalytics.h>

static void
ArtistFollowRequestSuccess(RCTResponseSenderBlock block, BOOL following)
{
    block(@[[NSNull null], @(following)]);
}

static void
ArtistFollowRequestFailure(RCTResponseSenderBlock block, BOOL following, NSError *error)
{
    ar_dispatch_main_queue(^{
        [ARNetworkErrorManager presentActiveError:error withMessage:@"Failed to follow artist."];
    });
    block(@[RCTJSErrorFromNSError(error), @(following)]);
}

static void
ArtistGetFollowStatus(NSString *artistID, RCTResponseSenderBlock block)
{
    [ArtsyAPI checkFavoriteStatusForArtist:[[Artist alloc] initWithArtistID:artistID]
                                   success:^(BOOL following) { ArtistFollowRequestSuccess(block, following); }
                                   failure:^(NSError *error) { ArtistFollowRequestFailure(block, NO, error); }];
}

static void
ArtistSetFollowStatus(NSString *artistID, BOOL following, RCTResponseSenderBlock block)
{
    [ArtsyAPI setFavoriteStatus:following
                      forArtist:[[Artist alloc] initWithArtistID:artistID]
                        success:^(id response)    { ArtistFollowRequestSuccess(block, following); }
                        failure:^(NSError *error) { ArtistFollowRequestFailure(block, !following, error); }];
}

@implementation ARAppDelegate (Emission)

- (void)setupEmission;
{

    AREmission *emission = [AREmission sharedInstance];
    emission.APIModule.artistFollowStatusProvider = ^(NSString *artistID, RCTResponseSenderBlock block) {
        // Leave the view state ‘unselected’ if there’s no signed-in user.
        if ([[ARUserManager sharedManager] currentUser] != nil) {
            ArtistGetFollowStatus(artistID, block);
        }
    };
    emission.APIModule.artistFollowStatusAssigner = ^(NSString *artistID, BOOL following, RCTResponseSenderBlock block) {
        if ([[ARUserManager sharedManager] currentUser] == nil) {
            // Leave the view state ‘unselected’ until after the user signs in/up.
            ar_dispatch_main_queue(^{
                [ARTrialController presentTrialWithContext:ARTrialContextFavoriteArtist success:^(BOOL _) {
                    ArtistSetFollowStatus(artistID, following, block);
                }];
            });
        } else {
            // TODO: Can’t optimistically change the view state before the request, because a RCTResponseSenderBlock may
            //       only be invoked once.
            ArtistSetFollowStatus(artistID, following, block);
        }
    };
    
    emission.switchBoardModule.presentNavigationViewController = ^(UIViewController * _Nonnull fromViewController,
                                                                   NSString * _Nonnull route) {
        UIViewController *viewController = [[ARSwitchBoard sharedInstance] loadPath:route];
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
    };
    
    emission.switchBoardModule.presentModalViewController = ^(UIViewController * _Nonnull fromViewController,
                                                              NSString * _Nonnull route) {
        UIViewController *viewController = [[ARSwitchBoard sharedInstance] loadPath:route];
        [[ARTopMenuViewController sharedController] presentViewController:viewController
                                                                 animated:ARPerformWorkAsynchronously
                                                               completion:nil];
    };
  
    emission.eventsModule.eventOccurred = ^(UIViewController * _Nonnull fromViewController, NSDictionary * _Nonnull info) {
        NSMutableDictionary *properties = [info mutableCopy];
        [properties removeObjectForKey:@"name"];
        [ARAnalytics event:info[@"name"] withProperties:[properties copy]];
    };
}

@end

#pragma mark - ARMenuAwareViewController additions

@interface ARArtistComponentViewController (ARMenuAwareViewController) <ARMenuAwareViewController>
@end

@implementation ARArtistComponentViewController (ARMenuAwareViewController)

static UIScrollView *
FindFirstScrollView(UIView *view) {
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