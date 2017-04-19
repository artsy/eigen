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
// TODO: Should this be a ARArtworkTitleLabel? ( should it show a date? )
@property (nonatomic, strong) ARSerifLabel *artworkNameLabel;
@property (nonatomic, strong) ARSerifLabel *currentOrStartingBidLabel;

@end


@implementation ARSaleArtworkMasonryCollectionViewCell

+ (UIFont *)serifFont { return [UIFont serifFontWithSize:12]; }
+ (UIFont *)italicsSerifFont { return [UIFont serifItalicFontWithSize:12]; }

- (void)createSubviews
{
    self.contentView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.contentView alignToView:self];

    self.artworkImageView = [[ARAspectRatioImageView alloc] init];
    self.artworkImageView.contentMode = UIViewContentModeScaleAspectFit;
    self.artworkImageView.clipsToBounds = YES;
    [self.contentView addSubview:self.artworkImageView];

    UIColor *darkGrey = [UIColor artsyGraySemibold];

    self.lotNumberLabel = [[ARSansSerifLabel alloc] init];
    self.lotNumberLabel.font = [UIFont sansSerifFontWithSize:10];
    self.lotNumberLabel.textColor = darkGrey;
    [self.contentView addSubview:self.lotNumberLabel];

    UIFont *serifFont = [[self class] serifFont];

    self.artistNameLabel = [[ARSerifLabel alloc] init];
    self.artistNameLabel.font = serifFont;
    self.artistNameLabel.textColor = darkGrey;
    [self.contentView addSubview:self.artistNameLabel];

    self.artworkNameLabel = [[ARSerifLabel alloc] init];
    self.artworkNameLabel.font = serifFont;
    self.artworkNameLabel.textColor = darkGrey;
    [self.contentView addSubview:self.artworkNameLabel];

    // TODO: Replace with Artsy standard colour.
    UIColor *lightGrey = [UIColor colorWithHex:0x999999];

    self.currentOrStartingBidLabel = [[ARSerifLabel alloc] init];
    self.currentOrStartingBidLabel.font = serifFont;
    self.currentOrStartingBidLabel.textColor = lightGrey;
    [self.contentView addSubview:self.currentOrStartingBidLabel];
}

- (void)constrainViewsWithLayoutAttributes:(UICollectionViewLayoutAttributes *)layoutAttributes
{
    [self.artworkImageView alignTopEdgeWithView:self.contentView predicate:@"0"];
    [self.artworkImageView alignLeading:@"0" trailing:@"0" toView:self.contentView];
    [self.artworkImageView alignBottomEdgeWithView:self.contentView predicate:@(-[ARSaleArtworkMasonryCollectionViewCell paddingForMetadata]).stringValue];

    NSArray *labels = @[ self.lotNumberLabel, self.artistNameLabel, self.artworkNameLabel, self.currentOrStartingBidLabel ];

    [labels each:^(id object) {
        [object setNumberOfLines:1];
    }];

    // Stick the first label under the image view, plus ten points.
    [[labels firstObject] alignAttribute:NSLayoutAttributeTop toAttribute:NSLayoutAttributeBottom ofView:self.artworkImageView predicate:@"8"];

    // Stack the labels on top of eachother.
    [labels betweenObjects:^(id lhs, id rhs) {
        [lhs alignAttribute:NSLayoutAttributeBottom toAttribute:NSLayoutAttributeTop ofView:rhs predicate:@"-2"];
    }];

    [labels each:^(id object) {
        [object alignLeading:@"0" trailing:@"0" toView:self.contentView];
    }];
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
    self.artworkNameLabel.attributedText = [saleArtworkViewModel attributedArtworkNameWithNormalFont:[[self class] serifFont] italicFont:[[self class] italicsSerifFont]];
    self.currentOrStartingBidLabel.text = [saleArtworkViewModel currentOrStartingBidWithNumberOfBids:YES];
    if (saleArtworkViewModel.lotLabel.length) {
        self.lotNumberLabel.text = [@"LOT " stringByAppendingString:saleArtworkViewModel.lotLabel];
    }
}

+ (CGFloat)paddingForMetadata
{
    // 3 labels @14pt + 1 label @10pt + 2 * 3 label padding + 15pt padding under image = 73
    return 73;
}

@end
