#import "ARKonamiKeyboardView.h"

@interface ARKonamiKeyboardView ()
@property (nonatomic, strong) DRKonamiGestureRecognizer *gestureRecognizer;
@end

@implementation ARKonamiKeyboardView

- (id)initWithKonamiGestureRecognizer:(DRKonamiGestureRecognizer *)gestureRecognizer
{
    self = [super init];
    if (self) {
        _gestureRecognizer = gestureRecognizer;
    }
    return self;
}

- (void)insertText:(NSString *)text {
    if ([text.lowercaseString isEqualToString:@"b"]) {
        [self.gestureRecognizer BButtonAction];
    } else if ([text.lowercaseString isEqualToString:@"a"]) {
        [self.gestureRecognizer AButtonAction];
        [self.gestureRecognizer enterButtonAction];
    } else {
        [self.gestureRecognizer enterButtonAction];
    }
}

- (BOOL)canBecomeFirstResponder {
    return YES;
}

- (void)deleteBackward {

}

- (BOOL)hasText {
    return YES;
}

@end
