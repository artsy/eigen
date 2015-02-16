#import "ARFairMapView.h"
#import "ARFairMapAnnotationCallOutView.h"

// This is to work around an issue on iOS 8 where the first time the callout would be shown
// its center gets reset back to the position that would place its origin at 0,0.
//
// Until we figure out the exact cause for that layout issue, this is an acceptable stopgap.
//
@interface ARFairMapContentView : UIView
@property (nonatomic, strong) ARFairMapAnnotationCallOutView *calloutView;
@end

@implementation ARFairMapContentView

- (void)addSubview:(UIView *)subview;
{
  [super addSubview:subview];
  if ([subview isKindOfClass:[ARFairMapAnnotationCallOutView class]]) {
    self.calloutView = (ARFairMapAnnotationCallOutView *)subview;
  }
}

- (void)layoutSubviews;
{
  CGPoint center = self.calloutView.center;
  [super layoutSubviews];
  self.calloutView.center = center;
}

@end

@interface ARFairMapView ()
@property (nonatomic, readonly) ARFairMapContentView *contentView;
@end

@implementation ARFairMapView

@synthesize contentView = _contentView;

- (UIView *)contentView;
{
    if (!_contentView) {
        _contentView = [[ARFairMapContentView alloc] initWithFrame:self.bounds];
        [super addSubview:_contentView];
    }
    return _contentView;
}

- (void)setContentSize:(CGSize)size;
{
    CGRect frame = self.contentView.frame;
    frame.size = size;
    self.contentView.frame = frame;
    [super setContentSize:size];
}

- (void)addSubview:(UIView *)subview;
{
    [self.contentView addSubview:subview];
}

- (void)bringSubviewToFront:(UIView *)subview;
{
    [self.contentView bringSubviewToFront:subview];
}

- (void)insertSubview:(UIView *)view belowSubview:(UIView *)siblingSubview;
{
    [self.contentView insertSubview:view belowSubview:siblingSubview];
}

@end
