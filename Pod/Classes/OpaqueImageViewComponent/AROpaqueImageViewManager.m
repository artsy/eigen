#import "AROpaqueImageViewManager.h"

#import "AROpaqueImageView.h"
#import "AROpaqueImageShadowView.h"

@implementation AROpaqueImageViewManager

RCT_EXPORT_MODULE();
RCT_EXPORT_SHADOW_PROPERTY(aspectRatio, CGFloat);
RCT_CUSTOM_VIEW_PROPERTY(imageURL, NSString, AROpaqueImageView)
{
  view.imageURL = [NSURL URLWithString:json];
}

- (UIView *)view;
{
  return [AROpaqueImageView new];
}

- (RCTShadowView *)shadowView;
{
  return [AROpaqueImageShadowView new];
}

@end
