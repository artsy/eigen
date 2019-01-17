#import "ARModernPartnerShowTableViewCell.h"
#import "AREmbeddedModelsViewController.h"
#import "ARPartnerShowFeedItem.h"
#import "ARTheme+HeightAdditions.h"
#import "ARArtworkSetViewController.h"
#import "PartnerShow.h"
#import "ARSeparatorViews.h"
#import "AROptions.h"
#import "Partner.h"
#import "ARSwitchBoard+Eigen.h"

#import "NSString+StringSize.h"
#import "UIDevice-Hardware.h"

#import <ORStackView/ORStackView.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

/// The maximum amount of items before switching from Carousel to masonry
static const NSInteger CarouselItemLimit = 4;
static const CGFloat ARPartnerShowCellBottomMargin = 30;
static CGFloat pregeneratedMargins = 0;
static CGFloat ARPartnerShowCellSideMargin;


@interface ARModernPartnerShowTableViewCell () <AREmbeddedModelsViewControllerDelegate>
@property (nonatomic, strong) AREmbeddedModelsViewController *artworkThumbnailsVC;

@property (nonatomic, strong) ORStackView *stackView;
@property (nonatomic, strong) PartnerShow *show;

@property (nonatomic, strong) UILabel *partnerNameLabel;
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UILabel *ausstellungsdauerLabel;
@property (nonatomic, strong) UIView *separatorView;

@end


@implementation ARModernPartnerShowTableViewCell

+ (void)initialize
{
    ARPartnerShowCellSideMargin = [UIDevice isPad] ? 50 : 20;
}

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:UITableViewCellStyleDefault reuseIdentifier:NSStringFromClass(self.class)];
    if (!self) {
        return nil;
    }

    ARTheme *theme = [ARTheme themeNamed:@"ShowFeed"];
    ARThemeLayoutVendor *layout = [theme layout];

    // on iOS7 this is a UITableViewCellScrollView, but on iOS8
    if ([self.contentView.superview isKindOfClass:[UIScrollView class]]) {
        UIScrollView *contentViewSuperview = (UIScrollView *)self.contentView.superview;
        contentViewSuperview.scrollEnabled = NO;
    }

    self.selectionStyle = UITableViewCellSelectionStyleNone;

    _partnerNameLabel = [ARThemedFactory labelForFeedItemHeaders];
    _titleLabel = [ARThemedFactory labelForFeedItemHeaders];
    _ausstellungsdauerLabel = [ARThemedFactory labelForFeedItemSubheadings];
    _ausstellungsdauerLabel.textColor = [UIColor blackColor];

    _artworkThumbnailsVC = [[AREmbeddedModelsViewController alloc] init];
    _artworkThumbnailsVC.delegate = self;
    _separatorView = [[ARSeparatorView alloc] init];

    _stackView = [[ORStackView alloc] init];
    [self addSubview:_stackView];

    // Artworks must have a bottom position to generate a height. bottomMarginHeight constrains the artwork collection
    // view's bottom to the bottom of the stack view. The stack view's bottom is also aligned with the sparator's top,
    // and the separator's bottom has already been aligned to the bottom of the cell view.

    // Subtract one on the bottom because the separatorView's height is 1.
    [_stackView alignToView:self];
    [_stackView addSubview:_partnerNameLabel withTopMargin:layout[@"FeedItemTopMargin"] sideMargin:@(ARPartnerShowCellSideMargin * 2).stringValue];

    [_stackView addSubview:_titleLabel withTopMargin:layout[@"ShowFeedItemShowTitleTopMargin"] sideMargin:@(ARPartnerShowCellSideMargin * 2).stringValue];
    [_stackView addSubview:_ausstellungsdauerLabel withTopMargin:layout[@"ShowFeedItemSubtitleTopMargin"] sideMargin:@(ARPartnerShowCellSideMargin * 2).stringValue];
    [_stackView addSubview:_artworkThumbnailsVC.view withTopMargin:layout[@"ShowFeedItemArtworksTopMargin"] sideMargin:nil];
    [_stackView addSubview:_separatorView withTopMargin:@(ARPartnerShowCellBottomMargin - 1).stringValue sideMargin:@(ARPartnerShowCellSideMargin * 2).stringValue];

    UITapGestureRecognizer *goToPartnerTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(openPartner:)];
    [_partnerNameLabel addGestureRecognizer:goToPartnerTapGesture];
    _partnerNameLabel.userInteractionEnabled = YES;

    UITapGestureRecognizer *goToShowsTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(openShow:)];
    [_titleLabel addGestureRecognizer:goToShowsTapGesture];
    _titleLabel.userInteractionEnabled = YES;

    return self;
}

- (void)prepareForReuse
{
    [super prepareForReuse];

    _titleLabel.text = nil;
    _ausstellungsdauerLabel.text = nil;
    _show = nil;

    [_artworkThumbnailsVC viewWillDisappear:NO];
    [_artworkThumbnailsVC viewDidDisappear:NO];
}

+ (NSString *)subtitleForItem:(ARPartnerShowFeedItem *)feedItem
{
    PartnerShow *item = feedItem.show;
    return item.ausstellungsdauerAndLocation;
}

+ (CGFloat)heightForItem:(ARPartnerShowFeedItem *)feedItem useLandscapeValues:(BOOL)useLandscapeValues
{
    CGFloat height = 0;
    PartnerShow *item = feedItem.show;

    ARTheme *theme = [ARTheme themeNamed:@"ShowFeed"];

    CGSize screenSize = [UIScreen mainScreen].bounds.size;
    CGFloat width = UIInterfaceOrientationIsPortrait([[UIApplication sharedApplication] statusBarOrientation]) ? screenSize.width : screenSize.height;
    width -= (2 * ARPartnerShowCellSideMargin);
    NSString *partnerName = item.partner.name;
    CGSize size = [partnerName ar_sizeWithFont:theme.fonts[@"FeedHeaderTitle"] constrainedToSize:CGSizeMake(width, MAXFLOAT)];
    height += size.height;

    NSString *title = [item.subtitle stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
    size = [title ar_sizeWithFont:theme.fonts[@"FeedHeaderTitle"] constrainedToSize:CGSizeMake(width, MAXFLOAT)];
    height += size.height;

    NSString *subtitleText = [self subtitleForItem:feedItem];
    size = [subtitleText ar_sizeWithFont:theme.fonts[@"FeedHeaderSubtitle"] constrainedToSize:CGSizeMake(width, MAXFLOAT)];
    height += size.height;

    CGFloat artworkHeight = 0;
    BOOL useMasonry = [self shouldUseMultipleRowsForItem:feedItem.show];

    ARArtworkMasonryLayout layout = (useMasonry) ? ARArtworkMasonryLayout2Row : ARArtworkMasonryLayout1Row;
    artworkHeight = [ARArtworkMasonryModule intrinsicHeightForHorizontalLayout:layout useLandscapeValues:useLandscapeValues];
    height += (artworkHeight + ARPartnerShowCellBottomMargin);
    if (pregeneratedMargins == 0) {
        NSArray *verticalMargins = @[
            @"FeedItemTopMargin",
            @"ShowFeedItemShowTitleTopMargin",
            @"ShowFeedItemSubtitleTopMargin",
            @"ShowFeedItemArtworksTopMargin",
        ];

        pregeneratedMargins = [[ARTheme themeNamed:@"ShowFeed"] combinedFloatValueOfLayoutElementsWithKeys:verticalMargins];
    }

    height += pregeneratedMargins;

    return height;
}

+ (BOOL)shouldUseMultipleRowsForItem:(PartnerShow *)item
{
    return (![UIDevice isPad]) && item.artworks.count > CarouselItemLimit;
}

- (void)configureWithFeedItem:(ARPartnerShowFeedItem *)feedItem
{
    PartnerShow *item = feedItem.show;

    self.show = item;
    self.partnerNameLabel.text = item.title;
    self.titleLabel.text = [item.subtitle stringByTrimmingCharactersInSet:
                                              [NSCharacterSet whitespaceAndNewlineCharacterSet]];
    self.ausstellungsdauerLabel.text = [self.class subtitleForItem:feedItem];

    BOOL useMasonry = [[self class] shouldUseMultipleRowsForItem:item];
    if (useMasonry) {
        id module = [ARArtworkMasonryModule masonryModuleWithLayout:ARArtworkMasonryLayout2Row andStyle:[self presentationStyle]];
        self.artworkThumbnailsVC.activeModule = module;

    } else {
        id module = [ARArtworkMasonryModule masonryModuleWithLayout:ARArtworkMasonryLayout1Row andStyle:[self presentationStyle]];
        self.artworkThumbnailsVC.activeModule = module;
    }

    [self.artworkThumbnailsVC appendItems:item.artworks];
}

+ (AREmbeddedArtworkPresentationStyle)presentationStyle
{
    return [UIDevice isPad] ? AREmbeddedArtworkPresentationStyleArtworkMetadata : AREmbeddedArtworkPresentationStyleArtworkOnly;
}

- (AREmbeddedArtworkPresentationStyle)presentationStyle
{
    return [[self class] presentationStyle];
}

- (void)openShow:(UITapGestureRecognizer *)gesture
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadShow:self.show];
    [self.delegate modernPartnerShowTableViewCell:self shouldShowViewController:viewController];
}

- (void)openPartner:(UITapGestureRecognizer *)gesture
{
    [self openShow:gesture];
}

#pragma mark - AREmbeddedModelsViewControllerDelegate

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller shouldPresentViewController:(UIViewController *)viewController
{
    [self.delegate modernPartnerShowTableViewCell:self shouldShowViewController:viewController];
}

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller didTapItemAtIndex:(NSUInteger)index
{
    ARArtworkSetViewController *viewController = [ARSwitchBoard.sharedInstance loadArtworkSet:self.artworkThumbnailsVC.items inFair:nil atIndex:index];
    [self.delegate modernPartnerShowTableViewCell:self shouldShowViewController:viewController];
}

@end
