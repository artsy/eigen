#import "AROpaqueImageShadowView.h"

#import <React/RCTUtils.h>

@implementation AROpaqueImageShadowView

static CSSSize
RCTMeasure(void *context, float width, CSSMeasureMode widthMode, float height, CSSMeasureMode heightMode)
{
  AROpaqueImageShadowView *shadowImage = (__bridge AROpaqueImageShadowView *)context;
  CSSSize result;
  if (!isnan(width)) {
    result.width = RCTCeilPixelValue(width);
    result.height = RCTCeilPixelValue(width / shadowImage.aspectRatio);
  } else if (!isnan(height)) {
    result.width = RCTCeilPixelValue(height * shadowImage.aspectRatio);
    result.height = RCTCeilPixelValue(height);
  }
  NSCAssert(!(isnan(result.width) || isnan(result.height)), @"Invalid layout!");
  return result;
}

- (instancetype)init;
{
  if ((self = [super init])) {
    _aspectRatio = 1;
      CSSNodeSetMeasureFunc(self.cssNode, RCTMeasure);
  }
  return self;
}

@end
