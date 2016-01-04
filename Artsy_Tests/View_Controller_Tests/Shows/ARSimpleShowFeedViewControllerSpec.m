#import "ARSimpleShowFeedViewController.h"
#import "ARTopTapThroughTableView.h"
#import "ARFeedTimeline.h"
#import "ARShowFeedNetworkStatusModel.h"


@interface ARSimpleShowFeedViewController ()
@property (nonatomic, strong) ARSectionData *section;
@property (nonatomic, strong) ORStackView *headerStackView;
@property (nonatomic, strong) ARFeedTimeline *feedTimeline;
@property (nonatomic, strong) ARShowFeedNetworkStatusModel *networkStatus;
@end

SpecBegin(ARSimpleShowFeedViewController);

__block ARSimpleShowFeedViewController *sut;

describe(@"intial setup", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets" withResponse:@{}];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/shows/feed" withResponse:@{
            @"next" : @"some cursor",
            @"results" : @[ @{ @"id": @"show-id", @"name": @"Show Title", @"_type" : @"PartnerShow" } ]
        }];

        ARFeedTimeline *timeline = [[ARFeedTimeline alloc] initWithFeed:[[ARShowFeed alloc] init]];
        sut = [[ARSimpleShowFeedViewController alloc] initWithFeedTimeline:timeline];
    });


    it(@"uses a ARTopTapThroughTableView so that users can can tap hero units", ^{
        expect([sut classForTableView]).to.equal(ARTopTapThroughTableView.class);
    });

    it(@"looks right when loading", ^{
        expect(sut).to.haveValidSnapshot();
    });

    it(@"looks right when offline", ^{
        [sut ar_presentWithFrame:[UIScreen mainScreen].bounds];
        [sut.networkStatus showOfflineView];
        expect(sut).to.haveValidSnapshot();
    });
});


SpecEnd
