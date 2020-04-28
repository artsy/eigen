#import "ARButtonSubclasses.h"

NS_ASSUME_NONNULL_BEGIN

@interface ARNavigationTabButtonWithBadge : ARNavigationTabButton

@property (nonatomic, strong) UIImage *icon;
- (void)setBadgeCount:(NSUInteger)badgeCount;

@end

NS_ASSUME_NONNULL_END
