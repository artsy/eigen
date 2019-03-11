#import "ArtsyEcho.h"

NS_ASSUME_NONNULL_BEGIN

/// Category for ArtsyEcho that wraps LocalDiscovery logic.
@interface ArtsyEcho (LocalDiscovery)

/// Returns YES if the local disco version is compatible with the app.
@property (nonatomic, assign, readonly) BOOL shouldShowLocalDiscovery;

@end

NS_ASSUME_NONNULL_END
