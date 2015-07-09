#import "ARShowNetworkModel.h"
#import "ArtsyAPI.h"
#import "ArtsyAPI+Shows.h"

SpecBegin(ARShowNetworkModel);

__block PartnerShow *show;
__block Fair *fair;

beforeEach(^{
    show = [PartnerShow modelWithJSON:@{
        @"id" : @"show-id",
        @"partner" : @{ @"id" : @"leila-heller", @"name" : @"Leila Heller" }
    }];
    fair = [Fair modelWithJSON:@{ @"id" : @"fair-id" }];
});

it(@"sets up its properties upon initialization", ^{
    ARShowNetworkModel *model = [[ARShowNetworkModel alloc] initWithFair:fair show:show];
    expect(model.show).to.equal(show);
    expect(model.fair).to.equal(fair);
});

describe(@"network access", ^{
    __block id mockShow;
    __block id mockFair;
    __block id APIMock;
    __block id evalutationCheck;
    
    before(^{
        evalutationCheck = [OCMArg checkWithBlock:^BOOL(void (^success)(PartnerShow *show)) {
            success(mockShow);
            return YES;
        }];
    });
    
    
    beforeEach(^{
        mockShow = [OCMockObject partialMockForObject:show];
        mockFair = [OCMockObject partialMockForObject:fair];
        APIMock = [OCMockObject mockForClass:[ArtsyAPI class]];
    });
    
    afterEach(^{
        [mockShow verify];
        [mockFair verify];
        [APIMock verify], [APIMock stopMocking];
    });
    
    describe(@"with mocked show and fair", ^{
        __block ARShowNetworkModel *model;
        beforeEach(^{
            model = [[ARShowNetworkModel alloc] initWithFair:mockFair show:mockShow];
        });
        
        it(@"gets show info", ^{
            [[[APIMock expect] classMethod] getShowInfo:mockShow success:evalutationCheck failure:OCMOCK_ANY];
            
            __block PartnerShow *returnedShow;
            [model getShowInfo:^(PartnerShow *show) {
                returnedShow = show;
            } failure:nil];
            
            expect(returnedShow).to.equal(mockShow);
        });
        
        it(@"gets fair maps", ^{
            NSArray *maps = @[[OCMockObject mockForClass:[Map class]]];
            
            [[mockFair expect] getFairMaps:[OCMArg checkWithBlock:^BOOL(void (^success)(NSArray *maps)) {
                success(maps);
                return YES;
            }]];
            
            __block NSArray *returnedMaps;
            [model getFairMaps:^(NSArray *maps) {
                returnedMaps = maps;
            }];
            
            expect(returnedMaps).to.equal(maps);
        });
        
        it(@"gets artwork pages", ^{
            NSInteger page = 3;
            NSArray *artworks = @[[OCMockObject mockForClass:[Artwork class]]];
            
            [[[APIMock expect] classMethod] getArtworksForShow:mockShow atPage:page success:[OCMArg checkWithBlock:^BOOL(void (^success)(NSArray *artworks)) {
                success(artworks);
                return YES;
            }] failure:OCMOCK_ANY];
            
            __block NSArray *returnedArtworks;
            [model getArtworksAtPage:page success:^(NSArray *artworks) {
                returnedArtworks = artworks;
            } failure:nil];
            
            expect(returnedArtworks).to.equal(artworks);
        });
    });
    
    describe(@"with mocked show and nil fair", ^{
        __block ARShowNetworkModel *model;
        
        beforeEach(^{
            model = [[ARShowNetworkModel alloc] initWithFair:nil show:mockShow];
        });
        
        it(@"sets fair after getting show info", ^{
            [[[mockShow expect] andReturn:mockFair] fair];
            [[[APIMock expect] classMethod] getShowInfo:mockShow success:evalutationCheck failure:OCMOCK_ANY];
            
            [model getShowInfo:nil failure:nil];
            
            expect(model.fair).to.equal(mockFair);
        });
    });
});

SpecEnd
