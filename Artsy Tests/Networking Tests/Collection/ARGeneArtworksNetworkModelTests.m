#import "Artwork+Extensions.h"
#import "ARGeneArtworksNetworkModel.h"

@interface ARGeneArtworksNetworkModel(Testing)
@property (nonatomic, assign) NSInteger currentPage;
@property (readwrite, nonatomic, assign) BOOL allDownloaded;
@property (readwrite, nonatomic, assign) BOOL downloadLock;
@end

void stubNetworkingForPartialGeneAtPageWithArray(id gene, NSInteger page,  NSArray* content);

SpecBegin(ARGeneArtworknetworkModel)
__block ARGeneArtworksNetworkModel *networkModel;

describe(@"init", ^{
    it(@"sets the gene", ^{
        Gene *gene = [[Gene alloc] initWithGeneID:@"hi"];
        networkModel = [[ARGeneArtworksNetworkModel alloc] initWithGene:gene];
        expect(networkModel.gene).to.equal(gene);
    });
});

describe(@"networking", ^{
    __block id partialGene;

    before(^{
        Gene *gene = [[Gene alloc] initWithGeneID:@"hi"];
        partialGene = [OCMockObject partialMockForObject:gene];
        networkModel = [[ARGeneArtworksNetworkModel alloc] initWithGene:partialGene];
    });

    it(@"does not do networking once completed", ^{
        [[partialGene reject] getArtworksAtPage:0 success:nil];

        networkModel.allDownloaded = YES;
        networkModel.downloadLock = NO;

        [networkModel getNextArtworkPage:nil];
        [partialGene verify];
    });

    it(@"does not do networking if a request is in progress", ^{
        [[partialGene reject] getArtworksAtPage:0 success:nil];

        networkModel.allDownloaded = NO;
        networkModel.downloadLock = YES;

        [networkModel getNextArtworkPage:nil];
        [partialGene verify];
    });

    describe(@"with stubbed networking", ^{
        __block id partialArtworknetworkModel;

        beforeEach(^{
            networkModel = [[ARGeneArtworksNetworkModel alloc] initWithGene:partialGene];
            partialArtworknetworkModel = [OCMockObject partialMockForObject:networkModel];
        });

        it(@"asks the gene for artworks at a page", ^{
            NSArray *artworks = @[ [Artwork stubbedArtwork]];
            stubNetworkingForPartialGeneAtPageWithArray(partialGene, 1, artworks);

            [partialArtworknetworkModel getNextArtworkPage:nil];
            [partialGene verify];
        });

        it(@"adds one to the current page when there is artworks", ^{
            NSArray *artworks = @[ [Artwork stubbedArtwork]];
            NSInteger page = 1;
            stubNetworkingForPartialGeneAtPageWithArray(partialGene, page, artworks);

            [partialArtworknetworkModel getNextArtworkPage:nil];
            expect([partialArtworknetworkModel currentPage]).to.beGreaterThan(page);
        });

        it(@"becomes complete when no new artworks arrive", ^{
            NSArray *artworks = @[];
            stubNetworkingForPartialGeneAtPageWithArray(partialGene, 1, artworks);

            [partialArtworknetworkModel getNextArtworkPage:nil];
            expect([partialArtworknetworkModel allDownloaded]).to.equal(YES);
        });

        it(@"does not say it's complete if artworks arrive", ^{
            NSArray *artworks = @[ [Artwork stubbedArtwork]];
            stubNetworkingForPartialGeneAtPageWithArray(partialGene, 1, artworks);

            [partialArtworknetworkModel getNextArtworkPage:nil];
            expect([partialArtworknetworkModel allDownloaded]).to.equal(NO);
        });
    });
});

SpecEnd

void stubNetworkingForPartialGeneAtPageWithArray(id gene, NSInteger page,  NSArray* content){
    [[[gene stub] andDo:^(NSInvocation *invocation) {
        void (^successBlock)(NSArray *) = nil;
        [invocation getArgument:&successBlock atIndex:3];
        successBlock(content);

    }] getArtworksAtPage:page success:[OCMArg any]];
}
