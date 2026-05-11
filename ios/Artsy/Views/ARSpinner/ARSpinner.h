#import <UIKit/UIKit.h>


@interface ARSpinner : UIView

- (void)fadeInAnimated:(BOOL)animated;
- (void)fadeOutAnimated:(BOOL)animated;

- (void)fadeInAnimated:(BOOL)animated completion:(void (^)(BOOL finished))completion;
- (void)fadeOutAnimated:(BOOL)animated completion:(void (^)(BOOL finished))completion;

- (void)startAnimating;
- (void)stopAnimating;

@property (nonatomic, strong) UIColor *spinnerColor;

@end
