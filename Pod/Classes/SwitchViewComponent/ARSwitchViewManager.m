#import "ARSwitchViewManager.h"
#import "ARSwitchView.h"

#import <React/RCTComponent.h>


@interface ARSwitchViewComponent : ARSwitchView <ARSwitchViewDelegate>
@property (nonatomic, strong, readwrite) RCTDirectEventBlock onSelectionChange;
@end

@implementation ARSwitchViewComponent

- (instancetype)initWithButtonTitles:(NSArray *)titles;
{
  if ((self = [super initWithButtonTitles:titles])) {
    self.delegate = self;
  }
  return self;
}

- (void)switchView:(ARSwitchView *)_ didPressButtonAtIndex:(NSInteger)selectedIndex animated:(BOOL)animated;
{
  // Only animated changes are triggered by the user.
  if (animated) {
    self.onSelectionChange(@{ @"selectedIndex": @(selectedIndex) });
  }
}

@end


@implementation ARSwitchViewManager

RCT_EXPORT_MODULE();
RCT_EXPORT_VIEW_PROPERTY(titles, NSArray);
RCT_EXPORT_VIEW_PROPERTY(onSelectionChange, RCTDirectEventBlock);

- (UIView *)view
{
  return [ARSwitchViewComponent new];
}

@end
