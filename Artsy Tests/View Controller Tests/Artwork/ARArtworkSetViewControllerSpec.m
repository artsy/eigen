#import "Artwork+Extensions.h"
#import "ARArtworkSetViewController.h"

SpecBegin(ARArtworkSetViewController)

__block ARArtworkSetViewController *controller;


describe(@"setting the index", ^{
    it(@"can deal with an out of bound index on init", ^{
        Artwork *artwork = [Artwork stubbedArtwork];
        controller = [[ARArtworkSetViewController alloc] initWithArtworkSet:@[artwork] fair:nil atIndex:2];

        expect(controller.index).to.equal(0);
    });

    it(@"sets the index correctly", ^{
        Artwork *artwork = [Artwork stubbedArtwork];
        controller = [[ARArtworkSetViewController alloc] initWithArtworkSet:@[artwork, artwork] fair:nil atIndex:1];

        expect(controller.index).to.equal(1);
    });

});

SpecEnd
