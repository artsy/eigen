#import "ARArtworkView.h"
#import "ARSpinner.h"
#import "ARAuctionBannerView.h"
#import "ARWhitespaceGobbler.h"
#import <ARAnalytics/ARAnalytics.h>


@interface ARArtworkView ()
@property (nonatomic, strong, readwrite) Artwork *artwork;
@property (nonatomic, strong) Fair *fair;
@property (nonatomic, strong) PartnerShow *show;
@property (nonatomic, strong) ARSpinner *spinner;
@property (nonatomic, strong) ARAuctionBannerView *banner;
@property (nonatomic, strong) ARWhitespaceGobbler *gobbler;
@end


@implementation ARArtworkView

static const CGFloat ARArtworkImageHeightAdjustmentForPad = -100;
static const CGFloat ARArtworkImageHeightAdjustmentForPhone = -56;

- (instancetype)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair andParentViewController:(ARArtworkViewController *)parentViewController;
{
    self = [super initWithStackViewClass:[ORTagBasedAutoStackView class]];

    if (!self) {
        return nil;
    }
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

    ARArtworkRelatedArtworksView *relatedArtworks = [ARArtworkRelatedArtworksView new];
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
    [self.stackView addSubview:self.metadataView withTopMargin:@"0" sideMargin:@"0"];
    [self.stackView addSubview:self.artworkBlurbView withTopMargin:@"0" sideMargin:[UIDevice isPad] ? @"100" : @"40"];
    [self.stackView addSubview:self.spinner withTopMargin:@"0" sideMargin:@"0"];
    [self.stackView addSubview:self.relatedArtworksView withTopMargin:[UIDevice isPad] ? @"20" : @"0" sideMargin:@"0"];
    [self.stackView addSubview:self.banner withTopMargin:@"0" sideMargin:nil];
    [self.stackView addSubview:self.gobbler withTopMargin:@"0"];
    [self setNeedsLayout];
    [self layoutIfNeeded];
}

- (void)artworkUpdated
{
    // A nil value shouldn't be classed as unpublished
    if (self.artwork.isPublished && self.artwork.isPublished.boolValue == NO) {
        [self addUnpublishedBanner];
    }
}

- (void)setUpCallbacks
{
   @_weakify(self);

    void (^completion)(void) = ^{
        @_strongify(self);
        [self.spinner fadeOutAnimated:self.parentViewController.shouldAnimate];
        [self.stackView removeSubview:self.spinner];
    };

    [self.artwork onArtworkUpdate:^{
        @_strongify(self);
        [self artworkUpdated];

        completion();
    } failure:^(NSError *error) {
        completion();
    }];

    [self.artwork onFairUpdate:^(Fair *fair) {
        @_strongify(self);
        if (!self || !fair) return;

        [self.metadataView updateWithFair:fair];
        [self.stackView layoutIfNeeded];
    } failure:nil];

    [self.artwork onSaleArtworkUpdate:^(SaleArtwork *saleArtwork) {
        @_strongify(self);
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
    minimumHeight.constant -= self.contentInset.top;
    NSLayoutConstraint *imageMaxHeight = [[self.metadataView.imageView constrainHeightToView:self.superview predicate:@"<=0"] lastObject];
    // Make the image height somewhat smaller than the superview height so that Artwork favorite and share buttons are visible.
    imageMaxHeight.constant = [UIDevice isPad] ? ARArtworkImageHeightAdjustmentForPad : ARArtworkImageHeightAdjustmentForPhone;
}

- (void)willMoveToSuperview:(UIView *)newSuperview
{
    // We want to set up the metadata view before the artwork view appears,
    // but there is no size available to reference until this point.

    [super willMoveToSuperview:newSuperview];
    if (newSuperview) {
        CGSize size = newSuperview.frame.size;
        [self.metadataView updateConstraintsIsLandscape:size.width > size.height];
    }
}

- (void)didMoveToSuperview
{
    if (self.superview) {
        [self setUpCallbacks];
        [self createHeightConstraints];
    }
}

- (void)addUnpublishedBanner
{
    if (![self.stackView viewWithTag:ARArtworkUnpublishedWarning]) {
        UILabel *warning = [[ARWarningView alloc] initWithFrame:CGRectMake(0, 0, CGRectGetWidth(self.bounds), 88)];
        warning.text = @"Artwork is unpublished.";
        warning.tag = ARArtworkUnpublishedWarning;
        [warning constrainHeight:@"44"];
        [self.stackView addSubview:warning withTopMargin:@"0" sideMargin:@"0"];
    }
}

@end
