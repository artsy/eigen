#import "ARArtworkView.h"

#import "Artwork.h"
#import "ARSpinner.h"
#import "ARAuctionBannerView.h"
#import "ARWhitespaceGobbler.h"
#import "ARCustomEigenLabels.h"
#import "ARNavigationController.h"
#import "ARMenuAwareViewController.h"

#import "UIDevice-Hardware.h"

#import <ARAnalytics/ARAnalytics.h>
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


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

- (instancetype)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair echo:(ArtsyEcho *)echo andParentViewController:(ARLegacyArtworkViewController *)parentViewController;
{
    self = [super initWithStackViewClass:[ORTagBasedAutoStackView class]];

    if (!self) {
        return nil;
    }
    _artwork = artwork;
    _fair = fair;
    _echo = echo;
    _parentViewController = parentViewController;

    self.scrollsToTop = NO;
    self.scrollEnabled = YES;
    self.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    self.backgroundColor = [UIColor blackColor];
    self.stackView.backgroundColor = [UIColor whiteColor];
    self.stackView.bottomMarginHeight = 20;

    ARArtworkMetadataView *metadataView = [[ARArtworkMetadataView alloc] initWithArtwork:self.artwork andFair:self.fair echo:echo];
    metadataView.tag = ARArtworkPreview;
    self.metadataView = metadataView;

    ARArtworkBlurbView *artworkBlurbView = [[ARArtworkBlurbView alloc] initWithArtwork:self.artwork];
    artworkBlurbView.tag = ARArtworkBlurb;
    self.artworkBlurbView = artworkBlurbView;

    ARSpinner *spinner = [[ARSpinner alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];
    [spinner fadeInAnimated:ARPerformWorkAsynchronously];
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

    return self;
}

- (void)didMoveToSuperview
{
    if (self.superview) {
        // It seems like UIPageViewController (?) adds some temporary constraints that cause breakage with our
        // constraints. Seting up our constraints from here instead works around that issue.
        [self setUpSubviews];

        [self setUpCallbacks];
        [self createHeightConstraints];
    } else {
        [[NSNotificationCenter defaultCenter] removeObserver:self name:ARAuctionArtworkBidUpdatedNotification object:nil];
    }
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
    __weak typeof(self) wself = self;

    void (^completion)(void) = ^{
        __strong typeof (wself) sself = wself;
        [sself.spinner fadeOutAnimated:ARPerformWorkAsynchronously];
        [sself.stackView removeSubview:sself.spinner];
    };

    [self.artwork onArtworkUpdate:^{
        __strong typeof (wself) sself = wself;
        [sself artworkUpdated];

        completion();
    } failure:^(NSError *error) {
        completion();
    }];

    [self.artwork onFairUpdate:^(Fair *fair) {
        __strong typeof (wself) sself = wself;
        if (!sself || !fair) return;


        [sself.metadataView updateWithFair:fair];
        [sself.stackView layoutIfNeeded];
    } failure:nil];

    [self.artwork onSaleArtworkUpdate:^(SaleArtwork *saleArtwork) {
        __strong typeof (wself) sself = wself;
        if (saleArtwork.auctionState & ARAuctionStateUserIsBidder) {
            [ARAnalytics setUserProperty:@"has_placed_bid" toValue:@"true"];
            sself.banner.auctionState = saleArtwork.auctionState;
            [UIView animateIf:ARPerformWorkAsynchronously duration:ARAnimationDuration :^{
                [sself.banner updateHeightConstraint];
                [sself.stackView layoutIfNeeded];
            }];
        }
    } failure:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(artworkBidUpdated:)
                                                 name:ARAuctionArtworkBidUpdatedNotification
                                               object:nil];
}

- (void)artworkBidUpdated:(NSNotification *)notification;
{
    if ([notification.userInfo[ARAuctionArtworkIDKey] isEqualToString:self.artwork.artworkID]) {
        __weak typeof(self) wself = self;
        [self.metadataView showActionsViewSpinner];
        [self.artwork onSaleArtworkUpdate:^(SaleArtwork *_Nonnull saleArtwork) {
            __strong typeof (wself) sself = wself;
            if (saleArtwork.auctionState & ARAuctionStateUserIsBidder) {
                [ARAnalytics setUserProperty:@"has_placed_bid" toValue:@"true"];
                sself.banner.auctionState = saleArtwork.auctionState;
                [UIView animateIf:ARPerformWorkAsynchronously duration:ARAnimationDuration :^{
                    [sself.banner updateHeightConstraint];
                    [sself.stackView layoutIfNeeded];
                }];
                [sself.metadataView updateUIForSaleArtwork:saleArtwork];
            }
        }
                                  failure:nil
                              allowCached:NO];
        [self.artwork updateSaleArtwork];
    }
}

- (void)createHeightConstraints
{
    NSLayoutConstraint *minimumHeight = [self.stackView constrainHeightToView:self.superview predicate:@">=0"];
    minimumHeight.constant -= self.contentInset.top;
    NSLayoutConstraint *imageMaxHeight = [self.metadataView.imageView constrainHeightToView:self.superview predicate:@"<=0"];
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
