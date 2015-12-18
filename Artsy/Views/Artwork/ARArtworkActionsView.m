#import "ARArtworkActionsView.h"
#import "ARArtworkPriceView.h"
#import "ARArtworkAuctionPriceView.h"
#import "ARCountdownView.h"
#import "ARNavigationButtonsViewController.h"
#import "ARNavigationButton.h"
#import "ARAuctionBidderStateLabel.h"
#import "ARBidButton.h"
#import "ARSpinner.h"


@interface ARArtworkActionsView () <ARCountdownViewDelegate>

@property (nonatomic, strong) ARCountdownView *countdownView;
@property (nonatomic, strong) ARBlackFlatButton *contactGalleryButton;
@property (nonatomic, strong) ARInquireButton *inquireWithArtsyButton;
@property (nonatomic, strong) ARArtworkPriceView *priceView;
@property (nonatomic, strong) ARArtworkAuctionPriceView *auctionPriceView;
@property (nonatomic, strong) ARAuctionBidderStateLabel *bidderStatusLabel;
@property (nonatomic, strong) ARBidButton *bidButton;
@property (nonatomic, strong) Artwork *artwork;
@property (nonatomic, strong) SaleArtwork *saleArtwork;
@property (nonatomic, strong) ARNavigationButtonsViewController *navigationButtonsVC;
@property (nonatomic, strong) ARSpinner *spinner;

@end


@implementation ARArtworkActionsView

- (void)dealloc;
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithArtwork:(Artwork *)artwork
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _artwork = artwork;
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

    [[KSPromise when:@[ artworkPromise, saleArtworkPromise ]] then:^id(id value) {
        __strong typeof (wself) sself = wself;
        id returnable = nil;
        [sself updateUI];
        return returnable;
    } error:nil];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(artworkBidUpdated:)
                                                 name:ARAuctionArtworkBidUpdatedNotification
                                               object:nil];
}

- (void)artworkBidUpdated:(NSNotification *)notification;
{
    if ([notification.userInfo[ARAuctionArtworkIDKey] isEqualToString:self.artwork.artworkID]) {
        // First clear the old status so the user is not confronted with out-of-date data, which could be worrisome to
        // the user if they have just made a bid.
        self.saleArtwork = nil;
        for (UIView *subview in self.subviews) {
            [self removeSubview:subview];
        }
        ARSpinner *spinner = [[ARSpinner alloc] initWithFrame:CGRectMake(0, 0, 44, 44)];
        self.spinner = spinner;
        [self.spinner constrainHeight:@"100"];
        [self.spinner fadeInAnimated:ARPerformWorkAsynchronously];
        [self addSubview:self.spinner withTopMargin:@"0" sideMargin:@"0"];

        // Then fetch the up-to-date data.
        __weak typeof(self) wself = self;
        [self.artwork onSaleArtworkUpdate:^(SaleArtwork *saleArtwork) {
            __strong typeof (wself) sself = wself;
            sself.saleArtwork = saleArtwork;
            [sself updateUI];
            sself.spinner = nil;
        } failure:nil allowCached:NO];
    }
}

// The central state for a lot of this logic is in:
// https://docs.google.com/document/d/1kQSHhCiFWxfVkSeql3GQA7UbBbhpNe-UyQ-c6q95Uq0/
//

- (void)updateUI
{
    for (UIView *subview in self.subviews) {
        [self removeSubview:subview];
    }

    NSMutableArray *buttonsWhoseMarginCanChange = [NSMutableArray array];

    if ([self showAuctionControls]) {
        ARAuctionState state = self.saleArtwork.auctionState;
        if (state & (ARAuctionStateUserIsHighBidder | ARAuctionStateUserIsBidder)) {
            self.bidderStatusLabel = [[ARAuctionBidderStateLabel alloc] init];
            [self.bidderStatusLabel updateWithSaleArtwork:self.saleArtwork];
            [self addSubview:self.bidderStatusLabel withTopMargin:@"0" sideMargin:@"0"];
        }

        self.auctionPriceView = [[ARArtworkAuctionPriceView alloc] init];
        [self.auctionPriceView updateWithSaleArtwork:self.saleArtwork];
        [self addSubview:self.auctionPriceView withTopMargin:@"12" sideMargin:@"0"];

        ARBidButton *bidButton = [[ARBidButton alloc] init];
        bidButton.auctionState = self.saleArtwork.auctionState;
        [self addSubview:bidButton withTopMargin:@"30" sideMargin:@"0"];
        [bidButton addTarget:self action:@selector(tappedBidButton:) forControlEvents:UIControlEventTouchUpInside];
        self.bidButton = bidButton;

        if ([self showBuyersPremium]) {
            ARInquireButton *premium = [[ARInquireButton alloc] init];
            premium.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
            [premium setUnderlinedTitle:@"This work has a Buyer's Premium" underlineRange:NSMakeRange(16, 15) forState:UIControlStateNormal];
            [premium addTarget:self action:@selector(tappedBuyersPremium:) forControlEvents:UIControlEventTouchUpInside];
            [self addSubview:premium withTopMargin:@"8" sideMargin:nil];
        }

        if ([self showBuyButton]) {
            self.priceView = [[ARArtworkPriceView alloc] initWithFrame:CGRectZero];
            [self.priceView updatePriceWithArtwork:self.artwork andSaleArtwork:self.saleArtwork];
            [self addSubview:self.priceView withTopMargin:@"4" sideMargin:@"0"];

            ARBlackFlatButton *buy = [[ARBlackFlatButton alloc] init];
            [buy setTitle:@"Buy Now" forState:UIControlStateNormal];
            [buy addTarget:self action:@selector(tappedBuyButton:) forControlEvents:UIControlEventTouchUpInside];
            [self addSubview:buy withTopMargin:@"8" sideMargin:nil];
        }

        [self setupCountdownView];

    } else {
        // No auction controls

        if ([self showPriceLabel] || [self showNotForSaleLabel] || [self showContactForPrice]) {
            self.priceView = [[ARArtworkPriceView alloc] initWithFrame:CGRectZero];

            if ([self showNotForSaleLabel]) {
                [self.priceView addNotForSaleLabel];
            }

            if ([self showContactForPrice]) {
                [self.priceView addContactForPrice];

            } else if ([self showPriceLabel]) {
                [self.priceView updatePriceWithArtwork:self.artwork andSaleArtwork:self.saleArtwork];
            }

            [self addSubview:self.priceView withTopMargin:@"4" sideMargin:@"0"];
        }

        if ([self showBuyButton]) {
            ARBlackFlatButton *buy = [[ARBlackFlatButton alloc] init];
            [buy setTitle:@"Buy" forState:UIControlStateNormal];
            [buy addTarget:self action:@selector(tappedBuyButton:) forControlEvents:UIControlEventTouchUpInside];

            [buttonsWhoseMarginCanChange addObject:buy];

            [self addSubview:buy withTopMargin:@"30" sideMargin:nil];
        }
    }

    if ([self showContactButton]) {
        NSString *title = nil;
        if (self.artwork.partner.type == ARPartnerTypeGallery) {
            title = NSLocalizedString(@"Contact Gallery", @"Contact Gallery");
        } else {
            title = NSLocalizedString(@"Contact Seller", @"Contact Seller");
        }

        ARBlackFlatButton *contact = [[ARBlackFlatButton alloc] init];
        [contact setTitle:title forState:UIControlStateNormal];

        [contact addTarget:self action:@selector(tappedContactGallery:) forControlEvents:UIControlEventTouchUpInside];

        [buttonsWhoseMarginCanChange addObject:contact];

        [self addSubview:contact withTopMargin:@"8" sideMargin:nil];
        self.contactGalleryButton = contact;
    }

    if ([self showInquireButton]) {
        ARInquireButton *specialist = [[ARInquireButton alloc] init];
        [specialist setTitle:@"Ask a Specialist" forState:UIControlStateNormal];
        [specialist addTarget:self action:@selector(tappedContactRepresentative:) forControlEvents:UIControlEventTouchUpInside];

        [buttonsWhoseMarginCanChange addObject:specialist];

        [self addSubview:specialist withTopMargin:@"8" sideMargin:nil];
        self.inquireWithArtsyButton = specialist;
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

- (void)tappedContactRepresentative:(id)sender
{
    [self.delegate tappedContactRepresentative];
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
    [self.delegate tappedBidButton];
}

- (void)tappedBuyersPremium:(id)sender
{
    [self.delegate tappedBuyersPremium];
}

- (void)tappedBuyButton:(id)sender
{
    [self.delegate tappedBuyButton];
}

- (void)tappedAuctionResults:(id)sender
{
    [self.delegate tappedAuctionResults];
}

- (void)tappedMoreInfo:(id)sender
{
    [self.delegate tappedMoreInfo];
}

- (NSArray *)navigationButtons
{
    NSMutableArray *navigationButtons = [[NSMutableArray alloc] init];

    if ([self showAuctionResultsButton]) {
        NSDictionary *results = @{
            ARNavigationButtonClassKey : ARNavigationButton.class,
            ARNavigationButtonPropertiesKey : @{
                @keypath(ARNavigationButton.new, title) : @"Auction Results"
            },
            ARNavigationButtonHandlerKey : ^(UIButton *sender){
                    // This will pass the message up the responder chain
                    [self.delegate tappedAuctionResults];
    }
};
[navigationButtons addObject:results];
}
if ([self showMoreInfoButton]) {
    NSDictionary *moreInfo = @{
        ARNavigationButtonClassKey : ARNavigationButton.class,
        ARNavigationButtonPropertiesKey : @{
            @keypath(ARNavigationButton.new, title) : @"More Info"
        },
        ARNavigationButtonHandlerKey : ^(UIButton *sender){
                // This will pass the message up the responder chain
                [self.delegate tappedMoreInfo];
}
}
;

[navigationButtons addObject:moreInfo];
}
return [navigationButtons copy];
}

- (void)setEnabled:(BOOL)enabled
{
    [self.contactGalleryButton setEnabled:enabled animated:YES];
    [self.inquireWithArtsyButton setEnabled:enabled animated:YES];
}

// Wonder where all this logic comes from?
// See: https://docs.google.com/document/d/1kQSHhCiFWxfVkSeql3GQA7UbBbhpNe-UyQ-c6q95Uq0

#pragma mark - Info Logic

- (BOOL)showNotForSaleLabel
{
    return self.artwork.inquireable.boolValue && !self.artwork.sold.boolValue && !self.artwork.forSale.boolValue;
}

- (BOOL)showPriceLabel
{
    return self.artwork.price.length && !self.artwork.hasMultipleEditions && (self.artwork.inquireable.boolValue || self.artwork.sold.boolValue);
}

- (BOOL)showContactForPrice
{
    return self.artwork.availability == ARArtworkAvailabilityForSale && self.artwork.isPriceHidden.boolValue;
}

- (BOOL)showContactButton
{
    return self.artwork.forSale.boolValue && !self.artwork.acquireable.boolValue && ![self showAuctionControls];
}

- (BOOL)showBuyButton
{
    return self.artwork.acquireable.boolValue;
}

// We differentiate from martsy here
// see https://github.com/artsy/eigen/issues/857
// awaiting consolidation in the doc.

- (BOOL)showInquireButton
{
    return self.artwork.inquireable.boolValue && self.artwork.availability == ARArtworkAvailabilityForSale;
}

- (BOOL)showAuctionControls
{
    return (self.saleArtwork != nil) && !self.artwork.sold.boolValue;
}

- (BOOL)showConditionsOfSale
{
    return (self.saleArtwork != nil) && !self.artwork.sold.boolValue;
}

- (BOOL)showAuctionResultsButton
{
    return self.artwork.shouldShowAuctionResults;
}

- (BOOL)showMoreInfoButton
{
    return self.artwork.hasMoreInfo;
}

- (BOOL)showBuyersPremium
{
    return self.saleArtwork.auction.hasBuyersPremium;
}

#pragma mark ARContactViewDelegate

- (void)setupCountdownView
{
    ARCountdownView *countdownView = [[ARCountdownView alloc] init];
    countdownView.delegate = self;
    [self addSubview:countdownView withTopMargin:@"8" sideMargin:@"120"];
    self.countdownView = countdownView;
    [self updateCountdownView];
}

- (void)updateCountdownView
{
    NSDate *now = [ARSystemTime date];

    NSDate *startDate = self.saleArtwork.auction.startDate;
    NSDate *endDate = self.saleArtwork.auction.endDate;

    self.bidButton.auctionState = self.saleArtwork.auctionState;

    if (!self.saleArtwork.auction) {
        [self removeSubview:self.bidButton];
        [self removeSubview:self.countdownView];
        [self removeSubview:self.bidderStatusLabel];
        [self removeSubview:self.auctionPriceView];

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
