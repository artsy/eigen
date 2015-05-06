#import "ARFairMapViewController.h"
#import "ARTiledImageDataSourceWithImage.h"
#import "ARFairShowMapper.h"
#import "ARNavigationController.h"
#import "ARFairSearchViewController.h"
#import "ARTopMenuViewController.h"
#import "ArtsyAPI.h"

@interface ARFairShowMapper ()

- (ARFairMapAnnotationView *)viewForPoint:(CGPoint)point andRepresentedObject:(id)representedObject;

@end

@interface ARFairMapViewController (Testing)

- (void)selectedPartnerShow:(PartnerShow *)partnerShow;
- (void)selectedArtist:(Artist *)artist;

- (void)hideCallOut;
- (void)hideScreenContents;
- (void)tappedOnMap:(UITapGestureRecognizer *)gestureRecogniser;

@property (nonatomic, strong, readonly) ARFairSearchViewController *searchVC;

@end

SpecBegin(ARFairMapViewController)

describe(@"on init", ^{

    __block Fair *fair = nil;
    __block ARFairMapViewController *vc = nil;
    __block id fairMock = nil;

    beforeEach(^{
        fair = [Fair modelWithJSON:@{
            @"name" : @"fair name",
            @"id" : @"fair-id",
        }];

        fair.networkModel = [[ARStubbedFairNetworkModel alloc] init];

        NSArray *maps = @[ [Map modelWithJSON: @{
            @"map_features": @[
            @{
              @"feature_type": @"lounge",
              @"name": @"Public Lounge",
              @"x": @0.8,
              @"y": @0.7
            },
            @{
              @"feature_type": @"bar",
              @"name": @"VIP Bar",
              @"x": @0.8,
              @"y": @0.8
            }],
            @"id": @"map-one",
            @"max_tiled_height": @(1000),
            @"max_tiled_width": @(2000)
        }]];
        
        fairMock = [OCMockObject partialMockForObject:fair];
        [[[fairMock stub] andReturn:maps] maps];

        vc = [[ARFairMapViewController alloc] initWithFair:fairMock];
        [vc ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];
    });

    it(@"sets its fair", ^{
        expect(vc.fair).to.equal(fairMock);
    });
    
    it(@"hides screen contents", ^{
        id mockVC = [OCMockObject partialMockForObject:vc];

        [[mockVC expect] hideCallOut];

        [vc hideScreenContents];
        
        [mockVC verify];
    });
    
    describe(@"fair", ^{
        it(@"sets its fair", ^{
            expect(vc.fair).to.equal(fairMock);
        });
        
        it(@"displays search box", ^{
            expect(vc).to.haveValidSnapshotNamed(@"default");
        });
        
        it(@"maps features", ^{
            expect(vc.fair.maps.count).to.equal(1);
            Map *map = vc.fair.maps.firstObject;
            // updatePosition needs to get a valid relative point
            expect(map.mapID).to.equal(@"map-one");
            // load map
            OCMockObject *mockMapView = [OCMockObject partialMockForObject:vc.mapShowMapper.mapView];
            [[[mockMapView stub] andReturnValue:OCMOCK_VALUE(CGPointZero)] zoomRelativePoint:CGPointZero];
            // fetch an annotation by a position and feature (copy)
            expect([vc.mapShowMapper viewForPoint:CGPointMake(0.8f * 2000, 1000 - 0.7f * 1000) andRepresentedObject:map.features.firstObject]).toNot.beNil();
            [mockMapView stopMocking];
        });
        
        it(@"creates and sets its mapDataSource", ^{
            expect(vc.mapDataSource).to.beKindOf([ARTiledImageDataSourceWithImage class]);
        });
    });
    
    describe(@"fair with selection", ^{
        it(@"adds title", ^{
            vc = [[ARFairMapViewController alloc] initWithFair:fairMock title:@"Selected Artist at Fair" selectedPartnerShows:@[]];
            vc.expandAnnotations = NO;
            [vc ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];

            expect(vc).to.haveValidSnapshot();
        });
        
        it(@"constrains the title correctly in a navigation controller", ^{
            vc = [[ARFairMapViewController alloc] initWithFair:fairMock title:@"Selected Artist at Fair" selectedPartnerShows:@[]];
            vc.expandAnnotations = NO;
            UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:vc];
            [navigationController ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];
            
            expect(vc).to.haveValidSnapshot();
            
        });
        
        pending(@"selects a show");
    });
    
    describe(@"hides on screen contents", ^{
        __block id mockVC;
        __block id apiMock;
        
        beforeEach(^{
            mockVC = [OCMockObject partialMockForObject:vc];
            [[mockVC expect] hideScreenContents];
            
            apiMock = [OCMockObject mockForClass:[ArtsyAPI class]];
        });
        
        afterEach(^{
            [mockVC verify];
            [apiMock stopMocking];
        });
        
        it(@"when showing artists", ^{
            [[apiMock stub] getShowsForArtistID:OCMOCK_ANY inFairID:OCMOCK_ANY success:OCMOCK_ANY failure:OCMOCK_ANY];
            [mockVC selectedArtist:nil];
        });
        
        it(@"when showing partner shows", ^{
            [[apiMock stub] getShowInfo:OCMOCK_ANY success:OCMOCK_ANY failure:OCMOCK_ANY];
            [mockVC selectedPartnerShow:nil];
        });
    });

    describe(@"interactions", ^{
        it(@"hides the callout when tapped", ^{
            id mockVC = [OCMockObject partialMockForObject:vc];
            [[mockVC expect] hideCallOut];

            [vc tappedOnMap:nil];
            [mockVC verify];
        });
    });
    
    describe(@"calls api", ^{
        __block id apiMock;
        
        beforeEach(^{
            apiMock = [OCMockObject mockForClass:[ArtsyAPI class]];
        });
        
        afterEach(^{
            [apiMock verify];
            [apiMock stopMocking];
        });
        
        it(@"when selecting an artist", ^{
            NSString *artistID = @"artist-id";
            
            id mockArtist = [OCMockObject mockForClass:[Artist class]];
            [[[mockArtist stub] andReturn:artistID] artistID];
            
            [[apiMock expect] getShowsForArtistID:[OCMArg checkWithBlock:^BOOL(id obj) {
                return [obj isEqualToString:artistID];
            }] inFairID:[OCMArg checkWithBlock:^BOOL(id obj) {
                return [obj isEqualToString:fair.fairID];
            }] success:OCMOCK_ANY failure:OCMOCK_ANY];
            [vc selectedArtist:mockArtist];
        });
        
        it(@"when selecting a partner show", ^{
            NSString *showId = @"show-id";
            
            id mockPartnerShow = [OCMockObject mockForClass:[PartnerShow class]];
            [[[mockPartnerShow stub] andReturn:showId] showID];
            
            [[apiMock expect] getShowInfo:[OCMArg checkWithBlock:^BOOL(PartnerShow *obj) {
                return [[obj showID] isEqualToString:showId];
            }] success:OCMOCK_ANY failure:OCMOCK_ANY];
            [vc selectedPartnerShow:mockPartnerShow];
        });
    });
    
    describe(@"calling execute on the returned command", ^{
        __block id mockCommand;
        __block id classMock;
        __block id apiMock;
        
        beforeEach(^{
            apiMock = [OCMockObject mockForClass:[ArtsyAPI class]];
            
            mockCommand = [OCMockObject niceMockForClass:[RACCommand class]];
            [[mockCommand expect] execute:[OCMArg isNil]];
            
            id mockNavController = [OCMockObject mockForClass:[ARNavigationController class]];
            [[[mockNavController stub] andReturn:mockCommand] presentPendingOperationLayover];
            
            id mockTopViewController = [OCMockObject mockForClass:[ARTopMenuViewController class]];
            [[[mockTopViewController stub] andReturn:mockNavController] rootNavigationController];
            
            classMock = [OCMockObject mockForClass:[ARTopMenuViewController class]];
            [[[classMock stub] andReturn:mockTopViewController] sharedController];
        });
        
        afterEach(^{
            [mockCommand verify];
            [OHHTTPStubs removeAllStubs];
            [classMock stopMocking];
            [apiMock stopMocking];
        });
        
        describe(@"when selecting an artist", ^{
            it(@"and API succeeds", ^{
                [[apiMock stub] getShowsForArtistID:OCMOCK_ANY inFairID:OCMOCK_ANY success:[OCMArg checkWithBlock:^BOOL(void(^block)(NSArray *)) {
                    if (block) {
                        block(@[]);
                    }
                    return YES;
                }] failure:OCMOCK_ANY];
                
                [vc selectedArtist:nil];
            });
            
            it(@"and API fails", ^{
                [[apiMock stub] getShowsForArtistID:OCMOCK_ANY inFairID:OCMOCK_ANY success:OCMOCK_ANY failure:[OCMArg checkWithBlock:^BOOL(void(^block)(NSArray *)) {
                    if (block) {
                        block(@[]);
                    }
                    return YES;
                }]];
                
                [vc selectedArtist:nil];
            });
        });
        
        describe(@"when selecting a partner show", ^{
            it(@"and API succeeds", ^{
                [[apiMock stub] getShowInfo:OCMOCK_ANY success:[OCMArg checkWithBlock:^BOOL(void(^block)(NSArray *)) {
                    if (block) {
                        block(@[]);
                    }
                    return YES;
                }] failure:OCMOCK_ANY];
                
                [vc selectedPartnerShow:nil];
            });
            
            it(@"and API fails", ^{
                [[apiMock stub] getShowInfo:OCMOCK_ANY success:OCMOCK_ANY failure:[OCMArg checkWithBlock:^BOOL(void(^block)(NSArray *)) {
                    if (block) {
                        block(@[]);
                    }
                    return YES;
                }]];
                
                [vc selectedPartnerShow:nil];
            });
        });
    });
});

SpecEnd
