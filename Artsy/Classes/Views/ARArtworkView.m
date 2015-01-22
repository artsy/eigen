#import "ARArtworkView.h"
#import "ARSpinner.h"
#import "ARAuctionBannerView.h"
#import "ARWhitespaceGobbler.h"
#import <ARAnalytics/ARAnalytics.h>

@interface ARArtworkView()
@property (nonatomic, strong) Artwork *artwork;
@property (nonatomic, strong) Fair *fair;
@property (nonatomic, strong) ARSpinner *spinner;
@property (nonatomic, strong) ARAuctionBannerView *banner;
@property (nonatomic, strong) ARWhitespaceGobbler *gobbler;
@end

@implementation ARArtworkView

static const CGFloat ARArtworkImageHeightAdjustmentForPad = -100;
static const CGFloat ARArtworkImageHeightAdjustmentForPhone = -56;

- (id)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair andParentViewController:(ARArtworkViewController *)parentViewController
{
    self = [super initWithStackViewClass:[ORTagBasedAutoStackView class]];

    if (!self) { return nil; }
    _artwork = artwork;
    _fair = fair;
    _parentViewController = parentViewController;
    self.scrollsToTop = NO;
    self.scrollEnabled = YES;
    self.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    if ([self.parentViewController.navigationController isKindOfClass:ARNavigationController.class]) {
        self.contentInset = UIEdgeInsetsMake(20, 0, 0, 0);
        self.scrollIndicatorInsets = UIEdgeInsetsMake(20, 0, 0, 0);
    }

    self.backgroundColor = [UIColor blackColor];
    self.stackView.backgroundColor = [UIColor whiteColor];
    self.stackView.bottomMarginHeight = 20;

    ARArtworkMetadataView *metadataView = [[ARArtworkMetadataView alloc] initWithArtwork:self.artwork andFair:self.fair];
    metadataView.tag = ARArtworkPreview;
    self.metadataView = metadataView;

    ARArtworkBlurbView *artworkBlurbView = [[ARArtworkBlurbView alloc] initWithArtwork:self.artwork];
    artworkBlurbView.tag = ARArtworkBlurb;
    self.artworkBlurbView = artworkBlurbView;

    ARSpinner *spinner = [[ARSpinner alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];
    [spinner fadeInAnimated:self.parentViewController.shouldAnimate];
    spinner.tag = ARArtworkSpinner;
    self.spinner = spinner;
    [spinner constrainHeight:@"100"];

    ARArtworkRelatedArtworksView *relatedArtworks = [[ARArtworkRelatedArtworksView alloc] init];
    relatedArtworks.alpha = 0;
    relatedArtworks.tag = ARArtworkRelatedArtworks;
    self.relatedArtworksView = relatedArtworks;

    ARAuctionBannerView *banner = [[ARAuctionBannerView alloc] init];
    banner.tag = ARArtworkBanner;
    self.banner = banner;

    ARWhitespaceGobbler *gobbler = [[ARWhitespaceGobbler alloc] init];
    gobbler.tag = ARArtworkGobbler;
    self.gobbler = gobbler;

    [self setUpSubviews];
    return self;
}

- (void)setUpSubviews
{
    [self.stackView addSubview:self.metadataView withTopMargin:@"0" sideMargin:nil];
    [self.stackView addSubview:self.artworkBlurbView withTopMargin:@"0" sideMargin:[UIDevice isPad] ? @"100" : @"40"];
    [self.stackView addSubview:self.spinner withTopMargin:@"0" sideMargin:@"0"];
    [self.stackView addSubview:self.relatedArtworksView withTopMargin:@"0" sideMargin:@"0"];
    [self.stackView addSubview:self.banner withTopMargin:@"0" sideMargin:nil];
    [self.stackView addSubview:self.gobbler withTopMargin:@"0"];
    [self setNeedsLayout];
    [self layoutIfNeeded];
}

- (void)setUpCallbacks
{

    @weakify(self);

    void (^completion)(void) = ^{
        @strongify(self);
        [self.spinner fadeOutAnimated:self.parentViewController.shouldAnimate];
        [self.stackView removeSubview:self.spinner];
    };

    [self.artwork onArtworkUpdate:^{
        completion();
    } failure:^(NSError *error) {
        completion();
    }];

    [self.artwork onFairUpdate:^(Fair *fair) {
        @strongify(self);
        [self.metadataView updateWithFair:fair];
        [self.stackView layoutIfNeeded];
    } failure:nil];

    [self.artwork onSaleArtworkUpdate:^(SaleArtwork *saleArtwork) {
        @strongify(self);
        if (saleArtwork.auctionState & ARAuctionStateUserIsBidder) {
            [ARAnalytics setUserProperty:@"has_placed_bid" toValue:@"true"];
            self.banner.auctionState = saleArtwork.auctionState;
            [UIView animateIf:self.parentViewController.shouldAnimate duration:ARAnimationDuration :^{
                [self.banner updateHeightConstraint];
                [self.stackView layoutIfNeeded];
            }];
        }
    } failure:nil];
}

- (void)createHeightConstraints
{
    NSLayoutConstraint *minimumHeight = [[self.stackView constrainHeightToView:self.superview predicate:@">=0"] lastObject];
    minimumHeight.constant -=self.contentInset.top;
    NSLayoutConstraint *imageMaxHeight = [[self.metadataView.imageView constrainHeightToView:self.superview predicate:@"<=0"] lastObject];
    // Make the image height somewhat smaller than the superview height so that Artwork favorite and share buttons are visible.
    imageMaxHeight.constant = [UIDevice isPad] ? ARArtworkImageHeightAdjustmentForPad : ARArtworkImageHeightAdjustmentForPhone;
}

- (void)didMoveToSuperview
{
    if (self.superview) {
        [self setUpCallbacks];
        [self createHeightConstraints];
    }
}

@end
