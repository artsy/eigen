#import "ARFairSearchViewController.h"
#import <ORStackView/ORStackScrollView.h>
#import "SearchResult.h"

@interface Fair()
@property (nonatomic, strong) NSMutableSet *shows;
@end

SpecBegin(ARFairSearchViewController);

describe(@"init", ^{

    __block ARFairSearchViewController *fairSearchVC = nil;
    __block Fair *fair = nil;

    beforeEach(^{
        id json = @{ @"id" : @"fair-id", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } };
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id" withResponse:json];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id/shows" withResponse:@{}];
        fair = [Fair modelWithJSON:json];
        fairSearchVC = [[ARFairSearchViewController alloc] initWithFair:fair];
        [fairSearchVC viewDidLoad];
    });
    
    describe(@"searchPartners", ^{
        it(@"partner name prefix", ^{
            id fairMock = [OCMockObject partialMockForObject:fair];
            PartnerShow *partnerShow = [PartnerShow modelWithJSON:@{@"id" : @"show-id", @"name" : @"", @"partner" : @{ @"id" : @"leila-heller", @"name" : @"Leila Heller" }}];
            NSMutableSet *shows = [NSMutableSet setWithObject:partnerShow];
            [[[fairMock stub] andReturn:shows] shows];
            expect([fairSearchVC searchPartners:@"Leila Heller"].count).to.equal(1);
            expect([fairSearchVC searchPartners:@"Heller"].count).to.equal(1);
            expect([fairSearchVC searchPartners:@"Invalid"].count).to.equal(0);
        });
        
        it(@"case insensitive", ^{
            id fairMock = [OCMockObject partialMockForObject:fair];
            PartnerShow *partnerShow = [PartnerShow modelWithJSON:@{@"id" : @"show-id", @"name" : @"", @"partner" : @{ @"id" : @"leila-heller", @"name" : @"Leila Heller" }}];
            NSMutableSet *shows = [NSMutableSet setWithObject:partnerShow];
            [[[fairMock stub] andReturn:shows] shows];
            expect([fairSearchVC searchPartners:@"leila heller"].count).to.equal(1);
            expect([fairSearchVC searchPartners:@"leila"].count).to.equal(1);
            expect([fairSearchVC searchPartners:@"heller"].count).to.equal(1);
            expect([fairSearchVC searchPartners:@"invalid"].count).to.equal(0);
        });

        it(@"uses short name", ^{
            id fairMock = [OCMockObject partialMockForObject:fair];
            PartnerShow *partnerShow = [PartnerShow modelWithJSON:@{@"id" : @"show-id", @"name" : @"", @"partner" : @{ @"id" : @"leila-heller", @"name" : @"Leila", @"short_name" : @"Heller" }}];
            NSMutableSet *shows = [NSMutableSet setWithObject:partnerShow];
            [[[fairMock stub] andReturn:shows] shows];
            expect([fairSearchVC searchPartners:@"leila heller"].count).to.equal(0);
            expect([fairSearchVC searchPartners:@"leila"].count).to.equal(1);
            expect([fairSearchVC searchPartners:@"heller"].count).to.equal(1);
        });
    });

    // FIXME When running this file in isolation this test passes. When ran together with the rest of the test suite
    //       only the local fair show shows up, not the results from the request. It seems like it’s a timing issue,
    //       but not sure how to best fix it.
    //
//    it(@"with local fair shows - combines results from local and remote search ignoring remote shows", ^{
//        id mock = [OCMockObject partialMockForObject:fairSearchVC];
//        
//        // stub local search results
//        NSArray *localResults = [NSArray arrayWithObject:[SearchResult modelWithJSON:@{
//                                                                                       @"id" : @"leila-heller-gallery-show",
//                                                                                       @"display" : @"Leila Heller Gallery",
//                                                                                       @"model" : @"partnershow",
//                                                                                       @"label" : @"leila-heller",
//                                                                                       @"published" : @YES
//                                                                                       }]];
//        
//        [[[mock stub] andReturn:localResults] searchPartners:@"Leila"];
//
//        // stub remote results
//        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/match"
//                                 withParams:@{ @"term" : @"Leila", @"fair_id" : @"fair-id" }
//                               withResponse:@[
//        @{
//            @"model" : @"artist",
//            @"id" : @"leila-pazooki",
//            @"display": @"Leila Pazooki",
//            @"label": @"Artist",
//            @"published": @YES,
//            }, @{
//            @"model": @"partnershow",
//            @"id": @"leila-heller-gallery-leila-heller-gallery-at-the-armory-show-2014",
//            @"display": @"Leila Heller Gallery at The Armory Show 2014",
//            @"published": @YES
//        }] andStatusCode:200];
//        
//        fair.shows = [NSMutableSet set];
//        [fairSearchVC fetchSearchResults:@"Leila"];
//
//        // the results are a combination of the local Leila Heller and the remote Leila Pazooki
//        expect(fairSearchVC.searchResults.count).will.equal(2);
//        expect(fairSearchVC.searchResults.firstObject).to.beKindOf([SearchResult class]);
//        SearchResult *result = (id) fairSearchVC.searchResults.firstObject;
//        expect(result.modelID).to.equal(@"leila-heller-gallery-show");
//    });

    it(@"without local fair shows - combines results from local and remote search", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/match/suggest"
                                 withParams:@{ @"term" : @"Leila", @"fair_id" : @"fair-id" }
                               withResponse:@[
          @{
              @"model" : @"artist",
              @"id" : @"leila-pazooki",
              @"_id" : @"5074b70927ef8d0002000141",
              @"display": @"Leila Pazooki",
              @"label": @"Artist",
              @"published": @YES,
              }, @{
              @"model": @"partnershow",
              @"id": @"leila-heller-gallery-leila-heller-gallery-at-the-armory-show-2014",
              @"display": @"Leila Heller Gallery at The Armory Show 2014",
              @"published": @YES
          }] andStatusCode:200];

        [fairSearchVC fetchSearchResults:@"Leila"];

        expect(fairSearchVC.searchResults.count).will.equal(2);
        expect(fairSearchVC.searchResults.firstObject).to.beKindOf([SearchResult class]);
        SearchResult *result = (id) fairSearchVC.searchResults.firstObject;
        expect(result.modelID).to.equal(@"leila-pazooki");
    });
});

SpecEnd;
