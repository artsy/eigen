#import "ARArtworkInfoViewController.h"

SpecBegin(ARArtworkInfoViewController);

__block ARArtworkInfoViewController *vc;

describe(@"more info", ^{
    it(@"displays correctly", ^{
        
        Artwork *artwork = [Artwork modelWithJSON:@{
            @"provenance" : @"Ancient Hoboken",
            @"signature" : @"John Hancock",
            @"additional_information" : @"The more you know",
            @"literature": @"Books About Art",
            @"exhibition_history" : @"Metro Pictures April 2014"
        }];
        
        vc = [[ARArtworkInfoViewController alloc] initWithArtwork:artwork];
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        
        expect(vc).to.haveValidSnapshot();
    });
    
    it(@"displays correctly when missing section", ^{
        
        Artwork *artwork = [Artwork modelWithJSON:@{
            @"provenance" : @"Ancient Hoboken",
            @"additional_information" : @"The more you know",
            @"literature": @"Books About Art",
            @"exhibition_history" : @"Metro Pictures April 2014"
        }];
        
        vc = [[ARArtworkInfoViewController alloc] initWithArtwork:artwork];
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        
        expect(vc).to.haveValidSnapshot();
    });

});

SpecEnd
