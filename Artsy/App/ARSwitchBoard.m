#import "ARSwitchBoard.h"

#import "ARAppConstants.h"
#import "ARRouter.h"
#import "AROptions.h"
#import "Artsy-Swift.h"
#import <JLRoutes/JLRoutes.h>
#import "ARTopMenuNavigationDataSource.h"
#import "ARAppDelegate+Emission.h"

#import "Fair.h"
#import "User.h"

// View Controllers
#import "ARAuctionWebViewController.h"
#import "AREigenMapContainerViewController.h"
#import "ARInternalMobileWebViewController.h"

#import "ARSerifNavigationViewController.h"
#import "ARTopMenuNavigationDataSource.h"
#import "ARTopMenuViewController.h"

#import <Emission/AREmission.h>
#import "ARNotificationsManager.h"

#import <Emission/ARMyProfileComponentViewController.h>
#import "ArtsyEcho.h"
#import "Artsy-Swift.h"
#import "UIDevice-Hardware.h"

#import <JLRoutes/JLRoutes.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


NSString *const AREscapeSandboxQueryString = @"eigen_escape_sandbox";


@interface ARSwitchBoardDomain : NSObject
@property (nonatomic, copy) id (^block)(NSURL *url);
@property (nonatomic, copy) NSString *domain;
@end


@implementation ARSwitchBoardDomain
@end


@interface ARSwitchBoard ()

@property (nonatomic, strong) NSArray<ARSwitchBoardDomain *> *domains;

@end


@implementation ARSwitchBoard

static ARSwitchBoard *sharedInstance = nil;

#pragma mark - Lifecycle

+ (instancetype)sharedInstance
{
    if (sharedInstance == nil) {
        sharedInstance = [[ARSwitchBoard alloc] init];
    }
    return sharedInstance;
}

+ (void)teardownSharedInstance {
    sharedInstance = nil;
}

#define JLRouteParams ^id _Nullable(NSDictionary *_Nullable parameters)

- (id)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _domains = @[];

    return self;
}

- (NSURL *)resolveRelativeUrl:(NSString *)path
{
    return [NSURL URLWithString:path relativeToURL:[ARRouter baseWebURL]];
}

- (NSURL *)fixHostForURL:(NSURL *)url
{
    // from applewebdata://EF86F744-3F4F-4732-8A4B-3E5E94D6D7DA/artist/marcel-duchamp
    // to http://artsy.net/artist/marcel-duchamp/

    if ([url.absoluteString hasPrefix:@"applewebdata"]) {
        NSArray *components = [url.absoluteString componentsSeparatedByString:@"/"];
        NSArray *lastTwo = @[ components[components.count - 2], components[components.count - 1] ];
        NSString *newURLString = [NSString stringWithFormat:@"http://artsy.net/%@/%@", lastTwo[0], lastTwo[1]];
        return [NSURL URLWithString:newURLString];
    }
    return url;
}

@end
