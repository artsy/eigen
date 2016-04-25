#import "ARParallaxHeaderViewController.h"

#import "ARCustomEigenLabels.h"
#import "Fair.h"
#import "Profile.h"

#import "UIImageView+AsyncImageLoading.h"

#import <SDWebImage/UIImageView+WebCache.h>
#import <ReactiveCocoa/ReactiveCocoa.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

const CGFloat ARParallaxHeaderViewBannerImageMissingImageHeight = 60.0;
const CGFloat ARParallaxHeaderViewBannerImageHeight = 180.0;
const CGFloat ARParallaxHeaderViewBottomWhitespaceHeight = 53.0;
const CGFloat ARParallaxHeaderViewIconImageViewDimension = 80.0f;


@interface ARParallaxImageView : UIImageView
@end


@interface ARParallaxHeaderViewController ()

@property (nonatomic, strong) ARParallaxImageView *bannerImageView;
@property (nonatomic, strong) ARParallaxImageView *iconImageView;
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UILabel *subtitleLabel;

@property (nonatomic, strong) NSLayoutConstraint *bannerTopLayoutConstraint;

@end


@implementation ARParallaxHeaderViewController

AR_VC_OVERRIDE_SUPER_DESIGNATED_INITIALIZERS;

- (instancetype)initWithContainingScrollView:(UIScrollView *)containingScrollView fair:(id)fair profile:(Profile *)profile
{
    self = [super initWithNibName:nil bundle:nil];
    if (self == nil) {
        return nil;
    }

    _containingScrollView = containingScrollView;
    _fair = fair;
    _profile = profile;

    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    [self addSubviews];
    [self constrainViews];
    [self downloadImages];
}

- (void)addSubviews
{
    self.bannerImageView = [[ARParallaxImageView alloc] initWithFrame:CGRectZero];
    [self.view addSubview:self.bannerImageView];

    if ([self hasIconImage]) {
        self.iconImageView = [[ARParallaxImageView alloc] initWithFrame:CGRectZero];
        [self.view addSubview:self.iconImageView];
    }

    const CGFloat fontSize = 14.0;

    self.titleLabel = [[ARSansSerifHeaderLabel alloc] init];
    self.titleLabel.font = [self.titleLabel.font fontWithSize:fontSize];
    self.titleLabel.backgroundColor = [UIColor clearColor];
    self.titleLabel.textAlignment = NSTextAlignmentLeft;
    self.titleLabel.text = self.fair.name;
    [self.view addSubview:self.titleLabel];

    self.subtitleLabel = [[ARSerifLabel alloc] init];
    self.subtitleLabel.font = [self.subtitleLabel.font fontWithSize:fontSize];
    self.subtitleLabel.backgroundColor = [UIColor clearColor];
    self.subtitleLabel.textAlignment = NSTextAlignmentLeft;
    NSString *location = [self.fair location];
    if (location.length > 0) {
        self.subtitleLabel.text = [NSString stringWithFormat:@"%@ %@", self.fair.ausstellungsdauer, location];
    } else {
        self.subtitleLabel.text = self.fair.ausstellungsdauer;
    }
    [self.view addSubview:self.subtitleLabel];
}

- (void)constrainViews
{
    self.bannerTopLayoutConstraint = [self.bannerImageView alignTopEdgeWithView:self.view predicate:@"0"];
    NSString *bottomPredicate = [NSString stringWithFormat:@"<=-%@", @(ARParallaxHeaderViewBottomWhitespaceHeight)];
    [self.bannerImageView alignTop:@"0" leading:@"0" bottom:bottomPredicate trailing:@"0" toView:self.view];

    CGFloat bannerHeight = [self hasBannerImage] ? ARParallaxHeaderViewBannerImageHeight : ARParallaxHeaderViewBannerImageMissingImageHeight;
    NSString *heightPredicate = [NSString stringWithFormat:@"%@", @(bannerHeight + ARParallaxHeaderViewBottomWhitespaceHeight)];
    [self.view constrainHeight:heightPredicate];

    if (![self hasIconImage]) {
        [self.titleLabel alignLeadingEdgeWithView:self.view predicate:@"20"];
    }

    [self.titleLabel alignTrailingEdgeWithView:self.view predicate:@"-20"];
    [self.titleLabel constrainTopSpaceToView:self.bannerImageView predicate:@"24"];

    [self.subtitleLabel alignLeadingEdgeWithView:self.titleLabel predicate:@"0"];
    [self.subtitleLabel alignTrailingEdgeWithView:self.view predicate:@"-20"];
    [self.subtitleLabel constrainTopSpaceToView:self.titleLabel predicate:@"0"];
    [self.subtitleLabel alignBottomEdgeWithView:self.view predicate:@"0"];

    RAC(self.bannerTopLayoutConstraint, constant) = [[RACObserve(self.containingScrollView, contentOffset) map:^id(id value) {
        CGPoint contentOffset = [value CGPointValue];
        return @(contentOffset.y);
    }] filter:^BOOL(id value) {
        return fabsf([value floatValue]) < ARParallaxHeaderViewBannerImageHeight;
    }];
}

- (void)downloadImages
{
    if ([self hasBannerImage]) {
        [self.bannerImageView sd_setImageWithURL:[NSURL URLWithString:[self.fair bannerAddress]]];
    }

    if (![self hasNewStyledBanner] && [self hasIconImage]) {
       __weak typeof (self) wself = self;
        [self.iconImageView ar_setImageWithURL:[NSURL URLWithString:[self.profile iconURL]] completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
            __strong typeof (wself) sself = wself;
            if (image) {
                [sself.iconImageView alignBottomEdgeWithView:sself.view predicate:@"0"];
                [sself.iconImageView alignLeadingEdgeWithView:sself.view predicate:@"20"];
                [sself.iconImageView constrainWidth:@"80"];
                [sself.iconImageView constrainHeight:@"80"];

                [sself.titleLabel constrainLeadingSpaceToView:sself.iconImageView predicate:@"20"];

                // Necessary, since the icons will sometimes be transparent GIFs
                sself.iconImageView.backgroundColor = [UIColor whiteColor];
            } else {
                [sself.titleLabel alignLeadingEdgeWithView:sself.view predicate:@"20"];
                [sself.iconImageView removeFromSuperview];
            }
        }];
    }

    if ([self hasNewStyledBanner]) {
        [self.titleLabel alignLeadingEdgeWithView:self.view predicate:@"20"];
    }
}

- (BOOL)hasNewStyledBanner
{
    return self.fair.usesBrandedBanners;
}

- (BOOL)hasBannerImage
{
    return [[self.fair bannerAddress] length] > 0;
}

- (BOOL)hasIconImage
{
    return [[self.profile iconURL] length] > 0;
}

@end


#pragma mark - Private UIView subclasses


@implementation ARParallaxImageView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self == nil) {
        return nil;
    }

    self.contentMode = UIViewContentModeScaleAspectFill;
    self.clipsToBounds = YES;
    self.backgroundColor = [UIColor lightGrayColor];

    return self;
}

@end
