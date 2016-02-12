@import Artsy_UILabels;
@import Artsy_UIFonts;
@import Artsy_UIColors;
@import EDColor;
@import SDWebImage;
@import FLKAutoLayout;

#import "SaleArtwork.h"
#import "Artwork.h"
#import "Image.h"

#import "ARSeparatorViews.h"

#import "ARSaleArtworkFlowCollectionViewCell.h"


@interface ARSaleArtworkFlowCollectionViewCell ()

@property (nonatomic, assign) BOOL hasConstrainedSubviews;

@property (nonatomic, strong) ARSeparatorView *separatorView;
@property (nonatomic, strong) UIImageView *artworkImageView;
@property (nonatomic, strong) ARSansSerifLabel *lotNumberLabel;
@property (nonatomic, strong) ARSerifLabel *artistNameLabel;
@property (nonatomic, strong) ARSerifLabel *artworkNameLabel;
@property (nonatomic, strong) ARSerifLabel *estimateLabel;

@end


@implementation ARSaleArtworkFlowCollectionViewCell

- (void)createSubviews
{
    self.separatorView = [[ARSeparatorView alloc] init];
    [self.contentView addSubview:self.separatorView];

    self.artworkImageView = [[UIImageView alloc] init];
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

    self.estimateLabel = [[ARSerifLabel alloc] init];
    self.estimateLabel.font = serifFont;
    self.estimateLabel.textColor = [UIColor colorWithHex:0x999999];
    [self.contentView addSubview:self.estimateLabel];
}

- (void)constrainViews
{
    // The image view's and separator's layouts are the only one the Regular/Compact subclasses share in common.
    [self.separatorView alignTopEdgeWithView:self.contentView predicate:@"0"];
    [self.separatorView alignLeading:@"0" trailing:@"0" toView:self.contentView];

    [self.artworkImageView constrainWidth:@"140"];
    [self.artworkImageView alignTop:@"10" bottom:@"-10" toView:self.contentView];
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
    SaleArtwork *saleArtwork = object;
    [self.artworkImageView sd_setImageWithURL:saleArtwork.artwork.defaultImage.urlForThumbnailImage];

    // TODO: Shouldn't have access to raw models :\
    self.lotNumberLabel.text = saleArtwork.lotNumber.stringValue;
}

@end


@implementation ARSaleArtworkFlowCollectionViewRegularCell

- (void)constrainViews
{
    [super constrainViews];
    // TODO: iPad layout.
}

@end


@implementation ARSaleArtworkFlowCollectionViewCompactCell

- (void)constrainViews
{
    [super constrainViews];
    // TODO: iPhone layout.
}

@end
