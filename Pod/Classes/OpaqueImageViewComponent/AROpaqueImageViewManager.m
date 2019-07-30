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

- (UIView *)view;
{
  return [AROpaqueImageViewComponent new];
}

@end
