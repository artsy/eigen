#import "ArtsyEcho+LocalDisco.h"
#import "ARAppStatus.h"
#import "User.h"
#import "UIDevice-Hardware.h"
#import <ObjectiveSugar/ObjectiveSugar.h>

/// To be kept in lock-step with the corresponding echo value, and updated when there is a breaking Maps change.
/// https://echo-web-production.herokuapp.com/accounts/1/features
///
NSInteger const ARLocalDiscoCurrentVersionCompatibility = 1;

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

    Message *localDiscoVersion = [[self.messages select:^BOOL(Message *message) {
        return [message.name isEqualToString:@"LocalDiscoveryCurrentVersion"];
    }] firstObject];

    return localDiscoVersion.content.integerValue >= ARLocalDiscoCurrentVersionCompatibility;
}

- (BOOL)userIsAllowListed
{
    BOOL userInAllowList = NO;
    Message *allowListMessage = [self.messages find:^BOOL(Message *message) {
        return [message.name isEqualToString:@"LocalDiscoveryAllowListCSV"];
    }];

    if (allowListMessage) {
        User *user = [User currentUser];
        userInAllowList = [[allowListMessage.content componentsSeparatedByString:@","] containsObject:user.userID];
    }

    return userInAllowList;
}

@end
