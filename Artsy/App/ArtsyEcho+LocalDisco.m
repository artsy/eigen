#import "ArtsyEcho+LocalDisco.h"
#import "ARAppStatus.h"
#import "User.h"
#import "UIDevice-Hardware.h"
#import <ObjectiveSugar/ObjectiveSugar.h>

/// To be kept in lock-step with the corresponding echo value, and updated when there is a breaking Maps change.
/// https://echo-web-production.herokuapp.com/accounts/1/features
///
NSInteger const ARLocalDiscoCurrentVersionCompatibility = 2;

@implementation ArtsyEcho (LocalDiscovery)

- (BOOL)shouldShowLocalDiscovery
{
    return (self.features[@"AREnableLocalDiscovery"].state && self.isLocalDiscoCompatible) || [ARAppStatus isAdmin] || [self userIsAllowListed];
}

- (BOOL)isLocalDiscoCompatible
{
    if ([UIDevice isPad]) {
        return NO;
    }

    Message *localDiscoVersion = self.messages[@"LocalDiscoveryCurrentVersion"];

    return localDiscoVersion.content.integerValue >= ARLocalDiscoCurrentVersionCompatibility;
}

- (BOOL)userIsAllowListed
{
    BOOL userInAllowList = NO;
    Message *allowListMessage = self.messages[@"LocalDiscoveryAllowListCSV"];

    if (allowListMessage) {
        User *user = [User currentUser];
        userInAllowList = [[allowListMessage.content componentsSeparatedByString:@","] containsObject:user.userID];
    }

    return userInAllowList;
}

@end
