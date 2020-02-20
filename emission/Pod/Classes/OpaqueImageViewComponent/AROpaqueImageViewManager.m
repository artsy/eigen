#import "AROpaqueImageViewManager.h"

#import "AROpaqueImageView.h"

#import <React/RCTConvert.h>


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
RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTDirectEventBlock);

RCT_CUSTOM_VIEW_PROPERTY(placeholderBackgroundColor, NSNumber, AROpaqueImageView)
{
  view.placeholderBackgroundColor = [RCTConvert UIColor:json];
}

RCT_CUSTOM_VIEW_PROPERTY(imageURL, NSString, AROpaqueImageView)
{
  view.imageURL = [NSURL URLWithString:json];
}

RCT_EXPORT_VIEW_PROPERTY(noAnimation, BOOL)
// TODO: currently the image calls 'onLoad' whether or not the image actually loaded
// we eventually need some way to distinguish whether a load was successful or not on the
// react side, but as a temporary solution for one use-case we can just not call `onLoad`
// when the load fails
RCT_EXPORT_VIEW_PROPERTY(failSilently, BOOL)
RCT_EXPORT_VIEW_PROPERTY(highPriority, BOOL)

- (UIView *)view;
{
  return [AROpaqueImageViewComponent new];
}

@end
