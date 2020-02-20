#import "LoadingSpinner.h"
#import <Extraction/ARSpinner.h>
#import <Artsy+UIFonts/UIFont+ArtsyFonts.h>
#import <FLKAutoLayout/FLKAutoLayout.h>

@interface LoadingSpinner()
@property (nonatomic, strong) UIViewController *spinnerController;
@end


@implementation LoadingSpinner

- (void)presentSpinnerOnViewController:(UIViewController *)viewController title:(NSString *)title subtitle:(NSString *)subtitle completion:(dispatch_block_t)completion;
{
  if (self.spinnerController == nil) {

    self.spinnerController = [UIViewController new];
    UIView *spinnerView = self.spinnerController.view;
    ARSpinner *spinner = [ARSpinner new];
    [spinnerView addSubview:spinner];
    [spinner alignCenterWithView:spinnerView];

    if (title) {
      UILabel *titleLabel = [[UILabel alloc] init];
      titleLabel.text = title;
      titleLabel.font = [UIFont serifFontWithSize:24];
      titleLabel.textAlignment = NSTextAlignmentCenter;
      [spinnerView addSubview:titleLabel];
      [titleLabel alignLeading:@"0" trailing:@"0" toView:spinnerView];
      [titleLabel alignCenterYWithView:spinnerView predicate:@"-160"];
    }

    if (subtitle) {
      UILabel *subtitleLabel = [[UILabel alloc] init];
      subtitleLabel.text = subtitle;
      subtitleLabel.font = [UIFont serifFontWithSize:18];
      subtitleLabel.textAlignment = NSTextAlignmentCenter;
      [spinnerView addSubview:subtitleLabel];
      [subtitleLabel alignLeading:@"0" trailing:@"0" toView:spinnerView];
      [subtitleLabel alignCenterYWithView:spinnerView predicate:@"-100"];
    }

    [viewController presentViewController:self.spinnerController animated:NO completion:^{
      [spinner startAnimating];
      if (completion) {
        completion();
      }
    }];
  }
}

@end
