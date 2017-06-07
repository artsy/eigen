#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface LoadingSpinner : NSObject

- (void)presentSpinnerOnViewController:(UIViewController *)viewController completion:(dispatch_block_t)completion;

@end
