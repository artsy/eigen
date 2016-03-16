#import "ARWorksForYouNotificationItemViewController.h"
#import "Artist.h"
#import "Artwork.h"
#import "ARLabelSubclasses.h"
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
    dateLabel.textColor = [UIColor artsyHeavyGrey];
    dateLabel.textAlignment = NSTextAlignmentRight;
    dateLabel.font = [UIFont sansSerifFontWithSize:12];

    ARSerifLabel *numberOfWorksAddedLabel = [[ARSerifLabel alloc] initWithFrame:CGRectZero];
    numberOfWorksAddedLabel.text = self.notificationItem.formattedNumberOfWorks;
    numberOfWorksAddedLabel.textColor = [UIColor artsyHeavyGrey];
    numberOfWorksAddedLabel.font = [UIFont serifFontWithSize:16];
    [self addArtistTapRecognizerToView:numberOfWorksAddedLabel];

    ORSplitStackView *ssv = [[ORSplitStackView alloc] initWithLeftPredicate:@"200" rightPredicate:@"100"];
    [ssv.leftStack addSubview:artistNameLabel withTopMargin:@"10" sideMargin:@"0"];
    [ssv.rightStack addSubview:dateLabel withTopMargin:@"10" sideMargin:@"0"];

    NSString *labelSideMargin = (self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassRegular) ? @"75" : @"30";
    [self.view addSubview:ssv withTopMargin:@"10" sideMargin:labelSideMargin];
    [self.view addSubview:numberOfWorksAddedLabel withTopMargin:@"7" sideMargin:labelSideMargin];

    if (self.notificationItem.artworks.count == 1) {
        ARArtworkWithMetadataThumbnailCell *singleCell = [[ARArtworkWithMetadataThumbnailCell alloc] init];
        singleCell.imageSize = ARFeedItemImageSizeLarge;
        [singleCell setupWithRepresentedObject:self.notificationItem.artworks.firstObject];
        NSString *maxHeight = [NSString stringWithFormat:@"%f", [UIScreen mainScreen].bounds.size.height - 200];

        [singleCell constrainHeight:maxHeight];

        [singleCell addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(singleArtworkTapped:)]];

        [self.view addSubview:singleCell withTopMargin:@"7" sideMargin:@"75"];

    } else {
        self.artworksVC = self.artworksVC ?: [[AREmbeddedModelsViewController alloc] init];
        self.artworksVC.delegate = self;

        self.artworksVC.constrainHeightAutomatically = YES;

        ARArtworkMasonryModule *module = [ARArtworkMasonryModule masonryModuleWithLayout:[self masonryLayoutForSize:self.view.frame.size] andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
        module.layoutProvider = self;
        self.artworksVC.activeModule = module;
        [self.artworksVC appendItems:self.notificationItem.artworks];
        [self.view addViewController:self.artworksVC toParent:self withTopMargin:@"0" sideMargin:@"0"];
        // this tells the embedded artworks view controller that it should update for the correct size because self.view.frame.size at this point is (0, 0)
        [self.artworksVC didMoveToParentViewController:self.parentViewController];
    }
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

#pragma mark - ARArtworkMasonryLayoutProvider
- (ARArtworkMasonryLayout)masonryLayoutForSize:(CGSize)size
{
    if (self.artworksVC.items.count > 1) {
        return self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassRegular && self.artworksVC.items.count >= 3 ? ARArtworkMasonryLayout3Column : ARArtworkMasonryLayout2Column;

    } else {
        return ARArtworkMasonryLayout1Column;
    }
}

@end
