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

@interface TabData : NSObject
@property (strong, nonatomic, readonly) NSString *analyticsDescription;
@property (strong, nonatomic, readonly) NSString *route;
@property (strong, nonatomic, readonly) NSString *name;
@property (strong, nonatomic) ARNavigationController *cachedNavigationController;
@property (strong, nonatomic) UIViewController* (^construct)(void);

- (ARNavigationController *)navigationController;
- (instancetype) initWithConstructor:(UIViewController* (^)(void))construct name:(NSString *)name route:(NSString *)route analyticsDescription:(NSString *)analyticsDescription;

@end

@implementation TabData

-(instancetype)initWithConstructor:(UIViewController *(^)(void))construct name:(NSString *)name route:(NSString *)route analyticsDescription:(NSString *)analyticsDescription
{
    self = [self init];
    if (self) {
        _name = name;
        _route = route;
        _analyticsDescription = analyticsDescription;
        _construct = construct;
    }
    return self;
}
- (ARNavigationController *)navigationController
{
    if (self.cachedNavigationController) {
        return self.cachedNavigationController;
    }
    self.cachedNavigationController = [[ARNavigationController alloc] initWithRootViewController:self.construct()];
    return self.cachedNavigationController;
}

@end

@interface ARTopMenuNavigationDataSource ()
@property (strong, nonatomic, readonly) NSDictionary<NSNumber*, TabData*> *config;
@end

@implementation ARTopMenuNavigationDataSource

- init {
    self = [super init];
    if (self) {
        _config = @{
            @(ARHomeTab):
                [[TabData alloc] initWithConstructor:^() { return [[ARHomeComponentViewController alloc] init]; }
                            name:@"ARHomeTab"
                           route:@"/"
            analyticsDescription:@"home"],
            @(ARSalesTab):
                [[TabData alloc] initWithConstructor:^() { return [[ARSalesComponentViewController alloc] init]; }
                                name:@"ARSalesTab"
                               route:@"/sales"
                analyticsDescription:@"sell"],
            @(ARSearchTab):
                [[TabData alloc] initWithConstructor:^() { return [[ARSearchComponentViewController alloc] init]; }
                                name:@"ARSearchTab"
                               route:@"/search"
                analyticsDescription:@"search"],
            @(ARMessagingTab):
                [[TabData alloc] initWithConstructor:^() { return [[ARInboxComponentViewController alloc] initWithInbox]; }
                                name:@"ARMessagingTab"
                               route:@"/inbox"
                analyticsDescription:@"messages"],
            @(ARMyProfileTab):
                [[TabData alloc] initWithConstructor:^() { return [[ARMyProfileComponentViewController alloc] init]; }
                            name:@"ARMyProfileTab"
                           route:@"/my-profile"
            analyticsDescription:@"profile"],
        };
    }
    return self;
}

- (ARNavigationController * (^)(void)) memoize:(UIViewController * (^)(void))constructor
{
    __strong __block ARNavigationController* result = nil;
    return ^() {
        if (result) {
            return result;
        }
        result = [[ARNavigationController alloc] initWithRootViewController:constructor()];
        return result;
    };
}

- (ARNavigationController *)navigationControllerForTabType:(ARTopTabControllerTabType)tabType
{
    return [[self.config objectForKey:@(tabType)] navigationController];
}

- (NSString *)switchBoardRouteForTabType:(ARTopTabControllerTabType)tabType
{
    return [[self.config objectForKey:@(tabType)] route];
}

- (NSString *)tabNameForTabType:(ARTopTabControllerTabType)tabType
{
    return [[self.config objectForKey:@(tabType)] name];
}

- (NSString *)analyticsDescriptionForTabType:(ARTopTabControllerTabType)tabType
{
    return [[self.config objectForKey:@(tabType)] analyticsDescription];
}

- (NSArray<NSNumber *> *)registeredTabTypes
{
    return self.config.allKeys;
}

@end
