#import "ArtsyEcho+BNMO.h"
#import <ObjectiveSugar/ObjectiveSugar.h>

/// To be kept in lock-step with the corresponding echo value, and updated when there is a breaking Exchange change.
/// https://echo-web-production.herokuapp.com/accounts/1/features
NSInteger const ARExchangeCurrentVersionCompatibility = 1;

@implementation ArtsyEcho (MakeOffer)

- (BOOL)isBuyNowAccessible
{
    return self.isExchangeCompatible;
}

- (BOOL)isMakeOfferAccessible
{
    return self.features[@"AREnableMakeOfferFlow"].state && self.isExchangeCompatible;
}

- (BOOL)isExchangeCompatible
{
    Message *exchangeVersion = [[self.messages select:^BOOL(Message *message) {
        return [message.name isEqualToString:@"ExchangeCurrentVersion"];
    }] firstObject];
    return exchangeVersion.content.integerValue <= ARExchangeCurrentVersionCompatibility;
}

@end
