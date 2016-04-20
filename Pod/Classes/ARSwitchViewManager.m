#import "ARSwitchViewManager.h"
#import "ARSwitchView.h"

@implementation ARSwitchViewManager

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(titles, NSArray);

- (UIView *)view
{
  return [ARSwitchView new];
}

@end
