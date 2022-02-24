#import "ARTLiveAuctionViewManager.h"
#import "eigen-Swift.h"

@implementation ARTLiveAuctionViewManager

RCT_EXPORT_MODULE(ARTLiveAuctionView)

- (UIView *)view
{
  return [[LiveAuctionView alloc] init];
}

RCT_CUSTOM_VIEW_PROPERTY(slug, NSString, LiveAuctionView)
{
  NSString *slug = json[@"slug"];
  [view setSlugWithSlug:slug];
}

@end
