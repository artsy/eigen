#import "ARWorksForYouNotificationView.h"
#import "Artist.h"
#import "Artwork.h"
#import "ARLabelSubclasses.h"
#import "ARFonts.h"

#import <ORStackView/ORSplitStackView.h>


@interface ARWorksForYouNotificationView ()
@property (nonatomic, strong) ARWorksForYouNotificationItem *notificationItem;
@property (nonatomic, strong) AREmbeddedModelsViewController *artworksVC;
@end


@implementation ARWorksForYouNotificationView

- (instancetype)initWithNotificationItem:(ARWorksForYouNotificationItem *)notificationItem artworksViewController:(AREmbeddedModelsViewController *)artworksVC
{
    self = [super init];
    if (!self) return nil;

    _notificationItem = notificationItem;
    _artworksVC = artworksVC;

    return self;
}

- (void)setupSubviews
{
    ARSansSerifLabelWithChevron *artistNameLabel = [[ARSansSerifLabelWithChevron alloc] initWithFrame:CGRectZero];
    artistNameLabel.text = self.notificationItem.artist.name.uppercaseString;
    artistNameLabel.textColor = [UIColor blackColor];
    artistNameLabel.font = [UIFont sansSerifFontWithSize:14];

    UITapGestureRecognizer *recognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(artistNameTapped:)];
    artistNameLabel.userInteractionEnabled = YES;
    [artistNameLabel addGestureRecognizer:recognizer];

    NSDateFormatter *df = [[NSDateFormatter alloc] init];
    [df setDateFormat:@"MMM dd"];

    ARSansSerifLabel *dateLabel = [[ARSansSerifLabel alloc] initWithFrame:CGRectZero];
    dateLabel.text = [df stringFromDate:self.notificationItem.date];
    dateLabel.textColor = [UIColor artsyHeavyGrey];
    dateLabel.textAlignment = NSTextAlignmentRight;
    dateLabel.font = [UIFont sansSerifFontWithSize:10];

    ARSerifLabel *numberOfWorksAddedLabel = [[ARSerifLabel alloc] initWithFrame:CGRectZero];
    numberOfWorksAddedLabel.text = self.notificationItem.formattedNumberOfWorks;
    numberOfWorksAddedLabel.textColor = [UIColor artsyHeavyGrey];
    numberOfWorksAddedLabel.font = [UIFont serifFontWithSize:14];

    ORSplitStackView *ssv = [[ORSplitStackView alloc] initWithLeftPredicate:@"200" rightPredicate:@"100"];
    [ssv.leftStack addSubview:artistNameLabel withTopMargin:@"10" sideMargin:@"0"];
    [ssv.rightStack addSubview:dateLabel withTopMargin:@"10" sideMargin:@"0"];

    [self addSubview:ssv withTopMargin:@"10" sideMargin:@"30"];
    [self addSubview:numberOfWorksAddedLabel withTopMargin:@"10" sideMargin:@"30"];

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
        [self addViewController:self.artworksVC toParent:(id)self.artworksVC.delegate withTopMargin:@"10" sideMargin:@"0"];
    }
}

- (void)artistNameTapped:(UIGestureRecognizer *)recognizer
{
    [self.delegate didSelectArtist:self.notificationItem.artist];
}

@end
