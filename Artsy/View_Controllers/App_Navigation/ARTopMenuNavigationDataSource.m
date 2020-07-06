#import "ARTopMenuNavigationDataSource.h"

#import "ARFeedTimeline.h"
#import <Emission/AREmission.h>
#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARInboxComponentViewController.h>
#import <Emission/ARFavoritesComponentViewController.h>
#import <Emission/ARMyProfileComponentViewController.h>
#import <Emission/ARMapContainerViewController.h>
#import <Emission/ARSearchComponentViewController.h>
#import <Emission/ARSalesComponentViewController.h>

#import "AREigenMapContainerViewController.h"
#import "UIDevice-Hardware.h"
#import "ARFeedSubclasses.h"
#import "FeaturedLink.h"
#import "ARNavigationController.h"
#import "AROptions.h"
#import "ARDefaults.h"
#import "ARSwitchBoard.h"
#import "ArtsyEcho.h"

#import <SDWebImage/SDWebImagePrefetcher.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARTopMenuNavigationDataSource ()
@end

@implementation ARTopMenuNavigationDataSource

- (ARNavigationController * (^)(void)) memoize:(UIViewController * (^)(void))constructor
{
    __block ARNavigationController* result = nil;
    return ^() {
        if (result) {
            return result;
        }
        result = [[ARNavigationController alloc] initWithRootViewController:constructor()];
        return result;
    };
}

- (NSDictionary<NSNumber*, NSDictionary*> *)config
{
    return @{
        @(ARHomeTab): @{
            @"getNavigationController": [self memoize:^() { return [[ARHomeComponentViewController alloc] init]; }],
            @"analyticsDescrpition": @"home",
            @"route": @"/",
            @"name": @"ARHomeTab"
        },
        @(ARSalesTab): @{
            @"getNavigationController": [self memoize:^() { return [[ARSalesComponentViewController alloc] init]; }],
            @"analyticsDescrpition": @"sell",
            @"route": @"/sales",
            @"name": @"ARSalesTab"
        },
        @(ARSearchTab): @{
            @"getNavigationController": [self memoize:^() { return [[ARSearchComponentViewController alloc] init]; }],
            @"analyticsDescrpition": @"search",
            @"route": @"/search",
            @"name": @"ARSearchTab"
        },
        @(ARMessagingTab): @{
            @"getNavigationController": [self memoize:^() { return [[ARInboxComponentViewController alloc] initWithInbox]; }],
            @"analyticsDescrpition": @"messages",
            @"route": @"/inbox",
            @"name": @"ARMessagingTab"
        },
        @(ARMyProfileTab): @{
            @"getNavigationController": [self memoize:^() { return [[ARMyProfileComponentViewController alloc] init]; }],
            @"analyticsDescrpition": @"profile",
            @"route": @"/profile-ios",
            @"name": @"ARMessagingTab"
        },
    };
}

- (ARNavigationController *)navigationControllerForTabType:(ARTopTabControllerTabType)tabType
{
    NSDictionary* tabConfig = [self.config objectForKey:@(tabType)];
    ARNavigationController* (^getter)(void) = [tabConfig valueForKey:@"getNavigationController"];
    return getter();
}

- (NSString *)switchBoardRouteForTabType:(ARTopTabControllerTabType)tabType
{
    NSDictionary* tabConfig = [self.config objectForKey:@(tabType)];
    return [tabConfig valueForKey:@"route"];
}

- (NSString *)tabNameForTabType:(ARTopTabControllerTabType)tabType
{
    NSDictionary* tabConfig = [self.config objectForKey:@(tabType)];
    return [tabConfig valueForKey:@"name"];
}

- (NSString *)analyticsDescriptionForTabType:(ARTopTabControllerTabType)tabType
{
    NSDictionary* tabConfig = [self.config objectForKey:@(tabType)];
    return [tabConfig valueForKey:@"analyticsDescrpition"];
}

- (NSArray<NSNumber *> *)registeredTabTypes
{
    return self.config.allKeys;
}

@end
