#import "ARWorksForYouViewController.h"
#import "ARWorksForYouNetworkModel.h"
#import "ARWorksForYouNotificationItem.h"
#import "Artist.h"
#import "Artwork.h"
#import "Artwork+Extensions.h"

ARWorksForYouNotificationItem *stubbedNotificationItemWithNumberAndArtworks(int number, int nArtworks);


@interface ARWorksForYouViewController ()
@property (nonatomic, strong, readwrite) id<ARWorksForYouNetworkModelable> worksForYouNetworkModel;
@end


@interface ARStubbedWorksForYouNetworkModel : NSObject <ARWorksForYouNetworkModelable>
@property (nonatomic, assign) BOOL allDownloaded;
@property (nonatomic, copy, readwrite) NSArray<ARWorksForYouNotificationItem *> *notificationItems;
@end


SpecBegin(ARWorksForYouViewController);

__block ARWorksForYouViewController *subject;

describe(@"visually", ^{
    
    it(@"looks right with one notification", ^{
        subject = [[ARWorksForYouViewController alloc] init];
        ARStubbedWorksForYouNetworkModel *networkModel = [[ARStubbedWorksForYouNetworkModel alloc] init];
        networkModel.notificationItems = @[ stubbedNotificationItemWithNumberAndArtworks(0, 2) ];
        networkModel.allDownloaded = NO;
        subject.worksForYouNetworkModel = networkModel;
        
        /// This line has to be included for ORStackScrollView to record snapshots properly
        [subject ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        expect(subject).to.haveValidSnapshot();
    });
    
    it(@"looks right with several notifications", ^{
        subject = [[ARWorksForYouViewController alloc] init];
        ARStubbedWorksForYouNetworkModel *networkModel = [[ARStubbedWorksForYouNetworkModel alloc] init];
        networkModel.notificationItems = @[ stubbedNotificationItemWithNumberAndArtworks(0, 2), stubbedNotificationItemWithNumberAndArtworks(1, 1) ];
        networkModel.allDownloaded = NO;
        subject.worksForYouNetworkModel = networkModel;
        
        /// This line has to be included for ORStackScrollView to record snapshots properly
        [subject ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        expect(subject).to.haveValidSnapshot();
    });
});


SpecEnd


    ARWorksForYouNotificationItem *
    stubbedNotificationItemWithNumberAndArtworks(int number, int nArtworks)
{
    Artist *artist = [[Artist alloc] initWithDictionary:@{
        @"artistID" : NSStringWithFormat(@"stubbed_%d", number),
        @"name" : NSStringWithFormat(@"Artist %d", number)
    } error:nil];

    NSMutableArray *artworks = [[NSMutableArray alloc] initWithCapacity:nArtworks];
    for (int i = 0; i < nArtworks; i++) {
        Artwork *artwork = [[Artwork alloc] initWithDictionary:@{
            @"artworkID" : @"stubbed",
            @"title" : NSStringWithFormat(@"Artwork %d", i)
        } error:nil];
        [artworks addObject:artwork];
    }

    return [[ARWorksForYouNotificationItem alloc] initWithArtist:artist artworks:artworks date:[NSDate dateWithTimeIntervalSince1970:2]];
}


@implementation ARStubbedWorksForYouNetworkModel

- (void)getWorksForYou:(void (^_Nonnull)(NSArray<ARWorksForYouNotificationItem *> *_Nonnull))success failure:(void (^_Nullable)(NSError *_Nullable error))failure
{
    self.allDownloaded = YES;
    success(self.notificationItems);
}


@end
