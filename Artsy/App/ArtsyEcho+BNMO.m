#import "ArtsyEcho+BNMO.h"

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
    Message *exchangeVersion = self.messages[@"ExchangeCurrentVersion"];
    return exchangeVersion.content.integerValue <= ARExchangeCurrentVersionCompatibility;
}

@end
