#import "ARHeroUnitsNetworkModel.h"
#import "SiteHeroUnit.h"
SpecBegin(ARHeroUnitsNetworkModel)

describe(@"heroes", ^{
    __block ARHeroUnitsNetworkModel *_dataSource;

    beforeEach(^{
        _dataSource = [[ARHeroUnitsNetworkModel alloc] init];
    });

    it(@"only retrieves active hero units", ^{
        waitUntil(^(DoneCallback done) {
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/xapp_token" withResponse:@{ @"xapp_token": @"23123123", @"expires_in": @"2035-01-02T21:42:21-0500" }];
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/site_hero_units"
                                     withParams: @{ @"mobile" : @"true", @"enabled" : @"true" }
                                   withResponse:@[
                                                  @{ @"id": @"past", @"enabled" : @YES, @"display_on_mobile" : @YES, @"start_at" : @"1976-01-27T05:00:00+00:00", @"end_at" : @"1976-01-27T05:00:00+00:00" },
                                                  @{ @"id": @"future", @"enabled" : @YES, @"display_on_mobile" : @YES, @"start_at" : @"2099-01-27T05:00:00+00:00", @"end_at" : @"2099-01-27T05:00:00+00:00" },
                                                  @{ @"id": @"current", @"enabled" : @YES, @"display_on_mobile" : @YES, @"start_at" : @"1976-01-27T05:00:00+00:00", @"end_at" : @"2099-01-27T05:00:00+00:00" }
            ]];

            [_dataSource getHeroUnitsWithSuccess:^(NSArray *heroUnits){
                expect([_dataSource.heroUnits isEqualToArray:heroUnits]).to.beTruthy();
                expect([_dataSource.heroUnits count]).to.equal(1);
                expect([[_dataSource.heroUnits firstObject] siteHeroUnitID]).to.equal(@"current");
                done();
            } failure:nil];
        });
    });
});

SpecEnd
