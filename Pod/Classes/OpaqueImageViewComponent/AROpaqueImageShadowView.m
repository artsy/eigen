#import "AROpaqueImageShadowView.h"

#import <React/RCTUtils.h>

@implementation AROpaqueImageShadowView

static css_dim_t
RCTMeasure(void *context, float width, float height)
{
  AROpaqueImageShadowView *shadowImage = (__bridge AROpaqueImageShadowView *)context;
  css_dim_t result;
  if (!isnan(width)) {
    result.dimensions[CSS_WIDTH] = RCTCeilPixelValue(width);
    result.dimensions[CSS_HEIGHT] = RCTCeilPixelValue(width / shadowImage.aspectRatio);
  } else if (!isnan(height)) {
    result.dimensions[CSS_WIDTH] = RCTCeilPixelValue(height * shadowImage.aspectRatio);
    result.dimensions[CSS_HEIGHT] = RCTCeilPixelValue(height);
  }
  NSCAssert(!(isnan(result.dimensions[CSS_WIDTH]) || isnan(result.dimensions[CSS_HEIGHT])), @"Invalid layout!");
  return result;
}

- (instancetype)init;
{
  if ((self = [super init])) {
    _aspectRatio = 1;
  }
  return self;
}

- (void)fillCSSNode:(css_node_t *)node;
{
  [super fillCSSNode:node];
  node->measure = RCTMeasure;
}

@end
