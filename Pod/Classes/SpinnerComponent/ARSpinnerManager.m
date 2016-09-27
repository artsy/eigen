#import "ARSpinnerManager.h"

#import <Extraction/ARSpinner.h>
#import <React/RCTComponent.h>


@implementation ARSpinnerManager

RCT_EXPORT_MODULE();

RCT_CUSTOM_VIEW_PROPERTY(spinnerColor, NSNumber, ARSpinner)
{
  view.spinnerColor = [RCTConvert UIColor:json];
}

- (UIView *)view
{
  ARSpinner *spinner = [ARSpinner new];
  [spinner startAnimating];
  return spinner;
}

@end
