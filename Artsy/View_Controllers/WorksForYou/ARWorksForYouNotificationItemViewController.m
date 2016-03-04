#import "ARWorksForYouNotificationItemViewController.h"
#import "Artist.h"
#import "Artwork.h"
#import "ARLabelSubclasses.h"
#import "ARFonts.h"
#import "ARSwitchboard+Eigen.h"
#import "ARArtworkSetViewController.h"
#import "ARArtistViewController.h"

#import <ORStackView/ORSplitStackView.h>


@interface ARWorksForYouNotificationItemViewController () <AREmbeddedModelsViewControllerDelegate>
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
    _artworksVC = [[AREmbeddedModelsViewController alloc] init];
    _artworksVC.delegate = self;

    return self;
}

- (void)loadView
{
    self.view = [[ORStackView alloc] init];
}

- (void)viewDidLoad
{
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
    numberOfWorksAddedLabel.font = [UIFont serifFontWithSize:14];
    [self addArtistTapRecognizerToView:numberOfWorksAddedLabel];

    ORSplitStackView *ssv = [[ORSplitStackView alloc] initWithLeftPredicate:@"200" rightPredicate:@"100"];
    [ssv.leftStack addSubview:artistNameLabel withTopMargin:@"10" sideMargin:@"0"];
    [ssv.rightStack addSubview:dateLabel withTopMargin:@"10" sideMargin:@"0"];

    [self.view addSubview:ssv withTopMargin:@"10" sideMargin:@"30"];
    [self.view addSubview:numberOfWorksAddedLabel withTopMargin:@"10" sideMargin:@"30"];

    if (self.artworksVC) {
        [self.artworksVC setConstrainHeightAutomatically:YES];

        if (self.notificationItem.artworks.count > 1) {
            self.artworksVC.activeModule = [ARArtworkMasonryModule masonryModuleWithLayout:ARArtworkMasonryLayout2Column andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
        } else if (self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassRegular) {
            self.artworksVC.activeModule = [ARArtworkMasonryModule masonryModuleWithLayout:ARArtworkMasonryLayout3Column andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
        } else {
            self.artworksVC.activeModule = [ARArtworkMasonryModule masonryModuleWithLayout:ARArtworkMasonryLayout1Column andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
        }

        [self.artworksVC appendItems:self.notificationItem.artworks];
        [self.view addViewController:self.artworksVC toParent:self withTopMargin:@"10" sideMargin:@"0"];
    }

    [super viewDidLoad];
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


@end
