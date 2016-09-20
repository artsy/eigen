#import "ARFavoritesViewController.h"
#import "ARUserManager+Stubs.h"
#import "AREmbeddedModelsViewController.h"
#import "Artwork+Extensions.h"
#import "ARArtworkFavoritesNetworkModel.h"
#import "ARFavoriteItemModule.h"
#import "ARArtistFavoritesNetworkModel.h"
#import "ARSwitchView.h"
#import "ARSwitchView+Favorites.h"
#import "ARGeneFavoritesNetworkModel.h"
#import "ARSwitchBoard.h"
#import "ARSwitchboard+Eigen.h"


@interface ARFavoritesViewController ()
- (void)getNextItemSet;
- (void)updateView;
@property (nonatomic, strong, readonly) AREmbeddedModelsViewController *embeddedItemsVC;
@property (nonatomic, strong, readonly) ARArtworkMasonryModule *artworksModule;
@property (nonatomic, strong, readonly) ARArtworkFavoritesNetworkModel *artworkFavoritesNetworkModel;
@property (nonatomic, strong, readonly) ARFavoriteItemModule *artistsModule;
@property (nonatomic, strong, readonly) ARArtistFavoritesNetworkModel *artistFavoritesNetworkModel;
@property (nonatomic, strong, readonly) ARFavoriteItemModule *genesModule;
@property (nonatomic, strong, readonly) ARGeneFavoritesNetworkModel *geneFavoritesNetworkModel;
@property (nonatomic, strong, readwrite) ARFavoritesNetworkModel *activeNetworkModel;

@end


@interface ARSwitchView ()
@property (nonatomic, copy, readwrite) NSArray<UIButton *> *buttons;
@end

SpecBegin(ARFavoritesViewController);

__block ARFavoritesViewController *favoritesVC = nil;
__block id mock;
__block ARSwitchView *switchView;

dispatch_block_t sharedBefore = ^{
    favoritesVC = [[ARFavoritesViewController alloc] init];
    mock = [OCMockObject partialMockForObject:favoritesVC];
    [[mock stub] getNextItemSet];
};

after(^{
    [mock stopMocking];
    favoritesVC = nil;
});

describe(@"general", ^{
    before(^{
        sharedBefore();
    });

    it(@"initializes in artwork display mode", ^{
        expect(favoritesVC.view).toNot.beNil();
        [favoritesVC viewWillAppear:NO];

        expect(favoritesVC.displayMode).to.equal(ARFavoritesDisplayModeArtworks);
        expect(favoritesVC.activeNetworkModel).to.equal(favoritesVC.artworkFavoritesNetworkModel);
        expect(favoritesVC.embeddedItemsVC.activeModule).to.beKindOf([ARArtworkMasonryModule class]);
    });

    // TODO: implement this functionality.
    pending(@"resets network models on viewWillAppear", ^{
        expect(favoritesVC.view).toNot.beNil();
        [favoritesVC viewWillAppear:NO];

        switchView = favoritesVC.embeddedItemsVC.headerView.subviews[2];
        [[switchView buttons][ARSwitchViewFavoriteCategoriesIndex] sendActionsForControlEvents:UIControlEventTouchUpInside];

        ARArtworkFavoritesNetworkModel *initialArtworksNetworkModel = favoritesVC.artworkFavoritesNetworkModel;
        ARArtistFavoritesNetworkModel *initialArtistsNetworkModel = favoritesVC.artistFavoritesNetworkModel;
        ARGeneFavoritesNetworkModel *initialGenesNetworkModel = favoritesVC.geneFavoritesNetworkModel;
        ARArtworkMasonryModule *initialArtworksModule = favoritesVC.artworksModule;
        ARFavoriteItemModule *initialArtistsModule = favoritesVC.artistsModule;
        ARFavoriteItemModule *initialGenesModule = favoritesVC.genesModule;

        [favoritesVC viewWillAppear:NO];
        expect(favoritesVC.artworkFavoritesNetworkModel).notTo.equal(initialArtworksNetworkModel);
        expect(favoritesVC.artistFavoritesNetworkModel).notTo.equal(initialArtistsNetworkModel);
        expect(favoritesVC.geneFavoritesNetworkModel).notTo.equal(initialGenesNetworkModel);

        expect(favoritesVC.artworksModule).notTo.equal(initialArtworksModule);
        expect(favoritesVC.artistsModule).notTo.equal(initialArtistsModule);
        expect(favoritesVC.genesModule).notTo.equal(initialGenesModule);
    });
});

describe(@"artworks", ^{

    itHasSnapshotsForDevicesWithName(@"with no artworks", ^{
        sharedBefore();

        id networkModelMock = [OCMockObject niceMockForClass:[ARArtworkFavoritesNetworkModel class]];
        [[[networkModelMock stub] andReturnValue:OCMOCK_VALUE(YES)] allDownloaded];
        [[[mock stub] andReturn:networkModelMock] artworkFavoritesNetworkModel];

        return favoritesVC;
    });

    describe(@"with artworks", ^{
        __block NSMutableArray *artworks;
        dispatch_block_t artworksBefore = ^{
            sharedBefore();
            artworks = [NSMutableArray array];

            for(int i = 0; i < 9; i++) {
                Artwork *artwork  = [[Artwork alloc] initWithDictionary:@{
                    @"artworkID" : @"stubbed",
                    @"title" : NSStringWithFormat(@"Artwork %d", i)
                } error:nil];

                artwork.artist = [[Artist alloc] initWithDictionary:@{
                    @"artistID" :@"stubbed",
                    @"name" : NSStringWithFormat(@"Artist %d", i)
                } error:nil];

                [artworks addObject:artwork];
            }
            [favoritesVC beginAppearanceTransition:YES animated:NO];
            [favoritesVC endAppearanceTransition];

            id moduleMock = [OCMockObject partialMockForObject:favoritesVC.artworksModule];
            [[[moduleMock stub] andReturn:artworks] items];
        };

        itHasSnapshotsForDevicesWithName(@"with artworks", ^{
            artworksBefore();
            return favoritesVC.view;
        });

        it(@"handles tap", ^{
            artworksBefore();
            expect(favoritesVC.view).notTo.beNil();
            id switchboardStub = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
            [[switchboardStub expect] loadArtworkSet:favoritesVC.embeddedItemsVC.items inFair:nil atIndex:2];
            UICollectionView *collectionView = favoritesVC.embeddedItemsVC.collectionView;
            NSIndexPath *indexPath = [NSIndexPath indexPathForRow:2 inSection:0];
            [collectionView.delegate collectionView:collectionView didSelectItemAtIndexPath:indexPath];
            [switchboardStub verify];
        });
    });
});

describe(@"artists", ^{
    dispatch_block_t artistsBefore = ^{
        sharedBefore();
        [favoritesVC beginAppearanceTransition:YES animated:NO];
        [favoritesVC endAppearanceTransition];
        switchView = favoritesVC.embeddedItemsVC.headerView.subviews[2];
    };

    it(@"initializes in artist display mode", ^{
        artistsBefore();
        [[switchView buttons][ARSwitchViewFavoriteArtistsIndex] sendActionsForControlEvents:UIControlEventTouchUpInside];
        expect(favoritesVC.displayMode).to.equal(ARFavoritesDisplayModeArtists);
        expect(favoritesVC.activeNetworkModel).to.equal(favoritesVC.artistFavoritesNetworkModel);
        expect(favoritesVC.embeddedItemsVC.activeModule).to.beKindOf([ARFavoriteItemModule class]);
    });

    itHasSnapshotsForDevicesWithName(@"with no artists", ^{
        artistsBefore();
        id mock = [OCMockObject partialMockForObject:favoritesVC];
        id networkModelMock = [OCMockObject niceMockForClass:[ARArtistFavoritesNetworkModel class]];
        [[[networkModelMock stub] andReturnValue:OCMOCK_VALUE(YES)] allDownloaded];
        [[[mock stub] andReturn:networkModelMock] artistFavoritesNetworkModel];
        [[switchView buttons][ARSwitchViewFavoriteArtistsIndex] sendActionsForControlEvents:UIControlEventTouchUpInside];

        return favoritesVC.view;
    });

    describe(@"with artists", ^{
        __block NSMutableArray *artists;
        dispatch_block_t artistsWithArtistsBefore = ^{
            artistsBefore();
            expect(favoritesVC.view).notTo.beNil();
            switchView = favoritesVC.embeddedItemsVC.headerView.subviews[2];
            artists = [NSMutableArray array];

            for(int i = 0; i< 9; i++) {
                Artist *artist  = [[Artist alloc] initWithDictionary:@{
                    @"artistID" : NSStringWithFormat(@"stubbed_%d", i),
                    @"name" : NSStringWithFormat(@"Artist %d", i)
                } error:nil];
                [artists addObject:artist];
            }
            [[switchView buttons][ARSwitchViewFavoriteArtistsIndex] sendActionsForControlEvents:UIControlEventTouchUpInside];
            id moduleMock = [OCMockObject partialMockForObject:favoritesVC.artistsModule];
            [[[moduleMock stub] andReturn:artists] items];
        };

        itHasSnapshotsForDevicesWithName(@"with artists", ^{
            artistsWithArtistsBefore();
            return favoritesVC.view;
        });

        it(@"handles tap", ^{
            artistsWithArtistsBefore();
            expect(favoritesVC.view).notTo.beNil();
            id switchboardStub = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
            [[switchboardStub expect] loadArtistWithID:@"stubbed_2"];
            UICollectionView *collectionView = favoritesVC.embeddedItemsVC.collectionView;
            NSIndexPath *indexPath = [NSIndexPath indexPathForRow:2 inSection:0];
            [collectionView.delegate collectionView:collectionView didSelectItemAtIndexPath:indexPath];
            [switchboardStub verify];
        });
    });
});

describe(@"genes", ^{
    dispatch_block_t genesBefore = ^{
        sharedBefore();
        [favoritesVC beginAppearanceTransition:YES animated:NO];
        [favoritesVC endAppearanceTransition];
        switchView = favoritesVC.embeddedItemsVC.headerView.subviews[2];
    };

    it(@"initializes in gene display mode", ^{
        genesBefore();
        [[switchView buttons][ARSwitchViewFavoriteCategoriesIndex] sendActionsForControlEvents:UIControlEventTouchUpInside];
        expect(favoritesVC.displayMode).to.equal(ARFavoritesDisplayModeGenes);
        expect(favoritesVC.activeNetworkModel).to.equal(favoritesVC.geneFavoritesNetworkModel);
        expect(favoritesVC.embeddedItemsVC.activeModule).to.beKindOf([ARFavoriteItemModule class]);
    });

    itHasSnapshotsForDevicesWithName(@"with no genes", ^{
        genesBefore();
        id mock = [OCMockObject partialMockForObject:favoritesVC];
        id networkModelMock = [OCMockObject niceMockForClass:[ARGeneFavoritesNetworkModel class]];
        [[[networkModelMock stub] andReturnValue:OCMOCK_VALUE(YES)] allDownloaded];
        [[[mock stub] andReturn:networkModelMock] geneFavoritesNetworkModel];
        [[switchView buttons][ARSwitchViewFavoriteCategoriesIndex] sendActionsForControlEvents:UIControlEventTouchUpInside];

        return favoritesVC.view;
    });

    describe(@"with genes", ^{
        __block NSMutableArray *genes;

        dispatch_block_t genesWithGenesBefore = ^{
            genesBefore();
            [favoritesVC beginAppearanceTransition:YES animated:NO];
            [favoritesVC endAppearanceTransition];
            switchView = favoritesVC.embeddedItemsVC.headerView.subviews[2];
            genes = [NSMutableArray array];
            for(int i = 0; i< 9; i++) {
                Gene *gene  = [[Gene alloc] initWithDictionary:@{
                    @"geneID" : @"stubbed",
                    @"name" : NSStringWithFormat(@"Gene %d", i)
                } error:nil];
                [genes addObject:gene];
            }
            id moduleMock = [OCMockObject partialMockForObject:favoritesVC.genesModule];
            [[[moduleMock stub] andReturn:genes] items];
            [[switchView buttons][ARSwitchViewFavoriteCategoriesIndex] sendActionsForControlEvents:UIControlEventTouchUpInside];
        };

        itHasSnapshotsForDevicesWithName(@"with genes", ^{
            genesWithGenesBefore();
            return favoritesVC.view;
        });

        it(@"handles tap", ^{
            genesWithGenesBefore();
            expect(favoritesVC.view).notTo.beNil();
            id switchboardStub = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
            [[switchboardStub expect] loadGene:favoritesVC.embeddedItemsVC.items[2]];
            UICollectionView *collectionView = favoritesVC.embeddedItemsVC.collectionView;
            NSIndexPath *indexPath = [NSIndexPath indexPathForRow:2 inSection:0];
            [collectionView.delegate collectionView:collectionView didSelectItemAtIndexPath:indexPath];
            [switchboardStub verify];
        });
    });
});

SpecEnd;
