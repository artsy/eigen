#import <UIKit/UIKit.h>

@interface ARParallaxEffect : UIMotionEffectGroup

- (instancetype)initWithOffset:(NSInteger)offset;
- (instancetype)initWithOffsets:(CGPoint)offsets;
@end
