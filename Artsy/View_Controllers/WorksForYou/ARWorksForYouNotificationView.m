#import "ARWorksForYouNotificationView.h"
#import "Artist.h"
#import "Artwork.h"
#import "UIColor+DebugColours.h"

#import <ORStackView/ORStackView.h>
#import <ORStackView/ORSplitStackView.h>

#import "ARLabelSubclasses.h"
#import "ARFonts.h"


@interface ARWorksForYouNotificationView ()
@property (nonatomic, strong) ARWorksForYouNotificationItem *notificationItem;
@end


@implementation ARWorksForYouNotificationView

- (instancetype)initWithNotificationItem:(ARWorksForYouNotificationItem *)notificationItem artworksViewController:(AREmbeddedModelsViewController *)artworksVC
{
    self = [super init];
    if (!self) return nil;

    _notificationItem = notificationItem;

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
    dateLabel.textColor = [UIColor lightGrayColor];
    dateLabel.textAlignment = NSTextAlignmentRight;
    dateLabel.font = [UIFont sansSerifFontWithSize:10];

    ARSerifLabel *numberOfWorksAddedLabel = [[ARSerifLabel alloc] initWithFrame:CGRectZero];
    numberOfWorksAddedLabel.text = self.notificationItem.formattedNumberOfWorks;
    numberOfWorksAddedLabel.textColor = [UIColor lightGrayColor];
    numberOfWorksAddedLabel.font = [UIFont serifFontWithSize:14];

    ORSplitStackView *ssv = [[ORSplitStackView alloc] initWithLeftPredicate:@"200" rightPredicate:@"100"];
    [ssv.leftStack addSubview:artistNameLabel withTopMargin:@"10" sideMargin:@"0"];
    [ssv.rightStack addSubview:dateLabel withTopMargin:@"10" sideMargin:@"0"];

    [self addSubview:ssv withTopMargin:@"10" sideMargin:@"30"];
    [self addSubview:numberOfWorksAddedLabel withTopMargin:@"10" sideMargin:@"30"];

    if (artworksVC) {
        [artworksVC setConstrainHeightAutomatically:YES];

        if (self.notificationItem.artworks.count > 1) {
            artworksVC.activeModule = [ARArtworkMasonryModule masonryModuleWithLayout:ARArtworkMasonryLayout2Column andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
        } else if (self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassRegular) {
            artworksVC.activeModule = [ARArtworkMasonryModule masonryModuleWithLayout:ARArtworkMasonryLayout3Column andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
        } else {
            artworksVC.activeModule = [ARArtworkMasonryModule masonryModuleWithLayout:ARArtworkMasonryLayout1Column andStyle:AREmbeddedArtworkPresentationStyleArtworkMetadata];
        }

        [artworksVC appendItems:self.notificationItem.artworks];
        [self addViewController:artworksVC toParent:(id)artworksVC.delegate withTopMargin:@"10" sideMargin:@"0"];
    }

    return self;
}

- (void)artistNameTapped:(UIGestureRecognizer *)recognizer
{
    [self.delegate didSelectArtist:self.notificationItem.artist];
}

@end
