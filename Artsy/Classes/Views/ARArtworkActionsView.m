#import "ARArtworkActionsView.h"
#import "ARArtworkPriceView.h"
#import "ARArtworkAuctionPriceView.h"
#import "ARCountdownView.h"
#import "ARNavigationButtonsViewController.h"
#import "ARNavigationButton.h"
#import "ARAuctionBidderStateLabel.h"
#import "ARBidButton.h"

@interface ARArtworkActionsView()<ARCountdownViewDelegate>

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

@end

@implementation ARArtworkActionsView

- (instancetype)initWithArtwork:(Artwork *)artwork
{
    self = [super init];
    if (!self) { return nil; }

    _artwork = artwork;
    self.bottomMarginHeight = 0;

    return self;
}

- (void)setDelegate:(id<ARArtworkActionsViewDelegate>)delegate
{
    _delegate = delegate;
    @weakify(self);

    KSPromise *artworkPromise = [self.artwork onArtworkUpdate:nil failure:nil];
    KSPromise *saleArtworkPromise = [self.artwork onSaleArtworkUpdate:^(SaleArtwork *saleArtwork) {
        @strongify(self);
        self.saleArtwork = saleArtwork;
    } failure:nil];

    [[KSPromise when:@[artworkPromise, saleArtworkPromise]] then:^id(id value) {
        @strongify(self);
        id returnable = nil;
        [self updateUI];
        return returnable;
    } error:nil];
}

- (void)updateUI
{
    for (UIView *subview in self.subviews) {
        [self removeSubview:subview];
    }

    BOOL shownPrice = NO;
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
        shownPrice = YES;
    } else if ([self showPriceLabel]) {
        self.priceView = [[ARArtworkPriceView alloc] initWithFrame:CGRectZero];
        [self.priceView updateWithArtwork:self.artwork];
        [self addSubview:self.priceView withTopMargin:@"4" sideMargin:@"0"];
        shownPrice = YES;
    }

    NSString *buttonMargin = shownPrice? @"30" : @"0";

    if ([self showAuctionControls]) {
        ARBidButton *bidButton = [[ARBidButton alloc] init];
        bidButton.auctionState = self.saleArtwork.auctionState;
        [self addSubview:bidButton withTopMargin:shownPrice? @"30" : @"0" sideMargin:@"0"];
        [bidButton addTarget:nil action:@selector(tappedBidButton:) forControlEvents:UIControlEventTouchUpInside];
        self.bidButton = bidButton;
        buttonMargin = @"8";

        if ([self showBuyButton]) {
            self.priceView = [[ARArtworkPriceView alloc] initWithFrame:CGRectZero];
            [self.priceView updateWithArtwork:self.artwork andSaleArtwork:self.saleArtwork];
            [self addSubview:self.priceView withTopMargin:@"4" sideMargin:@"0"];

            ARBlackFlatButton *buy = [[ARBlackFlatButton alloc] init];
            [buy setTitle:@"Buy Now" forState:UIControlStateNormal];
            [buy addTarget:nil action:@selector(tappedBuyButton:) forControlEvents:UIControlEventTouchUpInside];
            [self addSubview:buy withTopMargin:buttonMargin sideMargin:nil];
        }

        [self setupCountdownView];

    } else if ([self showBuyButton]) {
        ARBlackFlatButton *buy = [[ARBlackFlatButton alloc] init];
        [buy setTitle:@"Buy" forState:UIControlStateNormal];
        [buy addTarget:nil action:@selector(tappedBuyButton:) forControlEvents:UIControlEventTouchUpInside];
        [self addSubview:buy withTopMargin:buttonMargin sideMargin:nil];
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

        [contact addTarget:nil action:@selector(tappedContactGallery:) forControlEvents:UIControlEventTouchUpInside];
        [self addSubview:contact withTopMargin:buttonMargin sideMargin:nil];
        self.contactGalleryButton = contact;
    }

    if ([self showInquireButton]) {
        ARInquireButton *specialist = [[ARInquireButton alloc] init];
        [specialist setTitle:@"Ask an Artsy Specialist" forState:UIControlStateNormal];
        [specialist addTarget:nil action:@selector(tappedContactRepresentative:) forControlEvents:UIControlEventTouchUpInside];

        BOOL hasAnotherButton = ([self showContactButton] || [self showBuyButton]);
        NSString *topMargin = (hasAnotherButton) ? @"8" : buttonMargin;
        [self addSubview:specialist withTopMargin:topMargin sideMargin:nil];
        self.inquireWithArtsyButton = specialist;
    }

    if ([self showAuctionControls]) {
        ARInquireButton *auctionsInfo = [[ARInquireButton alloc] init];
        [auctionsInfo setTitle:@"How Auctions Work?" forState:UIControlStateNormal];
        [auctionsInfo addTarget:nil action:@selector(tappedAuctionInfo:) forControlEvents:UIControlEventTouchUpInside];
        BOOL hasAnotherButton = ([self showContactButton] || [self showBuyButton] || self.inquireWithArtsyButton);
        NSString *topMargin = (hasAnotherButton) ? @"8" : buttonMargin;
        [self addSubview:auctionsInfo withTopMargin:topMargin sideMargin:nil];
    }

    NSArray *navigationButtons = [self navigationButtons];
    if (navigationButtons.count > 0) {
        self.navigationButtonsVC = [[ARNavigationButtonsViewController alloc] init];
        [self.navigationButtonsVC addButtonDescriptions:[self navigationButtons] unique:YES];
        [self addSubview:self.navigationButtonsVC.view withTopMargin:@"20" sideMargin:@"0"];
    }

    [self.delegate didUpdateArtworkActionsView:self];
}

- (NSArray *)navigationButtons
{
    NSMutableArray *navigationButtons = [[NSMutableArray alloc] init];

    if ([self showAuctionResultsButton]) {
        [navigationButtons addObject:@{
            ARNavigationButtonClassKey: ARNavigationButton.class,
            ARNavigationButtonPropertiesKey: @{
                @keypath(ARNavigationButton.new, title): @"Auction Results"
            },
            ARNavigationButtonHandlerKey: ^(UIButton *sender) {
                // This will pass the message up the responder chain
                [[UIApplication sharedApplication] sendAction:@selector(tappedAuctionResults:)
                                                to:nil from:self forEvent:nil];
            }
        }];
    }
    if ([self showMoreInfoButton]) {

        [navigationButtons addObject:@{
            ARNavigationButtonClassKey: ARNavigationButton.class,
            ARNavigationButtonPropertiesKey: @{
                    @keypath(ARNavigationButton.new, title): @"More Info"
                },
            ARNavigationButtonHandlerKey: ^(UIButton *sender) {
                // This will pass the message up the responder chain
                [[UIApplication sharedApplication] sendAction:@selector(tappedMoreInfo:)
                                                to:nil from:self forEvent:nil];
            }
        }];
    }
    return [navigationButtons copy];
}

- (void)setEnabled:(BOOL)enabled {
    [self.contactGalleryButton setEnabled:enabled animated:YES];
    [self.inquireWithArtsyButton setEnabled:enabled animated:YES];
}

#pragma mark - Info Logic

- (BOOL)showNotForSaleLabel
{
    return self.artwork.inquireable.boolValue
    && !self.artwork.sold.boolValue
    && !self.artwork.forSale.boolValue;
}

- (BOOL)showPriceLabel
{
    return self.artwork.price.length
    && !self.artwork.hasMultipleEditions
    && (self.artwork.inquireable.boolValue || self.artwork.sold.boolValue);
}

- (BOOL)showContactButton
{
    return self.artwork.forSale.boolValue
    && !self.artwork.acquireable.boolValue
    && ![self showAuctionControls];
}

- (BOOL)showBuyButton
{
    return self.artwork.acquireable.boolValue;
}

- (BOOL)showInquireButton
{
    return self.artwork.inquireable.boolValue;
}

- (BOOL)showAuctionControls
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

-(CGSize) intrinsicContentSize
{
    return CGSizeMake(280, UIViewNoIntrinsicMetric);
}

@end
