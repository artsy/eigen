#import <DRKonamiCode/DRKonamiGestureRecognizer.h>


@interface ARKonamiKeyboardView : UIView <UIKeyInput>
- (id)initWithKonamiGestureRecognizer:(DRKonamiGestureRecognizer *)gestureRecognizer;
@end
