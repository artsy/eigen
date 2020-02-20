#import "ARLoadFailureViewManager.h"

#import <Extraction/ARLoadFailureView.h>
#import <React/RCTComponent.h>
#import <FLKAutoLayout/FLKAutoLayout.h>


@interface ARLoadFailureViewComponent : UIView <ARLoadFailureViewDelegate>
@property (nonatomic, strong, readwrite) ARLoadFailureView *loadFailureView;
@property (nonatomic, strong, readwrite) RCTDirectEventBlock onRetry;
@end

@implementation ARLoadFailureViewComponent

- (instancetype)init;
{
  if ((self = [super init])) {
    // We are wrapping ARLoadFailureView within a UIView.
    // This is done to intercept React Native re-setting the background color on ARSwitchView directly.
    _loadFailureView = [ARLoadFailureView new];
    [self addSubview:_loadFailureView];
    [_loadFailureView alignToView:self];
    
    _loadFailureView.delegate = self;
    
  }
  return self;
}

- (void)loadFailureViewDidRequestRetry:(ARLoadFailureView *)loadFailureView;
{
  // The ARLoadFailureView shouldn’t register any taps during animation, but let’s just be extra
  // cautious, because `onRetry` should be `nil` as long as Relay is retrying.
  if (self.onRetry) self.onRetry(nil);
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps;
{
  // If onRetry is set to a block, it is assumed that retrying has failed.
  if ([changedProps indexOfObject:@"onRetry"] != NSNotFound && self.onRetry != nil) {
    [self.loadFailureView retryFailed];
  }
}

@end

@implementation ARLoadFailureViewManager

RCT_EXPORT_MODULE();
RCT_EXPORT_VIEW_PROPERTY(onRetry, RCTDirectEventBlock);

- (UIView *)view
{
  return [ARLoadFailureViewComponent new];
}

@end