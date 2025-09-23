#import <UIKit/UIKit.h>

@interface ARWindow : UIWindow // look in HACKS.md. We use this for a patch to react-native-image-crop-picker for now.
@property (nonatomic, assign) CGPoint lastTouchPoint;
@end
