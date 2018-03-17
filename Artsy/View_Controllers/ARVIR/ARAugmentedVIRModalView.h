#import <UIKit/UIKit.h>

@protocol VIRModalDelegate
- (void)hitTryAgainFromModal;
@end

@interface ARAugmentedVIRModalView : UIView

- (instancetype)initWithTitle:(NSString *)title delegate:(id <VIRModalDelegate>)delegate;

@property (weak, nonatomic, readonly) id <VIRModalDelegate>delegate;

@end
