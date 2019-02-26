#import "ARShowNetworkModel.h"
#import "ArtsyAPI.h"
#import "ArtsyAPI+Shows.h"
#import "ARNetworkConstants.h"

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

__block ARShowNetworkModel *model;
__block BOOL success = NO;

describe(@"network access", ^{

    describe(@"with a show and fair", ^{

        beforeEach(^{
            model = [[ARShowNetworkModel alloc] initWithFair:fair show:show];
            success = NO;
        });
        
        it(@"gets show info", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/show/show-id" withResponse:@{ @"id" : @"newshow-id" }];

            [model getShowInfo:^(PartnerShow *show) {
                success = [show.showID isEqualToString:@"newshow-id"];
            } failure:nil];

            expect(success).to.beTruthy();
        });
        
      
        
        it(@"gets artwork pages", ^{
            NSDictionary *params = @{ @"page" : @(3), @"published" : @YES, @"size" : @10 };
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/partner/leila-heller/show/show-id/artworks" withParams:params withResponse:@[@{}, @{}]];

            NSInteger page = 3;
            [model getArtworksAtPage:page success:^(NSArray *artworks) {
                success = artworks.count == 2;
            } failure:nil];

            expect(success).to.beTruthy();
        });
    });
    
    describe(@"with a show and no fair", ^{
        it(@"sets fair after getting show info", ^{
            NSDictionary *showJSON = @{ @"id" : @"newshow-id", @"fair": @{} };
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/show/show-id" withResponse:showJSON];

            model = [[ARShowNetworkModel alloc] initWithFair:nil show:show];
            [model getShowInfo:nil failure:nil];
            
            expect(model.fair).to.beTruthy();
        });
    });
});

SpecEnd;
