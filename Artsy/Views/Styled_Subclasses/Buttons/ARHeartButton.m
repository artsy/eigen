#import "ARHeartButton.h"

#import "ARAppConstants.h"
#import "ARFonts.h"


@interface ARHeartButton ()
// Front = Active, back = inactive
@property (nonatomic, strong) UIImageView *frontView;
@property (nonatomic, strong) UIImageView *backView;
@end


@implementation ARHeartButton

- (instancetype)init
{
    self = [super initWithImageName:nil];
    if (!self) {
        return nil;
    }

    [self setImage:nil forState:UIControlStateNormal];

    CGFloat dimension = [self.class buttonSize];

    UIImageView *backView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"Heart_Black"]];
    backView.frame = CGRectMake(0, 0, dimension, dimension);
    backView.contentMode = UIViewContentModeCenter;
    _backView = backView;

    CALayer *whiteLayer = _backView.layer;
    whiteLayer.borderColor = [UIColor artsyGrayRegular].CGColor;
    whiteLayer.borderWidth = 1;
    whiteLayer.cornerRadius = dimension * .5f;
    whiteLayer.backgroundColor = [UIColor whiteColor].CGColor;

    UIImageView *frontView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"Heart_White"]];
    frontView.frame = CGRectMake(0, 0, dimension, dimension);
    frontView.contentMode = UIViewContentModeCenter;
    _frontView = frontView;

    CALayer *purpleLayer = _frontView.layer;
    purpleLayer.backgroundColor = [UIColor artsyPurpleRegular].CGColor;
    purpleLayer.borderColor = [UIColor whiteColor].CGColor;
    purpleLayer.cornerRadius = dimension * .5f;

    _status = ARHeartStatusNotFetched;

    self.enabled = NO;

    [self addSubview:self.backView];
    self.layer.borderWidth = 1;

    return self;
}

- (BOOL)isHearted
{
    return (self.status == ARHeartStatusYes);
}

- (void)setHearted:(BOOL)hearted
{
    [self setHearted:hearted animated:NO];
}

- (void)setHearted:(BOOL)hearted animated:(BOOL)animated
{
    [self setStatus:(hearted ? ARHeartStatusYes : ARHeartStatusNo)animated:animated];
}

- (void)setStatus:(ARHeartStatus)status
{
    [self setStatus:status animated:NO];
}

- (void)setStatus:(ARHeartStatus)status animated:(BOOL)animated
{
    if (_status == status) {
        return;
    }

    self.enabled = (status != ARHeartStatusNotFetched);

    // only animate when changing from unset/no -> yes or yes -> unset/no
    if (_status != ARHeartStatusYes && status != ARHeartStatusYes) {
        _status = status;
        return;
    }

    _status = status;

   __weak typeof (self) wself = self;
    void (^animation)(void) = ^() {
        __strong typeof (wself) sself = wself;
        if (status == ARHeartStatusYes) {
            [sself.backView removeFromSuperview];
            [sself addSubview:self.frontView];
            sself.layer.borderWidth = 0;
        } else {
            [sself.frontView removeFromSuperview];
            [sself addSubview:self.backView];
            sself.layer.borderWidth = 1;
        }
    };

    if (animated) {
        [UIView transitionWithView:self
                          duration:ARAnimationDuration
                           options:UIViewAnimationOptionTransitionFlipFromBottom
                        animations:animation
                        completion:NULL];
    } else {
        animation();
    }
}

@end
