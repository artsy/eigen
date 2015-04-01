#import "ARArtistViewController.h"
#import "ARStubbedArtistNetworkModel.h"

@interface ARArtistViewController (Tests)
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@property (nonatomic, strong) ARArtistNetworkModel *networkModel;
@end

SpecBegin(ARArtistViewController)

__block ARStubbedArtistNetworkModel *networkModel;

itHasSnapshotsForDevices(@"displays artwork counts", ^{
    
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

itHasSnapshotsForDevices(@"no artworks", ^{
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

itHasSnapshotsForDevices(@"artworks masonry", ^{
    
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

itHasSnapshotsForDevices(@"two-rows artworks masonry", ^{
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

itHasAsyncronousSnapshotsForDevices(@"with a bio", ^{

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

SpecEnd
