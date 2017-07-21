@import Artsy_UILabels;
@import Artsy_UIFonts;
@import Artsy_UIColors;
@import EDColor;
@import FLKAutoLayout;
@import ObjectiveSugar;

#import "NSArray+Additions.h"
#import "ARAspectRatioImageView.h"
#import "UIImageView+AsyncImageLoading.h"
#import "Artsy-Swift.h"

#import "ARSeparatorViews.h"

#import "ARSaleArtworkFlowCollectionViewCell.h"


@interface ARSaleArtworkFlowCollectionViewCell ()

@property (nonatomic, strong) ARSeparatorView *separatorView;
@property (nonatomic, strong) ARAspectRatioImageView *artworkImageView;
@property (nonatomic, strong) ARSansSerifLabel *lotNumberLabel;
@property (nonatomic, strong) ARSerifLabel *artistNameLabel;
@property (nonatomic, strong) ARSerifLabel *artworkNameLabel;
@property (nonatomic, strong) ARSerifLabel *currentOrStartingBidLabel;
@property (nonatomic, strong) ARSerifLabel *numberOfBidsLabel;
@property (nonatomic, strong) ARSerifLabel *auctionClosedLabel;

@end


@implementation ARSaleArtworkFlowCollectionViewCell

- (void)createSubviews
{
    self.contentView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.contentView alignToView:self];

    self.separatorView = [[ARSeparatorView alloc] init];
    [self.contentView addSubview:self.separatorView];

    self.artworkImageView = [[ARAspectRatioImageView alloc] init];
    self.artworkImageView.contentMode = UIViewContentModeScaleAspectFit;
    self.artworkImageView.clipsToBounds = YES;
    [self.contentView addSubview:self.artworkImageView];

    UIColor *darkGrey = [UIColor artsyGraySemibold];

    self.lotNumberLabel = [[ARSansSerifLabel alloc] init];
    self.lotNumberLabel.font = [UIFont sansSerifFontWithSize:10];
    self.lotNumberLabel.textColor = darkGrey;
    [self.contentView addSubview:self.lotNumberLabel];

    UIFont *serifFont = [UIFont serifFontWithSize:14];

    self.artistNameLabel = [[ARSerifLabel alloc] init];
    self.artistNameLabel.font = serifFont;
    self.artistNameLabel.textColor = darkGrey;
    [self.contentView addSubview:self.artistNameLabel];

    self.artworkNameLabel = [[ARSerifLabel alloc] init];
    self.artworkNameLabel.font = [UIFont serifItalicFontWithSize:serifFont.pointSize];
    self.artworkNameLabel.textColor = darkGrey;
    [self.contentView addSubview:self.artworkNameLabel];

    // TODO: Replace with Artsy standard colour.
    UIColor *lightGrey = [UIColor colorWithHex:0x999999];

    self.currentOrStartingBidLabel = [[ARSerifLabel alloc] init];
    self.currentOrStartingBidLabel.font = serifFont;
    self.currentOrStartingBidLabel.textColor = lightGrey;
    [self.contentView addSubview:self.currentOrStartingBidLabel];

    // Overlay the auctionClosedLabel with the currentbid label (only one of the two will be visible)
    self.auctionClosedLabel = [[ARSerifLabel alloc] init];
    self.auctionClosedLabel.text = @"Auction Closed";
    self.auctionClosedLabel.font = serifFont;
    self.auctionClosedLabel.textColor = darkGrey;
    [self.contentView addSubview:self.auctionClosedLabel];
    [self.auctionClosedLabel alignToView:self.currentOrStartingBidLabel];

    self.numberOfBidsLabel = [[ARSerifLabel alloc] init];
    self.numberOfBidsLabel.font = serifFont;
    self.numberOfBidsLabel.textColor = lightGrey;
    // Note: We are NOT adding this to our view hierarchy, it is subclass-specific.
}

- (void)constrainViewsWithLayoutAttributes:(UICollectionViewLayoutAttributes *)layoutAttributes
{
    // The image view's and separator's layouts are the only one the Regular/Compact subclasses share in common.
    [self.separatorView alignTopEdgeWithView:self.contentView predicate:@"0"];
    [self.separatorView alignLeading:@"0" trailing:@"0" toView:self.contentView];

    [self.artworkImageView constrainWidth:@"140"];
    [self.artworkImageView constrainHeight:@"100"];
    [self.artworkImageView alignTop:@"10@800" bottom:@"-10@800" toView:self.contentView];
    [self.artworkImageView alignLeadingEdgeWithView:self.contentView predicate:@"0"];
}

- (void)applyLayoutAttributes:(UICollectionViewLayoutAttributes *)layoutAttributes
{
    [super applyLayoutAttributes:layoutAttributes];

    if (self.artworkImageView == nil) {
        // Infer that if the artworkImageView is nil, then we need to create the rest of our view hierarchy, too.
        [self createSubviews];
        [self constrainViewsWithLayoutAttributes:layoutAttributes];
    }
}

- (void)setupWithRepresentedObject:(id)object
{
    SaleArtworkViewModel *saleArtworkViewModel = object;

    [self.artworkImageView ar_setImageWithURL:saleArtworkViewModel.thumbnailURL];

    self.artistNameLabel.text = saleArtworkViewModel.artistName;
    self.artworkNameLabel.text = saleArtworkViewModel.artworkName;
    self.numberOfBidsLabel.text = saleArtworkViewModel.numberOfBids;

    if (saleArtworkViewModel.isAuctionOpen) {
        self.auctionClosedLabel.hidden = YES;
        self.currentOrStartingBidLabel.hidden = NO;
        self.numberOfBidsLabel.hidden = NO;
        self.currentOrStartingBidLabel.text = [self currentOrStartingBidLabelTextForSaleArtwork:saleArtworkViewModel];
    } else {
        self.auctionClosedLabel.hidden = NO;
        self.currentOrStartingBidLabel.hidden = YES;
        self.numberOfBidsLabel.hidden = YES;
    }

    if (saleArtworkViewModel.lotLabel.length) {
        self.lotNumberLabel.text = [@"LOT " stringByAppendingString:saleArtworkViewModel.lotLabel];
    }
}

// This is an override point for subclasses
- (NSString *)currentOrStartingBidLabelTextForSaleArtwork:(SaleArtworkViewModel *)saleArtworkViewModel
{
    return [saleArtworkViewModel currentOrStartingBidWithNumberOfBids:NO];
}

@end


@interface ARSaleArtworkFlowCollectionViewRegularCell ()

@property (nonatomic, strong) NSArray *largeConstraintsToUpdate;
@property (nonatomic, strong) NSArray *smallConstraintsToUpdate;

@end


@implementation ARSaleArtworkFlowCollectionViewRegularCell

- (void)constrainViewsWithLayoutAttributes:(UICollectionViewLayoutAttributes *)layoutAttributes
{
    [super constrainViewsWithLayoutAttributes:layoutAttributes];

    // We need a container for the vertical stack of artist/artwork name.
    UIView *artworkLabelsContainer = [UIView new];
    [self.contentView addSubview:artworkLabelsContainer];
    [artworkLabelsContainer addSubview:self.artistNameLabel];
    [artworkLabelsContainer addSubview:self.artworkNameLabel];
    [artworkLabelsContainer constrainWidth:@"250"];

    // Align the artist name to the top, the artowkr name to the bottom, and both to the leading/trailing edges. Then stack them one atop the other.
    [self.artistNameLabel alignTopEdgeWithView:artworkLabelsContainer predicate:@"0"];
    [self.artworkNameLabel alignBottomEdgeWithView:artworkLabelsContainer predicate:@"0"];
    [self.artistNameLabel alignLeading:@"0" trailing:@"0" toView:artworkLabelsContainer];
    [self.artworkNameLabel alignLeading:@"0" trailing:@"0" toView:artworkLabelsContainer];
    [self.artistNameLabel constrainBottomSpaceToView:self.artworkNameLabel predicate:@"0"];

    // We constrain the leading space to the image view, then the trailing space to the lot number label, and store them for later configuration (the predicates here don't matter).
    NSLayoutConstraint *imageConstraint = [artworkLabelsContainer constrainLeadingSpaceToView:self.artworkImageView predicate:@"0"];
    NSLayoutConstraint *lotNumberConstrinat = [self.lotNumberLabel constrainLeadingSpaceToView:artworkLabelsContainer predicate:@"0"];
    self.largeConstraintsToUpdate = @[imageConstraint, lotNumberConstrinat];

    // Number of bids label is Regular cell specific, so: add it, constraint it to the trailing edge, and store the constrain for later configuration (the predicate doesn't matter).
    [self.contentView addSubview:self.numberOfBidsLabel];
    self.smallConstraintsToUpdate = @[[self.numberOfBidsLabel alignAttribute:NSLayoutAttributeTrailing toAttribute:NSLayoutAttributeTrailing ofView:self.contentView predicate:@"-40"]];

    // Center the current bid label's text, give it a low content hugging priority so it'll expand to fill the horizontal space, then constrain leading/trailing space appropriately.
    self.currentOrStartingBidLabel.textAlignment = NSTextAlignmentCenter;
    [self.currentOrStartingBidLabel setContentHuggingPriority:10 forAxis:UILayoutConstraintAxisHorizontal];
    [self.currentOrStartingBidLabel constrainLeadingSpaceToView:self.lotNumberLabel predicate:@"0"];
    [self.currentOrStartingBidLabel constrainTrailingSpaceToView:self.numberOfBidsLabel predicate:@"0"];

    // Centre all necessary views vertically.
    [@[ artworkLabelsContainer, self.lotNumberLabel, self.currentOrStartingBidLabel, self.numberOfBidsLabel ] each:^(id object) {
        [object alignCenterYWithView:self.artworkImageView predicate:@"0"];
    }];

    // Configure mutable constraints based on layout attributes.
    [self updateConstraintConstantsForLayoutAttributes:layoutAttributes];
}

- (void)applyLayoutAttributes:(UICollectionViewLayoutAttributes *)layoutAttributes
{
    [super applyLayoutAttributes:layoutAttributes];
    [self updateConstraintConstantsForLayoutAttributes:layoutAttributes];
}

- (void)updateConstraintConstantsForLayoutAttributes:(UICollectionViewLayoutAttributes *)layoutAttributes
{
    CGFloat largeConstant = layoutAttributes.size.width > 900 ? 80 : 40;
    [self.largeConstraintsToUpdate each:^(NSLayoutConstraint *constraint) {
        constraint.constant = largeConstant;
    }];

    CGFloat smallConstant = layoutAttributes.size.width > 900 ? -40 : -20;
    [self.smallConstraintsToUpdate each:^(NSLayoutConstraint *constraint) {
        constraint.constant = smallConstant;
    }];
}

@end


@implementation ARSaleArtworkFlowCollectionViewCompactCell

- (NSString *)currentOrStartingBidLabelTextForSaleArtwork:(SaleArtworkViewModel *)saleArtworkViewModel
{
    return [saleArtworkViewModel currentOrStartingBidWithNumberOfBids:YES];
}

- (void)constrainViewsWithLayoutAttributes:(UICollectionViewLayoutAttributes *)layoutAttributes
{
    [super constrainViewsWithLayoutAttributes:layoutAttributes];

    NSArray *views = @[ self.lotNumberLabel, self.artistNameLabel, self.artworkNameLabel, self.currentOrStartingBidLabel ];

    UIView *container = [UIView new];
    [self.contentView addSubview:container];

    // Add the views to the container and align them horizontally.
    [views each:^(id object) {
        [container addSubview:object];
        [object alignLeading:@"0" trailing:@"0" toView:container];
    }];

    // Stack the labels on top of eachother.
    [views betweenObjects:^(id lhs, id rhs) {
        [lhs constrainBottomSpaceToView:rhs predicate:@"0"];
    }];

    // Align the labels to the top/bottom of the container
    [views.firstObject alignTopEdgeWithView:container predicate:@"0"];
    [views.lastObject alignBottomEdgeWithView:container predicate:@"0"];

    // Position labels right of the image view
    [container constrainLeadingSpaceToView:self.artworkImageView predicate:@"20"];
    [container alignTrailingEdgeWithView:self.contentView predicate:@"0"];
    [container alignCenterYWithView:self.artworkImageView predicate:@"0"];
}

@end
