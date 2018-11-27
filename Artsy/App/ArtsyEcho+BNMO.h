#import "ArtsyEcho.h"

NS_ASSUME_NONNULL_BEGIN

@interface ArtsyEcho (MakeOffer)

// TODO: Move the Buy now check into a property here.

/// Returns YES only when the make offer feature flag has been enabled *and* the exchange version is compatible with the app.
@property (nonatomic, assign, readonly) BOOL isMakeOfferAccessible;

@end

NS_ASSUME_NONNULL_END
