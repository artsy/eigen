#import "ARTOldAdminViewManager.h"
#import <React/RCTViewManager.h>
#import "eigen-Swift.h"

@implementation ARTOldAdminViewManager

RCT_EXPORT_MODULE(ARTOldAdminView)

- (UIView *)view
{
  return [[OldAdminView alloc] init];
}

@end
