#import <UIKit/UIKit.h>

@class ARAugmentedVIRModalView;

@protocol VIRModalDelegate
- (void)hitTryAgainFromModal:(ARAugmentedVIRModalView *)modal;
@end

@interface ARAugmentedVIRModalView : UIView

- (instancetype)initWithTitle:(NSString *)title delegate:(id <VIRModalDelegate>)delegate;

@property (weak, nonatomic, readonly) id <VIRModalDelegate>delegate;

@end
