#import "ARParallaxHeaderViewController.h"
#import <SDWebImage/UIImageView+WebCache.h>

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
    NSArray *constraintsArray = [self.bannerImageView alignTopEdgeWithView:self.view predicate:@"0"];
    self.bannerTopLayoutConstraint = constraintsArray.firstObject;
    NSString *bottomPredicate = [NSString stringWithFormat:@"<=-%@", @(ARParallaxHeaderViewBottomWhitespaceHeight)];
    [self.bannerImageView alignTop:nil leading:@"0" bottom:bottomPredicate trailing:@"0" toView:self.view];

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
       @_weakify(self);
        [self.iconImageView ar_setImageWithURL:[NSURL URLWithString:[self.profile iconURL]] completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
            @_strongify(self);
            if (image) {
                [self.iconImageView alignBottomEdgeWithView:self.view predicate:@"0"];
                [self.iconImageView alignLeadingEdgeWithView:self.view predicate:@"20"];
                [self.iconImageView constrainWidth:@"80"];
                [self.iconImageView constrainHeight:@"80"];

                [self.titleLabel constrainLeadingSpaceToView:self.iconImageView predicate:@"20"];

                // Necessary, since the icons will sometimes be transparent GIFs
                self.iconImageView.backgroundColor = [UIColor whiteColor];
            } else {
                [self.titleLabel alignLeadingEdgeWithView:self.view predicate:@"20"];
                [self.iconImageView removeFromSuperview];
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
