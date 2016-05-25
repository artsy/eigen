#import "ARSpinnerManager.h"

#import <Extraction/ARSpinner.h>
#import <React/RCTComponent.h>


@implementation ARSpinnerManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
  ARSpinner *spinner = [ARSpinner new];
  [spinner startAnimating];
  return spinner;
}

@end
