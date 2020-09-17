#import "ARSwitchBoard+Eigen.h"

#import "ARAppStatus.h"

// View Controllers
#import "ARInternalMobileWebViewController.h"
#import "ARAuctionWebViewController.h"

#import <Emission/ARBidFlowViewController.h>

#import "ArtsyEcho.h"
#import "Artsy-Swift.h"
#import "AROptions.h"
#import <ObjectiveSugar/ObjectiveSugar.h>
#import "PartnerShow.h"

@interface ARSwitchBoard (Private)
@property (nonatomic, strong) Aerodramus *echo;
@end

@implementation ARSwitchBoard (Eigen)


#pragma mark -
#pragma mark Partner

- (UIViewController *)loadPartnerWithID:(NSString *)partnerID
{
    return [self loadPath:partnerID];
}

#pragma mark -
#pragma mark Artists



- (UIViewController *)loadProfileWithID:(NSString *)profileID
{
    NSString *unknownProfilePath = [profileID stringByAppendingString:@"?entity=unknown"];
    return [self loadPath:unknownProfilePath];
}

- (UIViewController *)loadOrderUIForID:(NSString *)orderID resumeToken:(NSString *)resumeToken
{
    NSString *path = [NSString stringWithFormat:@"/order/%@/resume?token=%@", orderID, resumeToken];
    return [self loadPath:path];
}

@end
