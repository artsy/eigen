#import "ARAppSearchViewController.h"
#import "ARTopMenuViewController.h"


@interface ARAppSearchViewController (Testing)
- (void)clearTapped:(id)sender;
- (void)closeSearch:(id)sender;
@end


SpecBegin(ARAppSearchViewController);

__block ARAppSearchViewController *sut;

dispatch_block_t sharedBefore = ^{
    sut = [[ARAppSearchViewController alloc] init];
    [sut ar_presentWithFrame:[UIScreen mainScreen].bounds];

    [sut beginAppearanceTransition:YES animated:NO];
    [sut endAppearanceTransition];
    [sut.view setNeedsLayout];
    [sut.view layoutIfNeeded];
};

itHasSnapshotsForDevicesWithName(@"looks correct", ^{
    sharedBefore();
    return sut;
});

context(@"searching", ^{
    context(@"with results", ^{


        itHasSnapshotsForDevicesWithName(@"displays search results", ^{

            sharedBefore();

            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/match" withResponse:@[
                @{
                    @"model": @"artist",
                    @"id": @"aes-plus-f",
                    @"display": @"AES+F",
                    @"label": @"Artist",
                    @"score": @"excellent",
                    @"search_detail": @"Russian, Founded 1987",
                    @"published": @(YES),
                    @"imageURL" : @"http://api.artsy.net/api/v1/artist/aes-plus-f/image",
                    @"highlights": @[]
                    },
                @{
                    @"model": @"artist",
                    @"id": @"john-f-carlson",
                    @"display": @"John F. Carlson",
                    @"label": @"Artist",
                    @"score": @"excellent",
                    @"search_detail": @"Swedish-American, 1875-1947",
                    @"published": @(YES),
                    @"imageURL" : @"http://api.artsy.net/api/v1/artist/john-f-carlson/image",
                    @"highlights": @[]
                    },
                @{
                    @"model": @"artist",
                    @"id": @"f-scott-hess",
                    @"display": @"F. Scott Hess",
                    @"label": @"Artist",
                    @"score": @"excellent",
                    @"search_detail": @"American, born 1955",
                    @"published": @(YES),
                    @"imageURL" : @"http://api.artsy.net/api/v1/artist/f-scott-hess/image",
                    @"highlights": @[]
                }]
             ];
            
            sut.textField.text = @"f";
            [sut.textField sendActionsForControlEvents:UIControlEventEditingChanged];

            expect(sut.searchResults.count).will.equal(3);

            return sut;
        });
    });

    context(@"with no results", ^{
        itHasAsyncronousSnapshotsForDevicesWithName(@"displays zero state", ^{

            sharedBefore();
            sut.searchDataSource.searchResults = [NSOrderedSet orderedSetWithObjects:[SearchResult modelWithJSON:@{
                @"model": @"artist",
                @"id": @"f-scott-hess",
                @"display": @"F. Scott Hess",
                @"label": @"Artist",
                @"score": @"excellent",
                @"search_detail": @"American, born 1955",
                @"published": @(YES),
                @"imageURL" : @"http://api.artsy.net.com",
                @"highlights": @[]
            }], nil];
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/match" withResponse:@[]];
            
            sut.textField.text = @"f";
            [sut.textField sendActionsForControlEvents:UIControlEventEditingChanged];
            
            expect(sut.searchResults.count).will.equal(0);
            return sut;
        });
    });
});

it(@"clears search", ^{
    // custom clear button for dark color scheme
    sut = [[ARAppSearchViewController alloc] init];
    [sut ar_presentWithFrame:[UIScreen mainScreen].bounds];
    sut.textField.text = @"s";
    [sut clearTapped:nil];
    expect(sut.textField.text).to.equal(@"");
    expect(sut.searchDataSource.searchResults.count).to.equal(0);
});

it(@"closes search", ^{
    sut = [[ARAppSearchViewController alloc] init];
    UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:sut];
    OCMockObject *navigationControllerMock = [OCMockObject partialMockForObject:navigationController];
    [sut ar_presentWithFrame:[UIScreen mainScreen].bounds];
    [[navigationControllerMock expect] popViewControllerAnimated:YES];
    [sut closeSearch:nil];
    [navigationControllerMock verify];
});

SpecEnd;
