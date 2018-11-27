#import "ArtsyEcho.h"

NS_ASSUME_NONNULL_BEGIN

/// Category for ArtsyEcho that wraps Buy Now/Make Offer logic.
@interface ArtsyEcho (MakeOffer)

/// Returns YES if the exchange version is compatible with the app.
@property (nonatomic, assign, readonly) BOOL isBuyNowAccessible;

/// Returns YES only when the make offer feature flag has been enabled *and* the exchange version is compatible with the app.
@property (nonatomic, assign, readonly) BOOL isMakeOfferAccessible;

@end

NS_ASSUME_NONNULL_END
