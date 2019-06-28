#import "ARArtworkActionsView.h"

#import "Artwork.h"
#import "AROptions.h"
#import "ARArtworkPriceView.h"
#import "ARArtworkAuctionPriceView.h"
#import "ARCountdownView.h"
#import "ARNavigationButtonsViewController.h"
#import "ARNavigationButton.h"
#import "ARBidButton.h"
#import "ARSpinner.h"
#import "Partner.h"
#import "UIDevice-Hardware.h"

#import "ARMacros.h"
#import "ARSystemTime.h"

#import "ArtsyEcho.h"
#import "ArtsyEcho+BNMO.h"
#import <KSDeferred/KSPromise.h>
#import <ReactiveObjC/ReactiveObjC.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <Artsy+UILabels/Artsy+UILabels.h>

@interface ARArtworkActionsView () <ARCountdownViewDelegate>

@property (nonatomic, strong) ARCountdownView *countdownView;
@property (nonatomic, strong) ARBlackFlatButton *contactGalleryButton;
@property (nonatomic, strong) ARArtworkPriceView *priceView;
@property (nonatomic, strong) ARArtworkAuctionPriceView *auctionPriceView;
@property (nonatomic, strong) ARSpinner *spinner;
@property (nonatomic, strong) UIView *bannerView;
@property (nonatomic, strong) ARBidButton *bidButton;

@property (nonatomic, strong) ARNavigationButtonsViewController *navigationButtonsVC;

@property (nonatomic, strong) Artwork *artwork;
@property (nonatomic, strong) ArtsyEcho *echo;
@property (nonatomic, strong) SaleArtwork *saleArtwork;

@end


@implementation ARArtworkActionsView

- (instancetype)initWithArtwork:(Artwork *)artwork echo:(ArtsyEcho *)echo
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _artwork = artwork;
    _echo = echo;
    self.bottomMarginHeight = 0;

    return self;
}

- (void)setDelegate:(id<ARArtworkActionsViewDelegate, ARArtworkActionsViewButtonDelegate>)delegate
{
    _delegate = delegate;
    __weak typeof(self) wself = self;

    KSPromise *artworkPromise = [self.artwork onArtworkUpdate:nil failure:nil];
    KSPromise *saleArtworkPromise = [self.artwork onSaleArtworkUpdate:^(SaleArtwork *saleArtwork) {
        __strong typeof (wself) sself = wself;
        sself.saleArtwork = saleArtwork;
    } failure:nil];

    // On iPhone, all views are stacked vertically and the bottom row of related artworks has a spinner; we don't want
    // to show two spinners on top of one another. But on iPad, the spinners are in different parts of the screen, so we
    // do want to show both. We're using isPad because we're not in a view hierarchy when this method is called and
    // can't rely on self.traitCollection to return accurate results. It's not ideal but it works.
    if ([UIDevice isPad]) {
        [self showSpinner];
    }

    [[KSPromise when:@[ artworkPromise, saleArtworkPromise ]] then:^id(id value) {
        __strong typeof (wself) sself = wself;
        id returnable = nil;
        [sself updateUI];
        return returnable;
    } error:nil];
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];

    // New ARArtworkViews are instantiated and loaded while not in a view hierarchy. The call to fadeInAnimated: in
    // `showSpinner` will have no effect until the view is in a hierarchy, so we check below.
    if (self.superview) {
        [self.spinner fadeInAnimated:ARPerformWorkAsynchronously];
    }
}

- (void)showSpinner
{
    for (UIView *subview in self.subviews) {
        [self removeSubview:subview];
    }
    ARSpinner *spinner = [[ARSpinner alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];
    self.spinner = spinner;
    [self.spinner constrainHeight:@"100"];
    [self.spinner fadeInAnimated:ARPerformWorkAsynchronously];
    [self addSubview:self.spinner withTopMargin:@"0" sideMargin:@"0"];
}

- (void)updateUIForSaleArtwork:(SaleArtwork *)saleArtwork
{
    self.saleArtwork = saleArtwork;
    [self updateUI];
}

// The central state for a lot of this logic is in:
// https://docs.google.com/document/d/1kQSHhCiFWxfVkSeql3GQA7UbBbhpNe-UyQ-c6q95Uq0/
//
- (void)updateUI
{
    for (UIView *subview in self.subviews) {
        if (subview != self.bannerView) {
            [self removeSubview:subview];
        }
    }

     NSMutableArray *buttonsWhoseMarginCanChange = [NSMutableArray array];

    if ([self liveAuctionIsOngoing]) {
        ARBlackFlatButton *openLiveSale = [[ARBlackFlatButton alloc] init];
        [openLiveSale setTitle:@"Enter Live Auction" forState:UIControlStateNormal];
        [openLiveSale addTarget:self action:@selector(tappedLiveSaleButton:) forControlEvents:UIControlEventTouchUpInside];

        [buttonsWhoseMarginCanChange addObject:openLiveSale];

        [self addSubview:openLiveSale withTopMargin:@"8" sideMargin:nil];
    }

    if ([self showAuctionControls]) {
        if ([self showAuctionPriceView]) {
            self.auctionPriceView = [[ARArtworkAuctionPriceView alloc] init];
            [self.auctionPriceView updateWithSaleArtwork:self.saleArtwork];
            [self addSubview:self.auctionPriceView withTopMargin:@"26" sideMargin:@"0"];
        }

        ARBidButton *bidButton = [[ARBidButton alloc] init];
        [bidButton setAuctionState:self.saleArtwork.auctionState animated:NO intent:ARBidButtonIntentBid];
        [self addSubview:bidButton withTopMargin:@"26" sideMargin:@"0"];
        [bidButton addTarget:self action:@selector(tappedBidButton:) forControlEvents:UIControlEventTouchUpInside];
        self.bidButton = bidButton;

        if ([self showBuyersPremium]) {
            ARInquireButton *premium = [[ARInquireButton alloc] init];
            [premium setUnderlinedTitle:@"This work has a Buyer's Premium" underlineRange:NSMakeRange(16, 15) forState:UIControlStateNormal];
            [premium addTarget:self action:@selector(tappedBuyersPremium:) forControlEvents:UIControlEventTouchUpInside];
            [self addSubview:premium withTopMargin:@"8" sideMargin:nil];
        }

        if ([self showBuyButton]) {
            self.priceView = [[ARArtworkPriceView alloc] initWithFrame:CGRectZero];
            [self.priceView updatePriceWithArtwork:self.artwork andSaleArtwork:self.saleArtwork];
            [self addSubview:self.priceView withTopMargin:@"4" sideMargin:@"0"];

            if ([self showShippingInfo]) {
                [self.priceView addShippingDetails:self.artwork];
            }

            ARBlackFlatButton *buy = [[ARBlackFlatButton alloc] init];
            [buy setTitle:self.artwork.isBuyNowable ? @"Buy now" : [self contactButtonTitle] forState:UIControlStateNormal];
            [buy addTarget:self action:@selector(tappedBuyButton:) forControlEvents:UIControlEventTouchUpInside];
            [self addSubview:buy withTopMargin:@"8" sideMargin:nil];
        }

        [self setupCountdownView];

    } else {
        // No auction controls
        if ([self showPriceLabel] || [self showContactForPrice] || [self showShippingInfo]) {
            self.priceView = [[ARArtworkPriceView alloc] initWithFrame:CGRectZero];

            if ([self showContactForPrice]) {
                [self.priceView addContactForPrice];

            } else if ([self showPriceLabel]) {
                [self.priceView updatePriceWithArtwork:self.artwork andSaleArtwork:self.saleArtwork];
            }

            if ([self showShippingInfo]) {
                [self.priceView addShippingDetails:self.artwork];
            }

            [self addSubview:self.priceView withTopMargin:@"4" sideMargin:@"0"];
        }


        if ([self showBuyButton]) {
            ARBlackFlatButton *buy = [[ARBlackFlatButton alloc] init];
            [buy setTitle:self.artwork.isBuyNowable ? @"Buy now" : [self contactButtonTitle] forState:UIControlStateNormal];
            [buy addTarget:self action:@selector(tappedBuyButton:) forControlEvents:UIControlEventTouchUpInside];

            [buttonsWhoseMarginCanChange addObject:buy];

            [self addSubview:buy withTopMargin:@"30" sideMargin:nil];
        }
    }

    if ([self showMakeOfferButton]) {
        ARButton *button;
        // If the Make Offer button is by itself, it should be black. Otherwise, should be white.
        if ([self showBuyButton]) {
            button = [[ARWhiteFlatButton alloc] init];
            button.layer.borderWidth = 1;
            button.layer.borderColor = UIColor.blackColor.CGColor;
        } else {
            button = [[ARBlackFlatButton alloc] init];
        }
        [button setTitle:@"Make offer" forState:UIControlStateNormal];
        [button addTarget:self action:@selector(tappedMakeOfferButton:) forControlEvents:UIControlEventTouchUpInside];

        [buttonsWhoseMarginCanChange addObject:button];

        [self addSubview:button withTopMargin:([self showBuyButton] ? @"10" : @"30") sideMargin:nil];
    }

    if ([self showContactButton]) {
        NSString *title = [self contactButtonTitle];

        ARBlackFlatButton *contact = [[ARBlackFlatButton alloc] init];
        [contact setTitle:title forState:UIControlStateNormal];

        [contact addTarget:self action:@selector(tappedContactGallery:) forControlEvents:UIControlEventTouchUpInside];

        [buttonsWhoseMarginCanChange addObject:contact];

        [self addSubview:contact withTopMargin:@"8" sideMargin:nil];
        self.contactGalleryButton = contact;
    }

    if ([self showAuctionControls]) {
        ARInquireButton *auctionsInfo = [[ARInquireButton alloc] init];
        [auctionsInfo setTitle:@"How bidding works" forState:UIControlStateNormal];
        [auctionsInfo addTarget:self action:@selector(tappedAuctionInfo:) forControlEvents:UIControlEventTouchUpInside];

        [buttonsWhoseMarginCanChange addObject:auctionsInfo];

        [self addSubview:auctionsInfo withTopMargin:@"8" sideMargin:nil];
    }

    if ([self showConditionsOfSale]) {
        ARInquireButton *conditions = [[ARInquireButton alloc] init];
        [conditions setTitle:@"Conditions of Sale" forState:UIControlStateNormal];
        [conditions addTarget:self action:@selector(tappedConditionsOfSale:) forControlEvents:UIControlEventTouchUpInside];

        [buttonsWhoseMarginCanChange addObject:conditions];

        [self addSubview:conditions withTopMargin:@"8" sideMargin:nil];
    }

    NSArray *navigationButtons = [self navigationButtons];
    if (navigationButtons.count > 0) {
        self.navigationButtonsVC = [[ARNavigationButtonsViewController alloc] init];
        [self.navigationButtonsVC addButtonDescriptions:[self navigationButtons] unique:YES];
        [self addSubview:self.navigationButtonsVC.view withTopMargin:@"20" sideMargin:@"0"];
    }

    UIView *first = [self firstView];
    BOOL shouldUpdateTopMargin = [buttonsWhoseMarginCanChange indexOfObject:[self firstView]] != NSNotFound;
    if (shouldUpdateTopMargin) {
        [self updateTopMargin:@"0" forView:first];
    }

    [self.delegate didUpdateArtworkActionsView:self];
}

- (void)tappedContactGallery:(id)sender
{
    [self.delegate tappedContactGallery];
}

- (void)tappedAuctionInfo:(id)sender
{
    [self.delegate tappedAuctionInfo];
}

- (void)tappedConditionsOfSale:(id)sender
{
    [self.delegate tappedConditionsOfSale];
}

- (void)tappedBidButton:(id)sender
{
    [self.delegate tappedBidButton:sender saleID:self.saleArtwork.auction.saleID];
}

- (void)tappedLiveSaleButton:(id)sender
{
    [self.delegate tappedLiveSaleButton:sender];
}

- (void)tappedBuyersPremium:(id)sender
{
    [self.delegate tappedBuyersPremium:sender];
}

- (void)tappedBuyButton:(id)sender
{
    [self.delegate tappedBuyButton];
}

- (void)tappedMakeOfferButton:(id)sender
{
    [self.delegate tappedMakeOfferButton];
}

- (void)tappedMoreInfo:(id)sender
{
    [self.delegate tappedMoreInfo];
}

- (NSArray *)navigationButtons
{
    NSMutableArray *navigationButtons = [[NSMutableArray alloc] init];

    if ([self showMoreInfoButton]) {
        NSDictionary *moreInfo = @{
            ARNavigationButtonClassKey : ARNavigationButton.class,
            ARNavigationButtonPropertiesKey : @{
                ar_keypath(ARNavigationButton.new, title) : @"More Info"
            },
            ARNavigationButtonHandlerKey : ^(UIButton *sender){
                    // This will pass the message up the responder chain
                    [self.delegate tappedMoreInfo];
    }
};

[navigationButtons addObject:moreInfo];
}

return [navigationButtons copy];
}

- (void)setEnabled:(BOOL)enabled
{
    [self.contactGalleryButton setEnabled:enabled animated:YES];
}

#pragma mark - Info Logic

// Show the auction price view if the auction has started (implies not finished) or is showing a preview.
- (BOOL)showAuctionPriceView
{
    return self.saleArtwork.auctionState & (ARAuctionStateStarted | ARAuctionStateShowingPreview);
}

// Show if artwork has a price (but not multiple editions) and acquirable, inquireable or sold
- (BOOL)showPriceLabel
{
    return self.artwork.price.length && !self.artwork.hasMultipleEditions && (self.artwork.isAcquireable.boolValue || self.artwork.isInquireable.boolValue || self.artwork.sold.boolValue);
}

// Show if artwork is for sale but its price is hidden
// Never shows if Make offer is shown.
- (BOOL)showContactForPrice
{
    return (self.artwork.availability == ARArtworkAvailabilityForSale || self.artwork.availability == ARArtworkAvailabilityNotForSale)
        && self.artwork.isPriceHidden.boolValue
        && ![self showMakeOfferButton];
}

// Show if we allow contacting, or the artwork is for sale and inquireable, but not acquireable and not in an auction
- (BOOL)showContactButton
{
    // Note: we can't use self.artwork.forSale because some artworks aren't for sale but are still contactable.
    BOOL inquirableButNotAcquirableAndNotInAuction = (self.artwork.isInquireable.boolValue && !self.artwork.isAcquireable.boolValue)
        && ![self showAuctionControls] && ![self liveAuctionIsOngoing];
    BOOL shouldShouldContactButton = [self showContactForPrice] || inquirableButNotAcquirableAndNotInAuction;
    return shouldShouldContactButton && ![self showMakeOfferButton];
}

// Show if acquireable
- (BOOL)showBuyButton
{
    return self.artwork.isAcquireable.boolValue;
}

- (BOOL)showMakeOfferButton
{
    // We don't have a UI to select from multiple edition sets yet, so don't show the Make Offer UI at all for those works.
    return (self.artwork.isOfferable.boolValue &&
            self.echo.isMakeOfferAccessible &&
            !self.artwork.hasMultipleEditions);
}

- (BOOL)showAuctionControls
{
    // We don't want to show regular auction controls and live auction ones at the same time, and live takes precedence.
    return (self.saleArtwork != nil) && !self.artwork.sold.boolValue && ![self liveAuctionIsOngoing];
}

- (BOOL)liveAuctionIsOngoing
{
    return (self.saleArtwork != nil) && self.saleArtwork.auction.shouldShowLiveInterface;
}

- (BOOL)showConditionsOfSale
{
    return (self.saleArtwork != nil) && !self.artwork.sold.boolValue;
}

- (BOOL)showMoreInfoButton
{
    return self.artwork.hasMoreInfo;
}

- (BOOL)showBuyersPremium
{
    return self.saleArtwork.auction.hasBuyersPremium;
}

- (BOOL)showShippingInfo
{
    return !self.artwork.sold.boolValue && (self.artwork.shippingInfo.length || self.artwork.shippingOrigin.length);
}

- (NSString *)contactButtonTitle
{
    if (self.artwork.partner.type == ARPartnerTypeGallery) {
        return NSLocalizedString(@"Contact gallery", @"Contact gallery");
    } else {
        return NSLocalizedString(@"Contact seller", @"Contact seller");
    }
}

#pragma mark ARContactViewDelegate

- (void)setupCountdownView
{
    ARCountdownView *countdownView = [[ARCountdownView alloc] init];
    countdownView.delegate = self;
    [self addSubview:countdownView withTopMargin:@"8" sideMargin:@"30"];
    self.countdownView = countdownView;
    [self updateCountdownView];
}

- (void)updateCountdownView
{
    NSDate *now = [ARSystemTime date];

    NSDate *startDate = self.saleArtwork.auction.startDate;
    NSDate *liveStartDate = self.saleArtwork.auction.liveAuctionStartDate;
    NSDate *endDate = self.saleArtwork.auction.endDate;

    [self.bidButton setAuctionState:self.saleArtwork.auctionState animated:YES intent:ARBidButtonIntentBid];

    if (!self.saleArtwork.auction) {
        [self removeSubview:self.bidButton];
        [self removeSubview:self.countdownView];
        [self removeSubview:self.auctionPriceView];

    } else if ([now compare:liveStartDate] == NSOrderedAscending) {
        self.countdownView.heading = @"Live Bidding Opens";
        self.countdownView.targetDate = liveStartDate;
        [self.countdownView startTimer];
    } else if ([now compare:startDate] == NSOrderedAscending) {
        self.countdownView.heading = @"Auction Opens";
        self.countdownView.targetDate = startDate;
        [self.countdownView startTimer];

    } else if ([now compare:endDate] == NSOrderedAscending) {
        self.countdownView.heading = @"Auction Ends";
        self.countdownView.targetDate = endDate;
        [self.countdownView startTimer];

    } else {
        [self removeSubview:self.countdownView];
        [self.delegate didUpdateArtworkActionsView:self];
    }
}

- (void)countdownViewDidFinish:(ARCountdownView *)countdownView
{
    [self updateCountdownView];
}

- (CGSize)intrinsicContentSize
{
    return CGSizeMake(280, UIViewNoIntrinsicMetric);
}

@end
