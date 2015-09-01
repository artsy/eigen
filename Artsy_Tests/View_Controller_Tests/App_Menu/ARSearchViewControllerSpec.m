#import "ARSearchViewController.h"


@interface ARSearchViewController (Testing)
- (void)presentResultsViewAnimated:(BOOL)animated;
@end

SpecBegin(ARSearchViewController);

__block ARSearchViewController *sut;
__block id sutMock;

context(@"add results", ^{
    before(^{
        sut = [[ARSearchViewController alloc] init];
        sutMock = [OCMockObject partialMockForObject:sut];
        [[[sutMock expect] ignoringNonObjectArgs] presentResultsViewAnimated:NO];
    });

    after(^{
        [sutMock verify];
    });

    it(@"replaces results", ^{
        sut.searchDataSource.searchResults = [NSOrderedSet orderedSetWithObjects:[SearchResult modelWithJSON:@{
            @"model": @"artist",
            @"id": @"f-scott-hess",
            @"display": @"F. Scott Hess",
            @"label": @"Artist",
            @"score": @"excellent",
            @"search_detail": @"American, born 1955",
            @"published": @(YES),
            @"highlights": @[]
        }], [SearchResult modelWithJSON:@{
            @"model": @"artist",
            @"id": @"john-f-carlson",
            @"display": @"John F. Carlson",
            @"label": @"Artist",
            @"score": @"excellent",
            @"search_detail": @"Swedish-American, 1875-1947",
            @"published": @(YES),
            @"highlights": @[]
        }], nil];

        expect(sut.searchResults.count).to.equal(2);

        [sut addResults:@[[SearchResult modelWithJSON:@{
            @"model": @"artist",
            @"id": @"aes-plus-f",
            @"display": @"AES+F",
            @"label": @"Artist",
            @"score": @"excellent",
            @"search_detail": @"Russian, Founded 1987",
            @"published": @(YES),
            @"highlights": @[]
        }]] replace:YES];
        expect(sut.searchResults.count).to.equal(1);
    });

    it(@"adds to results", ^{
        sut.searchDataSource.searchResults = [NSOrderedSet orderedSetWithObjects:[SearchResult modelWithJSON:@{
            @"model": @"artist",
            @"id": @"f-scott-hess",
            @"display": @"F. Scott Hess",
            @"label": @"Artist",
            @"score": @"excellent",
            @"search_detail": @"American, born 1955",
            @"published": @(YES),
            @"highlights": @[]
        }], [SearchResult modelWithJSON:@{
            @"model": @"artist",
            @"id": @"john-f-carlson",
            @"display": @"John F. Carlson",
            @"label": @"Artist",
            @"score": @"excellent",
            @"search_detail": @"Swedish-American, 1875-1947",
            @"published": @(YES),
            @"highlights": @[]
        }], nil];

        expect(sut.searchResults.count).to.equal(2);
        
        [sut addResults:@[[SearchResult modelWithJSON:@{
            @"model": @"artist",
            @"id": @"aes-plus-f",
            @"display": @"AES+F",
            @"label": @"Artist",
            @"score": @"excellent",
            @"search_detail": @"Russian, Founded 1987",
            @"published": @(YES),
            @"highlights": @[]
        }]] replace:NO];

        expect(sut.searchResults.count).to.equal(3);
    });
});

SpecEnd;
