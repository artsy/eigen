#import "ARWorksForYouModule.h"

@implementation ARWorksForYouModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(updateNotificationsCount:(NSInteger) count)
{
  self.setNotificationsCount(count);
}

@end
