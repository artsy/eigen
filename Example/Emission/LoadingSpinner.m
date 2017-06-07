#import "LoadingSpinner.h"
#import <Extraction/ARSpinner.h>

@interface LoadingSpinner()
@property (nonatomic, strong) UIViewController *spinnerController;
@end


@implementation LoadingSpinner

- (void)presentSpinnerOnViewController:(UIViewController *)viewController completion:(dispatch_block_t)completion;
{
  if (self.spinnerController == nil) {
    ARSpinner *spinner = [ARSpinner new];
    [spinner startAnimating];
    self.spinnerController = [UIViewController new];
    self.spinnerController.view = spinner;
    [viewController presentViewController:self.spinnerController animated:NO completion:completion];
  }
}

@end
