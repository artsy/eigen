#import "ARAuctionArtworkResultsViewController.h"
#import "ARAuctionResultsNetworkModel.h"
#import "Artwork+Extensions.h"


@interface ARAuctionArtworkResultsViewController (Private)
@property (nonatomic, strong) NSObject<AuctionResultsNetworkModel> *network;
@end


@interface StubbedAuctionNetworkModel : NSObject <AuctionResultsNetworkModel>
@property (nonatomic, strong, readonly) Artwork *artwork;
@property (nonatomic, strong) NSArray<AuctionLot *> *results;
@end


@implementation StubbedAuctionNetworkModel

- (instancetype)initWithArtwork:(Artwork *)artwork { return [super init]; }
- (void)getRelatedAuctionResults:(void (^)(NSArray<AuctionLot *> *auctionResults))success;
{
    success(self.results);
}

@end

SpecBegin(ARAuctionArtworkResultsViewController);

__block ARAuctionArtworkResultsViewController *sut;

it(@"shows a loading screen", ^{
    Artwork *artwork = [Artwork stubbedArtwork];
    sut = [[ARAuctionArtworkResultsViewController alloc] initWithArtwork:artwork];
    StubbedAuctionNetworkModel *network = [[StubbedAuctionNetworkModel alloc] init];
    network.results = @[];
    sut.network = network;
    expect(sut).to.haveValidSnapshot();
});

itHasSnapshotsForDevicesWithName(@"default", ^{
    Artwork *artwork = [Artwork stubbedArtwork];
    sut = [[ARAuctionArtworkResultsViewController alloc] initWithArtwork:artwork];

    StubbedAuctionNetworkModel *network = [[StubbedAuctionNetworkModel alloc] init];
    AuctionLot *lot1 = [AuctionLot modelWithJSON:@{
       @"id": @"id",
       @"title": @"Lot 1",
       @"dimensions": @{ @"cm": @"1 cm", @"in": @"2 inches"},
       @"organization" : @"Organization",
       @"auction_date_text" : @"Auctioned at some time",
       @"price": @"Price"
    }];
    network.results = @[lot1];
    sut.network = network;
    return sut;
});

SpecEnd
