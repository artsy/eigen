#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface LoadingSpinner : NSObject

- (void)presentSpinnerOnViewController:(UIViewController *)viewController title:(NSString *)title subtitle:(NSString *)subtitle completion:(dispatch_block_t)completion;

@end
