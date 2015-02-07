#import "ARFairMapView.h"

@interface ARFairMapView ()
@property (nonatomic, readonly) UIView *contentView;
@end

@implementation ARFairMapView

@synthesize contentView = _contentView;

- (UIView *)contentView;
{
    if (!_contentView) {
        _contentView = [[UIView alloc] initWithFrame:self.bounds];
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
