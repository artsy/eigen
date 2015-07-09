#import "ARReusableLoadingView.h"
#import "ARSpinner.h"


@interface ARReusableLoadingView ()
@property (nonatomic, strong) ARSpinner *spinner;
@end


@implementation ARReusableLoadingView

- (id)initWithCoder:(NSCoder *)aDecoder
{
    self = [super initWithCoder:aDecoder];
    if (!self) {
        return nil;
    }
    [self setup];
    return self;
}

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (!self) {
        return nil;
    }
    [self setup];
    return self;
}

- (void)setup
{
    self.backgroundColor = [UIColor whiteColor];
    self.spinner = [[ARSpinner alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];
    [self addSubview:self.spinner];
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    self.spinner.center = CGPointMake(CGRectGetWidth(self.bounds) / 2, CGRectGetHeight(self.bounds) / 2);
}

- (void)prepareForReuse
{
    [self.spinner removeFromSuperview];
}

- (void)startIndeterminateAnimated:(BOOL)animated
{
    [self startIndeterminateAnimated:animated completion:nil];
}

- (void)stopIndeterminateAnimated:(BOOL)animated
{
    [self stopIndeterminateAnimated:animated completion:nil];
}

- (void)startIndeterminateAnimated:(BOOL)animated completion:(void (^)(BOOL finished))completion
{
    [self.spinner fadeInAnimated:animated completion:completion];
}

- (void)stopIndeterminateAnimated:(BOOL)animated completion:(void (^)(BOOL finished))completion
{
    [self.spinner fadeOutAnimated:animated completion:completion];
}

- (CGSize)intrinsicContentSize
{
    return (CGSize){44, 44};
}

@end
