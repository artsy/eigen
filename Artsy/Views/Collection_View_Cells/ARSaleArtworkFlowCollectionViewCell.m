@import Artsy_UILabels;
@import Artsy_UIFonts;
@import Artsy_UIColors;
@import EDColor;
@import SDWebImage;
@import FLKAutoLayout;
@import ObjectiveSugar;

#import "SaleArtwork.h"
#import "Artwork.h"
#import "Artist.h"
#import "Image.h"
#import "NSArray+Additions.h"
#import "ARAspectRatioImageView.h"

#import "ARSeparatorViews.h"

#import "ARSaleArtworkFlowCollectionViewCell.h"


@interface ARSaleArtworkFlowCollectionViewCell ()

@property (nonatomic, assign) BOOL hasConstrainedSubviews;

@property (nonatomic, strong) ARSeparatorView *separatorView;
@property (nonatomic, strong) ARAspectRatioImageView *artworkImageView;
@property (nonatomic, strong) ARSansSerifLabel *lotNumberLabel;
@property (nonatomic, strong) ARSerifLabel *artistNameLabel;
@property (nonatomic, strong) ARSerifLabel *artworkNameLabel;
@property (nonatomic, strong) ARSerifLabel *estimateLabel;
@property (nonatomic, strong) ARSerifLabel *numberOfBidsLabel;

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

    UIColor *darkGrey = [UIColor colorWithHex:0x666666];

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
    self.artworkNameLabel.font = serifFont;
    self.artworkNameLabel.textColor = darkGrey;
    [self.contentView addSubview:self.artworkNameLabel];

    UIColor *lightGrey = [UIColor colorWithHex:0x999999];

    self.estimateLabel = [[ARSerifLabel alloc] init];
    self.estimateLabel.font = serifFont;
    self.estimateLabel.textColor = lightGrey;
    [self.contentView addSubview:self.estimateLabel];

    self.numberOfBidsLabel = [[ARSerifLabel alloc] init];
    self.numberOfBidsLabel.font = serifFont;
    self.numberOfBidsLabel.textColor = lightGrey;
    // Note: We are NOT adding this to our view hierarchy, it is subclass-specific.
}

- (void)constrainViews
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
        [self constrainViews];
    }
}

- (void)setupWithRepresentedObject:(id)object
{
    // TODO: Shouldn't have access to raw models
    SaleArtwork *saleArtwork = object;

    [self.artworkImageView sd_setImageWithURL:saleArtwork.artwork.defaultImage.urlForThumbnailImage];

    self.artistNameLabel.text = saleArtwork.artwork.artist.name;
    self.artworkNameLabel.text = saleArtwork.artwork.name;
    self.estimateLabel.text = saleArtwork.highestOrStartingBidString;
    self.lotNumberLabel.text = saleArtwork.lotNumber.stringValue;
    self.numberOfBidsLabel.text = saleArtwork.numberOfBidsString;
}

@end


@implementation ARSaleArtworkFlowCollectionViewRegularCell

- (void)constrainViews
{
    [super constrainViews];

    UIView *container = [UIView new];
    [self.contentView addSubview:container];

    NSArray *views = @[ self.lotNumberLabel, self.artistNameLabel, self.artworkNameLabel, self.estimateLabel, self.numberOfBidsLabel ];

    // Vertically centre everything.
    [views each:^(id object) {
        [container addSubview:object];
        [object alignCenterYWithView:container predicate:@"0"];
    }];

    // Align the labels to the top/bottom of the container
    [views.firstObject alignLeadingEdgeWithView:container predicate:@"0"];
    [views.lastObject alignTrailingEdgeWithView:container predicate:@"0"];

    // Spread everything within the container out.
    [UIView spaceOutViewsHorizontally:views predicate:@"100@1"];

    [container alignTrailingEdgeWithView:self.contentView predicate:@"-20"];
    [container constrainLeadingSpaceToView:self.artworkImageView predicate:@"40"];
    [container alignTop:@"0" bottom:@"0" toView:self.contentView];
}

@end


@implementation ARSaleArtworkFlowCollectionViewCompactCell

- (void)constrainViews
{
    [super constrainViews];

    NSArray *views = @[ self.lotNumberLabel, self.artistNameLabel, self.artworkNameLabel, self.estimateLabel ];

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
