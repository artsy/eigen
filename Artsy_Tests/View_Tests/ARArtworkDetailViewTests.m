#import "ARArtworkDetailView.h"

SpecBegin(ARArtworkDetailView);

it(@"displays both cm and in dimensions", ^{
    Artwork *artwork = [Artwork modelWithJSON:@{
          @"dimensions" : @{
            @"cm":@"100 cm big",
            @"in":@"100 inches big",
          }
    }];

    ARArtworkDetailView *view = [[ARArtworkDetailView alloc] initWithArtwork:nil andFair:nil];
    view.frame = (CGRect){ 0, 0, 320, 80 };
    [view updateWithArtwork:artwork];

    expect(view).to.haveValidSnapshotNamed(@"bothDimensions");
});


it(@"shows auction data", ^{
    Artwork *artwork = [Artwork modelWithJSON:@{
        @"title": @"The test work",
        @"displayTitle": @"They test works",
        @"dimensions" : @{
            @"cm":@"100 cm big",
            @"in":@"100 inches big",
        }
    }];

    SaleArtwork *saleArtwork = [SaleArtwork modelWithJSON:@{
        @"lot_label": @"56",
        @"opening_bid_cents": @100000,
        @"highest_bid_amount_cents": @110000,
        @"minimum_next_bid_cents": @120000,
        @"low_estimate_cents": @90000,
        @"currency" : @"USD", @"symbol" : @"$"
    }];

    ARArtworkDetailView *view = [[ARArtworkDetailView alloc] initWithArtwork:nil andFair:nil];
    view.frame = (CGRect){ 0, 0, 320, 180 };
    [view updateWithArtwork:artwork];
    [view updateWithSaleArtwork:saleArtwork];
    
    expect(view).to.haveValidSnapshot();
});


SpecEnd;
