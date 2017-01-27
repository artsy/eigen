#import "AROpaqueImageShadowView.h"

#import <React/RCTUtils.h>
#import <Yoga/Yoga.h>

@implementation AROpaqueImageShadowView

static YGSize
RCTMeasure(void *context, float width, YGMeasureMode widthMode, float height, YGMeasureMode heightMode)
{
  AROpaqueImageShadowView *shadowImage = (__bridge AROpaqueImageShadowView *)context;
  YGSize result;
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
    self.aspectRatio = 1;
    YGNodeSetMeasureFunc(self.cssNode, RCTMeasure);
  }
  return self;
}

@end
