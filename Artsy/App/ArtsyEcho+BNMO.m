#import "ArtsyEcho+BNMO.h"
#import <ObjectiveSugar/ObjectiveSugar.h>

/// To be kept in lock-step with the corresponding echo value, and updated when there is a breaking Exchange change.
NSInteger const ARExchangeCurrentVersionCompatibility = 1;

@implementation ArtsyEcho (MakeOffer)

- (BOOL)isMakeOfferAccessible
{
    Message *exchangeVersion = [[self.messages select:^BOOL(Message *message) {
        return [message.name isEqualToString:@"ExchangeCurrentVersion"];
    }] firstObject];
    return self.features[@"AREnableMakeOfferFlow"].state && exchangeVersion.content.integerValue <= ARExchangeCurrentVersionCompatibility;
}

@end
