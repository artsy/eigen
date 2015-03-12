#import "ARArtworkThumbnailMetadataView.h"

static CGFloat ARMetadataFontSize;

@interface ARArtworkThumbnailMetadataView ()

@property (nonatomic, strong) ARSerifLabel *primaryLabel;
@property (nonatomic, strong) ARArtworkTitleLabel *secondaryLabel;

@end

@implementation ARArtworkThumbnailMetadataView

+ (void)initialize{
    [super initialize];
    ARMetadataFontSize = [UIDevice isPad] ? 15 : 12;
}

+ (CGFloat)heightForMargin {
    return 8;
}

+ (CGFloat)heightForView {
    return [UIDevice isPad] ? 42 : 34;
}

- (instancetype)init {
    self = [super init];
    if (!self) { return nil; }

    _primaryLabel = [[ARSerifLabel alloc] init];
    _secondaryLabel = [[ARArtworkTitleLabel alloc] init];

    [@[self.primaryLabel, self.secondaryLabel] each:^(UILabel *label) {
        label.font = [label.font fontWithSize:ARMetadataFontSize];
        label.textColor = [UIColor artsyHeavyGrey];
        [self addSubview:label];
    }];

    return self;
}

- (CGSize)intrinsicContentSize
{
    return (CGSize){ UIViewNoIntrinsicMetric, [self.class heightForView] };
}

- (void)layoutSubviews {
    [super layoutSubviews];

    CGRect labelFrame = self.bounds;
    labelFrame.size.height /= 2;

    self.primaryLabel.frame = labelFrame;

    labelFrame.origin.y = labelFrame.size.height;
    self.secondaryLabel.frame = labelFrame;
}

- (void)configureWithArtwork:(Artwork *)artwork {
    self.primaryLabel.text = artwork.artist.name;
    [self.secondaryLabel setTitle:artwork.title date:artwork.date];
}

- (void)resetLabels{
    self.primaryLabel.text = nil;
    [self.secondaryLabel setTitle:nil date:nil];
}

@end
