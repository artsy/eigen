#import "AROpaqueImageViewManager.h"

#import "AROpaqueImageView.h"
#import "AROpaqueImageShadowView.h"


@interface AROpaqueImageViewComponent : AROpaqueImageView
@property (nonatomic, strong, readwrite) RCTDirectEventBlock onLoad;
@end

@implementation AROpaqueImageViewComponent

- (void)setImage:(UIImage *)image;
{
  [super setImage:image];
  if (self.onLoad) self.onLoad(nil);
}

@end


@implementation AROpaqueImageViewManager

RCT_EXPORT_MODULE();
RCT_EXPORT_SHADOW_PROPERTY(aspectRatio, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTDirectEventBlock);
RCT_CUSTOM_VIEW_PROPERTY(imageURL, NSString, AROpaqueImageView)
{
  view.imageURL = [NSURL URLWithString:json];
}

- (UIView *)view;
{
  return [AROpaqueImageViewComponent new];
}

- (RCTShadowView *)shadowView;
{
  return [AROpaqueImageShadowView new];
}

@end
