#import "ARAuctionArtworkTableViewCell.h"

#import "Artist.h"
#import "Artwork.h"
#import "ARFonts.h"
#import "ARCustomEigenLabels.h"
#import "AuctionLot.h"

@interface ARAuctionArtworkTableViewCell ()
@property (nonatomic, weak) UIView *separator;
@end


@implementation ARAuctionArtworkTableViewCell

static const CGFloat ARVerticalMargin = 20;
static const CGFloat ARTextHorizontalMargin = 160;
static const CGFloat ARImageMargin = 20;
static const CGFloat ARImageSize = 60;
static const CGFloat ARTextLineSpacing = 5;

- (void)layoutSubviews
{
    [super layoutSubviews];

    CGFloat yPosition = CGRectGetHeight(self.bounds) - 1;
    self.separator.frame = CGRectMake(ARImageMargin, yPosition, CGRectGetWidth(self.bounds) - (ARImageMargin * 2), 1);
}

- (void)updateWithArtwork:(Artwork *)artwork
{
    [self.contentView.subviews makeObjectsPerformSelector:@selector(removeFromSuperview)];
    [self addImagePreviewWithURL:artwork.urlForThumbnail];
    [self addSeparator];

    NSArray *strings = [self.class _orderedDisplayStringArrayForArtwork:artwork];
    [self addLabelStackWithStrings:strings andTitleAtIndex:1];
}

- (void)updateWithAuctionResult:(AuctionLot *)auctionLot
{
    [self.contentView.subviews makeObjectsPerformSelector:@selector(removeFromSuperview)];

    [self addImagePreviewWithURL:auctionLot.imageURL];
    [self addSeparator];

    NSArray *strings = [self.class _orderedDisplayStringArrayForAuctionLot:auctionLot];
    [self addLabelStackWithStrings:strings andTitleAtIndex:0];
}

#pragma mark adding views

- (void)addLabelStackWithStrings:(NSArray *)strings andTitleAtIndex:(NSInteger)index
{
    CGFloat yOffset = ARVerticalMargin;
    CGFloat xOffset = ARImageMargin + ARImageSize + ARImageMargin;
    CGFloat textWidth = CGRectGetWidth(self.bounds) - ARTextHorizontalMargin;
    CGSize maxSize = (CGSize){textWidth, 600};

    for (NSString *string in strings) {
        Class klass = ([strings indexOfObject:string] == index) ? [ARArtworkTitleLabel class] : [ARSerifLabel class];
        UILabel *label = [[klass alloc] init];

        label.text = string;

        CGSize size = [string ar_sizeWithFont:[UIFont serifFontWithSize:17] constrainedToSize:maxSize];
        label.frame = (CGRect){CGPointMake(xOffset, yOffset), CGSizeMake(textWidth, size.height)};

        [self.contentView addSubview:label];
        yOffset += (size.height + ARTextLineSpacing);
    }
}

- (void)addImagePreviewWithURL:(NSURL *)url
{
    UIImageView *imagePreviewView = [[UIImageView alloc] initWithFrame:CGRectMake(ARImageMargin, ARImageMargin, 60, 60)];
    imagePreviewView.backgroundColor = [UIColor artsyLightGrey];
    [imagePreviewView ar_setImageWithURL:url];
    [self.contentView addSubview:imagePreviewView];
}

- (void)addSeparator
{
    CGFloat height = 2;
    CGFloat yPosition = CGRectGetHeight(self.bounds) - height;
    CGRect frame = CGRectMake(ARImageMargin, yPosition, CGRectGetWidth(self.bounds) - (ARImageMargin * 2), height);
    UIView *separator = [[UIView alloc] initWithFrame:frame];
    separator.backgroundColor = [UIColor artsyLightGrey];
    self.separator = separator;

    [self.contentView addSubview:separator];
}

#pragma mark height

+ (CGFloat)estimatedHeightWithAuctionLot:(AuctionLot *)auctionLot
{
    CGFloat height = 0;
    CGFloat heightPerLine = 20 + ARTextLineSpacing;

    NSUInteger stringCount = [self _orderedDisplayStringArrayForAuctionLot:auctionLot].count;
    height += stringCount * heightPerLine;

    height += ARVerticalMargin * 2;
    return height;
}

+ (CGFloat)heightWithAuctionLot:(AuctionLot *)auctionLot withWidth:(CGFloat)width
{
    NSArray *strings = [self _orderedDisplayStringArrayForAuctionLot:auctionLot];
    return [self _heightWithStringArray:strings withWidth:width];
}

+ (CGFloat)heightWithArtwork:(Artwork *)artwork withWidth:(CGFloat)width
{
    NSArray *strings = [self _orderedDisplayStringArrayForArtwork:artwork];
    return [self _heightWithStringArray:strings withWidth:width];
}

+ (CGFloat)_heightWithStringArray:(NSArray *)strings withWidth:(CGFloat)width
{
    CGFloat height = 0;
    CGSize maxSize = (CGSize){width - ARTextHorizontalMargin, 600};
    UIFont *font = [UIFont serifFontWithSize:17];

    for (NSString *string in strings) {
        height += [string ar_sizeWithFont:font constrainedToSize:maxSize].height;
        height += ARTextLineSpacing;
    }

    height += ARVerticalMargin * 2;
    return height;
}

+ (NSArray *)_orderedDisplayStringArrayForAuctionLot:(AuctionLot *)auctionLot
{
    NSMutableArray *strings = [NSMutableArray array];
    NSString *dimensions = auctionLot.dimensionsInches.length ? auctionLot.dimensionsInches : auctionLot.dimensionsCM;

    if (auctionLot.title.length) [strings addObject:auctionLot.title];
    if (dimensions.length) [strings addObject:dimensions];
    if (auctionLot.organization.length) [strings addObject:auctionLot.organization];
    if (auctionLot.auctionDateText.length) [strings addObject:auctionLot.auctionDateText];
    if (auctionLot.price.length) [strings addObject:auctionLot.price];

    return strings;
}

+ (NSArray *)_orderedDisplayStringArrayForArtwork:(Artwork *)artwork
{
    NSMutableArray *strings = [NSMutableArray array];

    if (artwork.artist.name.length) [strings addObject:artwork.artist.name];
    if (artwork.title.length) [strings addObject:artwork.title];
    if (artwork.dimensionsInches.length) [strings addObject:artwork.dimensionsInches];
    if (artwork.dimensionsCM.length) [strings addObject:artwork.dimensionsCM];
    if (artwork.price.length) [strings addObject:artwork.price];

    return strings;
}

@end
