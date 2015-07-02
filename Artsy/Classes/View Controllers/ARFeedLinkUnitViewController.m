#import "ARFeedLinkUnitViewController.h"
#import "ARNavigationButton.h"


@implementation ARFeedLinkUnitViewController

- (void)fetchLinks:(void (^)(void))completion
{
    if (ARIsRunningInDemoMode) {
        FeaturedLink *link = [self defaultFeedLink];
        [self addButtonDescriptions:[self phoneNavigationForFeaturedLinks:@[ link ]]];

        if (completion) {
            completion();
        }
        return;
    }

    @weakify(self);

    // edit set here: http://admin.artsy.net/set/52277573c9dc24da5b00020c
    [ArtsyAPI getOrderedSetItemsWithKey:@"eigen:feed-links" success:^(NSArray *items) {
        @strongify(self);
        [self addButtonDescriptions:[self phoneNavigationForFeaturedLinks:items]];
        completion();
    } failure:^(NSError *error) {
        completion();
    }];

    // edit set here: https://admin.artsy.net/set/54e255e9726169752bbb1b00
    if ([User currentUser]) {
        [ArtsyAPI getOrderedSetItemsWithKey:@"eigen:logged-in-feed-links" success:^(NSArray *items) {
            @strongify(self);
            [self addButtonDescriptions:[self phoneNavigationForFeaturedLinks:items]];
            completion();
        } failure:^(NSError *error) {
            completion();
        }];
    }

    NSString *bundleID = [[NSBundle mainBundle] bundleIdentifier];
    if ([bundleID containsString:@".dev"] || [bundleID containsString:@".beta"]) {
        // edit set here: http://admin.artsy.net/set/5308e7be9c18db75fd000343
        [ArtsyAPI getOrderedSetItemsWithKey:@"eigen:beta-feed-links" success:^(NSArray *items) {
            @strongify(self);
            [self addButtonDescriptions:[self phoneNavigationForFeaturedLinks:items]];
            completion();
        } failure:^(NSError *error) {
            completion();
        }];
    }
}

- (NSArray *)phoneNavigationForFeaturedLinks:(NSArray *)featuredLinks
{
    @weakify(self);
    NSMutableArray *phoneNavigation = [NSMutableArray array];
    for (FeaturedLink *featuredLink in featuredLinks) {
        [phoneNavigation addObject:@{
            ARNavigationButtonClassKey: ARSerifNavigationButton.class,
            ARNavigationButtonPropertiesKey: @{
                @keypath(ARSerifNavigationButton.new, title): featuredLink.title,
                @keypath(ARSerifNavigationButton.new, subtitle): featuredLink.subtitle
            },
            ARNavigationButtonHandlerKey: ^(UIButton *sender) {
                @strongify(self);
                UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:featuredLink.href];
                [self.navigationController pushViewController:viewController animated:YES];
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
        @"href" : @"http://m.artsy.net/home/featured_works",
        @"display_on_mobile" : @YES
    }];
}

@end
