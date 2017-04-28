// MARK: Formatter Exempt

#import "ARFeedLinkUnitViewController.h"

#import "ARTopMenuViewController.h"
#import "UIViewController+TopMenuViewController.h"

#import "ArtsyAPI+OrderedSets.h"
#import "ARNavigationButton.h"
#import "ARAppStatus.h"

#import "FeaturedLink.h"
#import "User.h"
#import "ARAppConstants.h"
#import "ARSwitchBoard+Eigen.h"

#import "MTLModel+JSON.h"
#import "ARMacros.h"

#import <ReactiveCocoa/ReactiveCocoa.h>


@implementation ARFeedLinkUnitViewController

- (void)fetchLinks:(void (^)(void))completion
{
    if (ARAppStatus.isDemo) {
        FeaturedLink *link = [self defaultFeedLink];
        [self addButtonDescriptions:[self phoneNavigationForFeaturedLinks:@[ link ]]];

        if (completion) {
            completion();
        }
        return;
    }

    __weak typeof(self) wself = self;

    // edit set here: http://admin.artsy.net/set/52277573c9dc24da5b00020c
    [ArtsyAPI getOrderedSetItemsWithKey:@"eigen:feed-links" success:^(NSArray *items) {
        __strong typeof (wself) sself = wself;
        [sself addButtonDescriptions:[sself phoneNavigationForFeaturedLinks:items]];
        completion();
    } failure:^(NSError *error) {
        completion();
    }];

    // edit set here: https://admin.artsy.net/set/54e255e9726169752bbb1b00
    if ([User currentUser]) {
        [ArtsyAPI getOrderedSetItemsWithKey:@"eigen:logged-in-feed-links" success:^(NSArray *items) {
            __strong typeof (wself) sself = wself;
            [sself addButtonDescriptions:[sself phoneNavigationForFeaturedLinks:items]];
            completion();
        } failure:^(NSError *error) {
            completion();
        }];
    }

    if (ARAppStatus.isBetaOrDev) {
        // edit set here: http://admin.artsy.net/set/5308e7be9c18db75fd000343
        [ArtsyAPI getOrderedSetItemsWithKey:@"eigen:beta-feed-links" success:^(NSArray *items) {
            __strong typeof (wself) sself = wself;
            [sself addButtonDescriptions:[sself phoneNavigationForFeaturedLinks:items]];
            completion();
        } failure:^(NSError *error) {
            completion();
        }];
    }
}

- (NSArray *)phoneNavigationForFeaturedLinks:(NSArray *)featuredLinks
{
    __weak typeof(self) wself = self;
    NSMutableArray *phoneNavigation = [NSMutableArray array];
    for (FeaturedLink *featuredLink in featuredLinks) {
        [phoneNavigation addObject:@{
            ARNavigationButtonClassKey: ARSerifNavigationButton.class,
            ARNavigationButtonPropertiesKey: @{
                ar_keypath(ARSerifNavigationButton.new, title): featuredLink.title,
                ar_keypath(ARSerifNavigationButton.new, subtitle): featuredLink.subtitle
            },
            ARNavigationButtonHandlerKey: ^(UIButton *sender) {
                __strong typeof (wself) sself = wself;
                NSString *strippedAddress = [featuredLink.href stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
                UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:strippedAddress];
                [sself.ar_TopMenuViewController pushViewController:viewController animated:ARPerformWorkAsynchronously];
            }
        }];
    }
    return phoneNavigation;
}

- (FeaturedLink *)defaultFeedLink
{
    return [FeaturedLink modelWithJSON:@{
        @"id" : @"52277695c9dc2405b000022b",
        @"image_url" : @"http://static1.artsy.net/featured_links/52277695c9dc2405b000022b/:version.jpg",
        @"title" : @"Featured Works For Sale",
        @"subtitle" : @"",
        @"href" : @"http://www.artsy.net/home/featured_works",
        @"display_on_mobile" : @YES
    }];
}

@end
