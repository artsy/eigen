@import Artsy_UILabels;
@import Artsy_UIFonts;
@import Artsy_UIColors;
@import EDColor;
@import FLKAutoLayout;

#import "ARSaleArtworkFlowCollectionViewCell.h"


@interface ARSaleArtworkFlowCollectionViewCell ()

@property (nonatomic, assign) BOOL hasConstrainedSubviews;

@property (nonatomic, strong) UIImageView *artworkImageView;
@property (nonatomic, strong) ARSansSerifLabel *lotNumberLabel;
@property (nonatomic, strong) ARSerifLabel *artistNameLabel;
@property (nonatomic, strong) ARSerifLabel *artworkNameLabel;
@property (nonatomic, strong) ARSerifLabel *estimateLabel;

@end


@implementation ARSaleArtworkFlowCollectionViewCell

- (void)setupWithRepresentedObject:(id)object
{
    if (self.artworkImageView == nil) {
        // Infer that if the artworkImageView is nil, then we need to create the rest of our view hierarchy, too.

        self.artworkImageView = [[UIImageView alloc] init];
        self.artworkImageView.contentMode = UIViewContentModeScaleAspectFill;
        self.artworkImageView.clipsToBounds = YES;
        [self.contentView addSubview:self.artworkImageView];

        self.lotNumberLabel = [[ARSansSerifLabel alloc] init];
        self.lotNumberLabel.font = [UIFont sansSerifFontWithSize:10];
        [self.contentView addSubview:self.lotNumberLabel];

        UIFont *serifFont = [UIFont serifFontWithSize:14];
        UIColor *darkGrey = [UIColor colorWithHex:0x666666];

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

    // TODO: SHouldn't have access to raw models :\
    self.lotNumberLabel.text = [[(SaleArtwork *)object lotNumber] stringValue];

    [self layoutIfNeeded];
}

@end


@implementation ARSaleArtworkFlowCollectionViewRegularCell

- (void)setupWithRepresentedObject:(id)object
{
    [super setupWithRepresentedObject:object];

    if (self.hasConstrainedSubviews == NO) {
        // We need to add the constraints that define our UI.
    }
}

@end


@implementation ARSaleArtworkFlowCollectionViewCompactCell

- (void)setupWithRepresentedObject:(id)object
{
    [super setupWithRepresentedObject:object];

    if (self.hasConstrainedSubviews == NO) {
        // We need to add the constraints that define our UI.

        [self.lotNumberLabel alignToView:self.contentView];
        self.lotNumberLabel.backgroundColor = [UIColor artsyRed];
    }
}

@end
