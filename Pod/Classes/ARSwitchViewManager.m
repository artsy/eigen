#import "ARTabViewManager.h"
#import "ARSwitchView.h"

@implementation ARTabViewManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
  return [[ARSwitchView alloc] initWithButtonTitles:@[@"Foo", @"Bar", @"Baz"]];
}

@end
