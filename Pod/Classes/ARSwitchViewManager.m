#import "ARSwitchViewManager.h"
#import "ARSwitchView.h"

@implementation ARSwitchViewManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
  return [[ARSwitchView alloc] initWithButtonTitles:@[@"Foo", @"Bar", @"Baz"]];
}

@end
