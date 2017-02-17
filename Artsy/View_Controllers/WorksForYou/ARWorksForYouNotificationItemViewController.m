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
#import "UIImageView+AsyncImageLoading.h"


@interface ARWorksForYouNotificationItemViewController () <AREmbeddedModelsViewControllerDelegate, ARArtworkMasonryLayoutProvider>
@property (nonatomic, strong) ARWorksForYouNotificationItem *notificationItem;
@property (nonatomic, strong) AREmbeddedModelsViewController *artworksVC;
@property (nonatomic, strong) ARArtworkWithMetadataThumbnailCell *singleArtworkView;
@property (nonatomic, strong) ORStackView *view;
@property (nonatomic, strong) UIImageView *artistAvatar;
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

    // includes artist avatar, artist name, notification date, and number of works added
    UIView *metadataWrapper = [[UIView alloc] init];
    NSString *topMargin = self.regularHorizontalSizeClass ? @"25" : @"15";
    NSString *sideMargin = self.regularHorizontalSizeClass ? @"20" : @"30";
    [self addArtistTapRecognizerToView:metadataWrapper];
    [self.view addSubview:metadataWrapper withTopMargin:topMargin sideMargin:sideMargin];

    self.artistAvatar = [[UIImageView alloc] initWithFrame:CGRectZero];
    [self.artistAvatar ar_setImageWithURL:self.notificationItem.artist.squareImageURL];
    [self.artistAvatar constrainWidth:@"40" height:@"40"];
    [metadataWrapper addSubview:self.artistAvatar];

    UIView *labelWrapper = [[UIView alloc] init];

    ARSansSerifLabel *artistNameLabel = [[ARSansSerifLabel alloc] initWithFrame:CGRectZero];
    artistNameLabel.text = self.notificationItem.artist.name.uppercaseString;
    artistNameLabel.textColor = [UIColor blackColor];
    artistNameLabel.font = [UIFont sansSerifFontWithSize:14];

    NSDateFormatter *df = [[NSDateFormatter alloc] init];
    [df setDateFormat:@"MMM dd"];

    NSString *date = [df stringFromDate:self.notificationItem.date];
    NSString *formattedDate = [@"・" stringByAppendingString:date];

    ARSerifLabel *numberOfWorksAddedLabel = [[ARSerifLabel alloc] initWithFrame:CGRectZero];
    numberOfWorksAddedLabel.text = [self.notificationItem.formattedNumberOfWorks stringByAppendingString:formattedDate];
    numberOfWorksAddedLabel.textColor = [UIColor artsyGraySemibold];
    numberOfWorksAddedLabel.font = [UIFont serifFontWithSize:16];

    [labelWrapper addSubview:artistNameLabel];
    [labelWrapper addSubview:numberOfWorksAddedLabel];
    [metadataWrapper addSubview:labelWrapper];

    [self.artistAvatar alignLeadingEdgeWithView:metadataWrapper predicate:@"0"];
    [self.artistAvatar alignCenterYWithView:metadataWrapper predicate:@"0"];

    [artistNameLabel alignLeadingEdgeWithView:labelWrapper predicate:@"0"];
    [artistNameLabel setContentCompressionResistancePriority:UILayoutPriorityDefaultLow forAxis:UILayoutConstraintAxisHorizontal];
    [artistNameLabel alignTopEdgeWithView:labelWrapper predicate:@"0"];
    [numberOfWorksAddedLabel alignLeadingEdgeWithView:labelWrapper predicate:@"0"];
    [numberOfWorksAddedLabel setContentCompressionResistancePriority:UILayoutPriorityDefaultLow forAxis:UILayoutConstraintAxisHorizontal];
    [numberOfWorksAddedLabel constrainTopSpaceToView:artistNameLabel predicate:@"5"];

    [labelWrapper constrainLeadingSpaceToView:self.artistAvatar predicate:@"10"];
    [labelWrapper alignTopEdgeWithView:metadataWrapper predicate:@"0"];

    [metadataWrapper constrainHeightToView:self.artistAvatar predicate:@"0"];

    if (self.notificationItem.artworks.count == 1) {
        self.singleArtworkView = self.singleArtworkView ?: [[ARArtworkWithMetadataThumbnailCell alloc] init];
        self.singleArtworkView.imageSize = ARFeedItemImageSizeLarge;
        self.singleArtworkView.imageViewContentMode = UIViewContentModeScaleAspectFit;
        [self.singleArtworkView setupWithRepresentedObject:self.notificationItem.artworks.firstObject];

        [self.singleArtworkView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(singleArtworkTapped:)]];

        [self.view addSubview:self.singleArtworkView withTopMargin:@"20" sideMargin:(self.regularHorizontalSizeClass) ? @"75" : @"30"];

    } else {
        self.artworksVC = self.artworksVC ?: [[AREmbeddedModelsViewController alloc] init];
        self.artworksVC.delegate = self;

        self.artworksVC.constrainHeightAutomatically = YES;

        ARArtworkMasonryModule *module = [ARArtworkMasonryModule masonryModuleWithLayout:[self masonryLayoutForSize:self.view.frame.size] andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
        module.layoutProvider = self;
        self.artworksVC.activeModule = module;
        [self.artworksVC appendItems:self.notificationItem.artworks];
        [self.view addViewController:self.artworksVC toParent:self withTopMargin:@"0" sideMargin:@"0"];
    }
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    [self didMoveToParentViewController:self.parentViewController];
}

- (void)viewDidLayoutSubviews
{
    [super viewDidLayoutSubviews];

    self.artistAvatar.layer.cornerRadius = 20;
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

    CGFloat maxHeight = parent.view.frame.size.height;
    CGFloat sideMargins = 60;
    CGFloat width = parent.view.frame.size.width - sideMargins;

    // height of artist and number of works labels with padding
    CGFloat heightOfLabels = 80;

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

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];

    [coordinator animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> context) {
        if (self.singleArtworkView) {
            [self updateSingleArtistViewSizeForParent:self.parentViewController];
        }
    } completion:nil];
}

- (BOOL)regularHorizontalSizeClass
{
    return self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassRegular;
}

#pragma mark - ARArtworkMasonryLayoutProvider

- (ARArtworkMasonryLayout)masonryLayoutForSize:(CGSize)size
{
    if (self.regularHorizontalSizeClass && self.artworksVC.items.count >= 3) {
        return ARArtworkMasonryLayout3Column;
    } else {
        return ARArtworkMasonryLayout2Column;
    }
}

@end
