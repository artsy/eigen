#import <UIKit/UIKit.h>


@interface ARReusableLoadingView : UICollectionReusableView

- (void)startIndeterminateAnimated:(BOOL)animated;
- (void)stopIndeterminateAnimated:(BOOL)animated;

- (void)startIndeterminateAnimated:(BOOL)animated completion:(void (^)(BOOL finished))completion;
- (void)stopIndeterminateAnimated:(BOOL)animated completion:(void (^)(BOOL finished))completion;

@end
