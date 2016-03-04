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
@property (readwrite, nonatomic, assign) NSInteger currentPage;
@end


SpecBegin(ARWorksForYouViewController);

__block ARWorksForYouViewController *subject;
__block ARStubbedWorksForYouNetworkModel *stubbedNetworkModel;

beforeEach(^{
    subject = [[ARWorksForYouViewController alloc] init];
    stubbedNetworkModel = [[ARStubbedWorksForYouNetworkModel alloc] init];
});

describe(@"visually", ^{
    
    it(@"looks right with one notification", ^{
        stubbedNetworkModel.notificationItems = @[ stubbedNotificationItemWithNumberAndArtworks(0, 2) ];
        subject.worksForYouNetworkModel = stubbedNetworkModel;

        /// This line has to be included for ORStackScrollView to record snapshots properly
        [subject ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        expect(subject).to.haveValidSnapshot();
    });
    
    it(@"looks right with several notifications", ^{
        stubbedNetworkModel.notificationItems = @[ stubbedNotificationItemWithNumberAndArtworks(0, 2), stubbedNotificationItemWithNumberAndArtworks(1, 1) ];
        subject.worksForYouNetworkModel = stubbedNetworkModel;
        
        /// This line has to be included for ORStackScrollView to record snapshots properly
        [subject ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        expect(subject).to.haveValidSnapshot();
    });
});

it(@"marks notifications as read", ^{
    subject.worksForYouNetworkModel = stubbedNetworkModel;
    id networkModelStub = [OCMockObject partialMockForObject:subject.worksForYouNetworkModel];
    
    [[networkModelStub expect] markNotificationsRead];
    [subject beginAppearanceTransition:YES animated:NO];
    [subject endAppearanceTransition];
    [networkModelStub verify];
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
        artwork.artist = artist;
        [artworks addObject:artwork];
    }

    return [[ARWorksForYouNotificationItem alloc] initWithArtist:artist artworks:artworks date:[NSDate dateWithTimeIntervalSince1970:2]];
}


@implementation ARStubbedWorksForYouNetworkModel

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _currentPage = 1;

    return self;
}

- (void)getWorksForYou:(void (^_Nonnull)(NSArray<ARWorksForYouNotificationItem *> *_Nonnull))success failure:(void (^_Nullable)(NSError *_Nullable error))failure
{
    self.allDownloaded = YES;
    self.currentPage++;
    success(self.notificationItems);
}

- (void)markNotificationsRead
{
    // don't actually make the request; do nothing
}

//- (NSInteger)currentPage
//{
//    return self.currentPage;
//}

@end
