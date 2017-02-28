#import "ARWorksForYouNotificationItemViewController.h"
#import "Artist.h"
#import "Artwork.h"
@import Artsy_UILabels;
#import "ARFonts.h"
#import "ARSwitchboard+Eigen.h"
#import "ARArtworkSetViewController.h"
#import "ARArtistViewController.h"
#import "UIDevice-Hardware.h"
#import "ARArtworkMasonryModule.h"
#import "ARArtworkWithMetadataThumbnailCell.h"
#import "ARArtworkThumbnailMetadataView.h"

#import <ORStackView/ORSplitStackView.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARWorksForYouNotificationItemViewController () <AREmbeddedModelsViewControllerDelegate, ARArtworkMasonryLayoutProvider>
@property (nonatomic, strong) ARWorksForYouNotificationItem *notificationItem;
@property (nonatomic, strong) AREmbeddedModelsViewController *artworksVC;
@property (nonatomic, strong) ARArtworkWithMetadataThumbnailCell *singleArtworkView;
@property (nonatomic, strong) ORStackView *view;
@end


@implementation ARWorksForYouNotificationItemViewController

@dynamic view;

- (instancetype)initWithNotificationItem:(ARWorksForYouNotificationItem *)notificationItem
{
    self = [super init];
    if (!self) return nil;

    _notificationItem = notificationItem;

    return self;
}

- (void)loadView
{
    self.view = [[ORStackView alloc] init];
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    ARSansSerifLabelWithChevron *artistNameLabel = [[ARSansSerifLabelWithChevron alloc] initWithFrame:CGRectZero];
    artistNameLabel.text = self.notificationItem.artist.name.uppercaseString;
    artistNameLabel.textColor = [UIColor blackColor];
    artistNameLabel.font = [UIFont sansSerifFontWithSize:14];
    [self addArtistTapRecognizerToView:artistNameLabel];

    NSDateFormatter *df = [[NSDateFormatter alloc] init];
    [df setDateFormat:@"MMM dd"];

    ARSansSerifLabel *dateLabel = [[ARSansSerifLabel alloc] initWithFrame:CGRectZero];
    dateLabel.text = [df stringFromDate:self.notificationItem.date];
    dateLabel.textColor = [UIColor artsyGraySemibold];
    dateLabel.textAlignment = NSTextAlignmentRight;
    dateLabel.font = [UIFont sansSerifFontWithSize:12];

    ARSerifLabel *numberOfWorksAddedLabel = [[ARSerifLabel alloc] initWithFrame:CGRectZero];
    numberOfWorksAddedLabel.text = self.notificationItem.formattedNumberOfWorks;
    numberOfWorksAddedLabel.textColor = [UIColor artsyGraySemibold];
    numberOfWorksAddedLabel.font = [UIFont serifFontWithSize:16];
    [self addArtistTapRecognizerToView:numberOfWorksAddedLabel];

    UIView *wrapper = [[UIView alloc] init];
    NSString *labelSideMargin = (self.regularHorizontalSizeClass) ? @"65" : @"30";
    [self.view addSubview:wrapper withTopMargin:self.regularHorizontalSizeClass ? @"15" : @"15" sideMargin:labelSideMargin];

    [wrapper addSubview:artistNameLabel];
    [wrapper addSubview:dateLabel];

    [artistNameLabel alignLeadingEdgeWithView:wrapper predicate:@"0"];
    [artistNameLabel constrainTrailingSpaceToView:dateLabel predicate:@"-20"];
    [artistNameLabel setContentCompressionResistancePriority:UILayoutPriorityDefaultLow forAxis:UILayoutConstraintAxisHorizontal];
    [artistNameLabel alignCenterYWithView:wrapper predicate:@"0"];

    [dateLabel alignTrailingEdgeWithView:wrapper predicate:@"0"];
    [dateLabel alignCenterYWithView:wrapper predicate:@"0"];
    [dateLabel setContentCompressionResistancePriority:UILayoutPriorityDefaultHigh forAxis:UILayoutConstraintAxisHorizontal];
    [dateLabel setContentHuggingPriority:UILayoutPriorityDefaultHigh forAxis:UILayoutConstraintAxisHorizontal];

    [wrapper constrainHeightToView:artistNameLabel predicate:@"0"];
    [self.view addSubview:numberOfWorksAddedLabel withTopMargin:@"7" sideMargin:labelSideMargin];

    if (self.regularHorizontalSizeClass || self.notificationItem.artworks.count > 1) {
        self.artworksVC = self.artworksVC ?: [[AREmbeddedModelsViewController alloc] init];
        self.artworksVC.delegate = self;

        self.artworksVC.constrainHeightAutomatically = YES;

        ARArtworkMasonryModule *module = [ARArtworkMasonryModule masonryModuleWithLayout:[self masonryLayoutForSize:self.view.frame.size] andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
        module.layoutProvider = self;
        self.artworksVC.activeModule = module;
        [self.artworksVC appendItems:self.notificationItem.artworks];
        [self.view addViewController:self.artworksVC toParent:self withTopMargin:@"0" sideMargin:@"0"];
    } else {
        self.singleArtworkView = self.singleArtworkView ?: [[ARArtworkWithMetadataThumbnailCell alloc] init];
        self.singleArtworkView.imageSize = ARFeedItemImageSizeLarge;
        self.singleArtworkView.imageViewContentMode = UIViewContentModeScaleAspectFit;
        [self.singleArtworkView setupWithRepresentedObject:self.notificationItem.artworks.firstObject];

        [self.singleArtworkView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(singleArtworkTapped:)]];

        [self.view addSubview:self.singleArtworkView withTopMargin:@"10" sideMargin:@"30"];
    }
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    [self didMoveToParentViewController:self.parentViewController];
}

- (void)didMoveToParentViewController:(UIViewController *)parent
{
    [super didMoveToParentViewController:parent];

    if (self.artworksVC) {
        // this tells the embedded artworks view controller that it should update for the correct size because self.view.frame.size at this point is (0, 0)
        [self.artworksVC didMoveToParentViewController:parent];
    } else if (self.singleArtworkView) {
        [self updateSingleArtistViewSizeForParent:parent];
    }
}

- (void)updateSingleArtistViewSizeForParent:(UIViewController *)parent
{
    Artwork *artwork = self.notificationItem.artworks.firstObject;

    BOOL isPad = self.regularHorizontalSizeClass;

    CGFloat maxHeight = parent.view.frame.size.height;
    CGFloat sideMargins = isPad ? 150 : 60;
    CGFloat width = parent.view.frame.size.width - sideMargins;

    // height of artist and number of works labels with padding
    CGFloat heightOfLabels = 100;

    // height of thumbnail cell = image height + metadata + padding
    CGFloat viewHeight = width / artwork.aspectRatio + [ARArtworkWithMetadataThumbnailCell heightForMetadataWithArtwork:artwork] + 50;

    // height of entire notification item = thumbnail cell + artist & number of works labels
    CGFloat totalHeightOfNotificationItem = viewHeight + heightOfLabels;

    // shrink the view if it exceeds the height of the screen
    if (totalHeightOfNotificationItem > maxHeight) viewHeight = maxHeight - heightOfLabels;

    [self.singleArtworkView constrainHeight:[NSString stringWithFormat:@"%f", viewHeight]];
}

- (void)addArtistTapRecognizerToView:(UIView *)view
{
    UITapGestureRecognizer *recognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(artistNameTapped:)];
    view.userInteractionEnabled = YES;
    [view addGestureRecognizer:recognizer];
}

- (void)artistNameTapped:(UIGestureRecognizer *)recognizer
{
    [self didSelectArtist:self.notificationItem.artist animated:YES];
}

- (void)singleArtworkTapped:(UIGestureRecognizer *)recognizer
{
    [self didSelectArtwork:self.notificationItem.artworks.firstObject animated:YES];
}

#pragma mark - AREmbeddedViewController delegate methods

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller shouldPresentViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:YES];
}

- (void)embeddedModelsViewController:(AREmbeddedModelsViewController *)controller didTapItemAtIndex:(NSUInteger)index
{
    ARArtworkSetViewController *viewController = [ARSwitchBoard.sharedInstance loadArtworkSet:controller.items inFair:nil atIndex:index];
    [self.navigationController pushViewController:viewController animated:YES];
}

- (void)didSelectArtist:(Artist *)artist animated:(BOOL)animated
{
    ARArtistViewController *artistVC = [ARSwitchBoard.sharedInstance loadArtistWithID:artist.artistID];
    [self.navigationController pushViewController:artistVC animated:animated];
}

- (void)didSelectArtwork:(Artwork *)artwork animated:(BOOL)animated
{
    ARArtworkSetViewController *viewController = [ARSwitchBoard.sharedInstance loadArtwork:artwork inFair:nil];
    [self.navigationController pushViewController:viewController animated:YES];
}

- (BOOL)regularHorizontalSizeClass
{
    return self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassRegular;
}

#pragma mark - ARArtworkMasonryLayoutProvider

- (ARArtworkMasonryLayout)masonryLayoutForSize:(CGSize)size
{
    if (self.regularHorizontalSizeClass) {
        return ARArtworkMasonryLayout3Column;
    } else {
        return ARArtworkMasonryLayout2Column;
    }
}

@end
