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

#import "ARSaleArtworkMasonryCollectionViewCell.h"


@interface ARSaleArtworkMasonryCollectionViewCell ()

@property (nonatomic, strong) ARAspectRatioImageView *artworkImageView;
@property (nonatomic, strong) ARSansSerifLabel *lotNumberLabel;
@property (nonatomic, strong) ARSerifLabel *artistNameLabel;
@property (nonatomic, strong) ARSerifLabel *artworkNameLabel;
@property (nonatomic, strong) ARSerifLabel *currentOrStartingBidLabel;

@end


@implementation ARSaleArtworkMasonryCollectionViewCell


- (void)createSubviews
{
    self.backgroundColor = [UIColor artsyPurple];

    self.contentView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.contentView alignToView:self];

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
    self.artworkNameLabel.font = [UIFont serifItalicFontWithSize:serifFont.pointSize];
    self.artworkNameLabel.textColor = darkGrey;
    [self.contentView addSubview:self.artworkNameLabel];

    UIColor *lightGrey = [UIColor colorWithHex:0x999999];

    self.currentOrStartingBidLabel = [[ARSerifLabel alloc] init];
    self.currentOrStartingBidLabel.font = serifFont;
    self.currentOrStartingBidLabel.textColor = lightGrey;
    [self.contentView addSubview:self.currentOrStartingBidLabel];
}

- (void)constrainViewsWithLayoutAttributes:(UICollectionViewLayoutAttributes *)layoutAttributes
{
    //    [self.artworkImageView constrainWidth:@"140"];
    //    [self.artworkImageView constrainHeight:@"100"];
    //    [self.artworkImageView alignTop:@"10@800" bottom:@"-10@800" toView:self.contentView];
    //    [self.artworkImageView alignLeadingEdgeWithView:self.contentView predicate:@"0"];
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
    //    SaleArtworkViewModel *saleArtworkViewModel = object;
    //
    //    [self.artworkImageView ar_setImageWithURL:saleArtworkViewModel.thumbnailURL];
    //
    //    self.artistNameLabel.text = saleArtworkViewModel.artistName;
    //    self.artworkNameLabel.text = saleArtworkViewModel.artworkName;
    //    self.currentOrStartingBidLabel.text = [saleArtworkViewModel currentOrStartingBidWithNumberOfBids:YES];
    //    self.lotNumberLabel.text = saleArtworkViewModel.lotNumber;
}

@end
