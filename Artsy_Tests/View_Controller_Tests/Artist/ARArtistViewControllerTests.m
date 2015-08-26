#import "ARArtistViewController.h"
#import "AREmbeddedModelsViewController.h"
#import "ARSwitchView.h"
#import "ARArtistNetworkModel.h"


@interface ARArtistViewController (Tests)
@property (nonatomic, strong) id<ARArtistNetworkModelable> networkModel;
@property (nonatomic, strong) AREmbeddedModelsViewController *artworkVC;

- (void)checkForAdditionalArtworksToFillView;
- (void)getMoreArtworks;

@end


@interface ARArtistViewController (Private)
@property (nonatomic, strong) ARSwitchView *switchView;
@end

SpecBegin(ARArtistViewController);

__block ARStubbedArtistNetworkModel *networkModel;

itHasSnapshotsForDevicesWithName(@"displays artwork counts", ^{
    
    ARArtistViewController *vc = [[ARArtistViewController alloc] initWithArtistID:@"some-artist"];
    
    networkModel = [[ARStubbedArtistNetworkModel alloc] initWithArtist:vc.artist];
    networkModel.artistForArtistInfo = [Artist modelWithJSON:@{
        @"id": @"some-artist",
        @"name": @"Some Artist",
        @"years": @"1928-1987",
        @"published_artworks_count": @(396),
        @"forsale_artworks_count": @(285),
        @"artworks_count": @(919)
    }];

    networkModel.artworksForArtworksAtPage = @[];
    vc.networkModel = networkModel;
    
    [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
    return vc;
});

itHasSnapshotsForDevicesWithName(@"no artworks", ^{
    ARArtistViewController *vc = [[ARArtistViewController alloc] initWithArtistID:@"some-artist"];
    networkModel = [[ARStubbedArtistNetworkModel alloc] initWithArtist:vc.artist];
    networkModel.artistForArtistInfo = [Artist modelWithJSON:@{
        @"id": @"some-artist",
        @"name": @"Some Artist",
        @"years": @"1928-1987",
        @"published_artworks_count": @(0),
        @"forsale_artworks_count": @(0),
        @"artworks_count": @(0)
    }];

    networkModel.artworksForArtworksAtPage = @[];
    
    vc.networkModel = networkModel;

    [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
    return vc;
});

itHasSnapshotsForDevicesWithName(@"artworks masonry", ^{
    
    ARArtistViewController *vc = [[ARArtistViewController alloc] initWithArtistID:@"some-artist"];
    networkModel = [[ARStubbedArtistNetworkModel alloc] initWithArtist:vc.artist];
    networkModel.artistForArtistInfo = [Artist modelWithJSON:@{
        @"id": @"some-artist",
        @"name": @"Some Artist",
        @"years": @"1928-1987",
        @"published_artworks_count": @(3),
        @"forsale_artworks_count": @(1),
        @"artworks_count": @(0)
    }];

    networkModel.artworksForArtworksAtPage = [Artwork arrayOfModelsWithJSON:@[
        @{ @"id" : @"some-artist-artwork-1", @"availability" : @"for sale" },
        @{ @"id" : @"some-artist-artwork-2", @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-3", @"availability" : @"not for sale" }
    ]];
    
    vc.networkModel = networkModel;
    [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
    return vc;
});

itHasSnapshotsForDevicesWithName(@"two-rows artworks masonry", ^{
    ARArtistViewController *vc = [[ARArtistViewController alloc] initWithArtistID:@"some-artist"];
    networkModel = [[ARStubbedArtistNetworkModel alloc] initWithArtist:vc.artist];
    networkModel.artistForArtistInfo = [Artist modelWithJSON:@{
         @"id": @"some-artist",
         @"name": @"Some Artist",
         @"years": @"1928-1987",
         @"published_artworks_count": @(10),
         @"forsale_artworks_count": @(4),
         @"artworks_count": @(10)
    }];
    
    networkModel.artworksForArtworksAtPage = [Artwork arrayOfModelsWithJSON:@[
        @{ @"id" : @"some-artist-artwork-1", @"availability" : @"for sale" },
        @{ @"id" : @"some-artist-artwork-2", @"availability" : @"for sale" },
        @{ @"id" : @"some-artist-artwork-3", @"availability" : @"for sale" },
        @{ @"id" : @"some-artist-artwork-4", @"availability" : @"for sale" },
        @{ @"id" : @"some-artist-artwork-5", @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-6", @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-7", @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-8", @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-9", @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-10", @"availability" : @"not for sale" },
    ]];
    
    vc.networkModel = networkModel;
    [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
    return vc;
});

itHasSnapshotsForDevicesWithName(@"when showing for sale artworks", ^{
    ARArtistViewController *vc = [[ARArtistViewController alloc] initWithArtistID:@"some-artist"];
    networkModel = [[ARStubbedArtistNetworkModel alloc] initWithArtist:vc.artist];
    networkModel.artistForArtistInfo = [Artist modelWithJSON:@{
         @"id": @"some-artist",
         @"name": @"Some Artist",
         @"years": @"1928-1987",
         @"published_artworks_count": @(14),
         @"forsale_artworks_count": @(4),
         @"artworks_count": @(14)
    }];
    
    networkModel.artworksForArtworksAtPage = [Artwork arrayOfModelsWithJSON:@[
        @{ @"id" : @"some-artist-artwork-1",  @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-2",  @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-3",  @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-4",  @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-5",  @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-6",  @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-7",  @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-8",  @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-9",  @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-10", @"availability" : @"not for sale" },
    ]];
    networkModel.forSaleArtworksForArtworksAtPage = [Artwork arrayOfModelsWithJSON:@[
        @{ @"id" : @"some-artist-artwork-11", @"availability" : @"for sale" },
        @{ @"id" : @"some-artist-artwork-12", @"availability" : @"for sale" },
        @{ @"id" : @"some-artist-artwork-13", @"availability" : @"for sale" },
        @{ @"id" : @"some-artist-artwork-14", @"availability" : @"for sale" },
    ]];
    
    vc.networkModel = networkModel;
    [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
    vc.switchView.selectedIndex = 1; // for sale
    return vc;
});

// itHasAsyncronousSnapshotsForDevices(@"with a bio", ^{
pending(@"with a bio", ^{

    ARArtistViewController *vc = [[ARArtistViewController alloc] initWithArtistID:@"some-artist"];
    networkModel = [[ARStubbedArtistNetworkModel alloc] initWithArtist:vc.artist];
    networkModel.artistForArtistInfo = [Artist modelWithJSON:@{
        @"id": @"some-artist",
        @"name": @"Some Artist",
        @"years": @"1928-1987",
        @"published_artworks_count": @(3),
        @"forsale_artworks_count": @(1),
        @"artworks_count": @(0),
        @"blurb": @"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }];

    networkModel.artworksForArtworksAtPage = [Artwork arrayOfModelsWithJSON:@[
        @{ @"id" : @"some-artist-artwork-1", @"availability" : @"for sale" },
        @{ @"id" : @"some-artist-artwork-2", @"availability" : @"not for sale" },
        @{ @"id" : @"some-artist-artwork-3", @"availability" : @"not for sale" }
    ]];

    vc.networkModel = networkModel;
    [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
    return vc;
});

it(@"tries to load more artworks if the artworks view isn't full", ^{
    id subControllerMock = [OCMockObject mockForClass:[AREmbeddedModelsViewController class]];
    ARArtistViewController *subject = [[ARArtistViewController alloc] init];
    subject.artworkVC = subControllerMock;

    networkModel = [[ARStubbedArtistNetworkModel alloc] initWithArtist:subject.artist];
    subject.networkModel = networkModel;

    id subjectMock = [OCMockObject partialMockForObject:subject];

    BOOL full = NO;
    [[[subControllerMock stub] andReturnValue:OCMOCK_VALUE(full)] currentContentFillsView];
    [[subjectMock expect] getMoreArtworks];

    [subjectMock checkForAdditionalArtworksToFillView];
    [subjectMock verify];
});

it(@"does not try to load more artworks if the artworks view is full", ^{
    id subControllerMock = [OCMockObject mockForClass:[AREmbeddedModelsViewController class]];
    ARArtistViewController *subject = [[ARArtistViewController alloc] init];

    networkModel = [[ARStubbedArtistNetworkModel alloc] initWithArtist:subject.artist];
    subject.networkModel = networkModel;
    
    subject.artworkVC = subControllerMock;
    id subjectMock = [OCMockObject partialMockForObject:subject];

    BOOL full = YES;
    [[[subControllerMock stub] andReturnValue:OCMOCK_VALUE(full)] currentContentFillsView];
    [[subjectMock reject] getMoreArtworks];

    [subjectMock checkForAdditionalArtworksToFillView];
    [subjectMock verify];
});

SpecEnd;
