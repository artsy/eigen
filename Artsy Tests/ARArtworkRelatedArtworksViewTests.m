#import "ARArtworkRelatedArtworksView.h"
#import "AREmbeddedModelsViewController.h"
#import "ARArtworkMasonryModule.h"

@interface ARArtworkRelatedArtworksView (Testing)
@property (nonatomic, strong) AREmbeddedModelsViewController *artworksVC;
- (void)renderWithArtworks:(NSArray *)artworks heading:(NSString *)heading;
@end

SpecBegin(ARArtworkRelatedArtworksView)

__block ARArtworkRelatedArtworksView *relatedView;

before(^{
    Artwork *artwork = [Artwork modelWithJSON:@{
           @"id": @"korakrit-arunanondchai-untitled-memories1",
        @"title": @"Untitled (Memories1)",
        // @"availability" : @"for sale",
        // @"acquireable" : @YES
    }];
    relatedView = [[ARArtworkRelatedArtworksView alloc] initWithArtwork:artwork];
});

describe(@"concerning an artwork at a fair", ^{
    before(^{
        Fair *fair = [Fair modelWithJSON:@{
              @"id": @"the-armory-show",
            @"name": @"The Armory Show",
        }];
        [relatedView addSectionForFair:fair];
    });

    it(@"adds a section with other works in the same show (booth)", {
    });

    it(@"adds a section with related works at the fair", {
    });
});

describe(@"concerning an artwork at an auction", ^{
    //before(^{
        //[relatedView addSectionForAuction:auction];
    //});

    it(@"adds a section with other works in the same auction", {
    });
});

describe(@"concerning an artwork at a show", ^{
    before(^{
        PartnerShow *show = [PartnerShow modelWithJSON:@{
        }];
        [relatedView addSectionForShow:show];
    });

    it(@"adds a section with other works in the same show", {
    });

    it(@"adds a section with other works by the same artist (not in the same show?)", {
    });

    it(@"adds a section with related works", {
    });
});

describe("concerning layout", ^{
    before(^{
        [relatedView renderWithArtworks:@[[Artwork modelFromDictionary:@{@"title": @"Title"}]] heading:@"Related Heading"];
    });

    describe(@"iPhone", ^{
        it(@"initializes module with correct layout", ^{
            ARArtworkMasonryLayout layout = [(ARArtworkMasonryModule *)relatedView.artworksVC.activeModule layout];
            expect(layout).to.equal(ARArtworkMasonryLayout2Column);
        });
    });

    describe(@"iPad", ^{
        beforeAll(^{
            [ARTestContext stubDevice:ARDeviceTypePad];
        });

        afterAll(^{
            [ARTestContext stopStubbing];
        });

        it(@"initializes the module with correct layout", ^{
            ARArtworkMasonryLayout layout = [(ARArtworkMasonryModule *)relatedView.artworksVC.activeModule layout];
            expect(layout).to.equal(ARArtworkMasonryLayout3Column);
        });

        it(@"returns correct layout for orientation", ^{
            expect([relatedView masonryLayoutForPadWithOrientation:UIInterfaceOrientationLandscapeLeft]).to.equal(ARArtworkMasonryLayout4Column);
            expect([relatedView masonryLayoutForPadWithOrientation:UIInterfaceOrientationLandscapeRight]).to.equal(ARArtworkMasonryLayout4Column);
            expect([relatedView masonryLayoutForPadWithOrientation:UIInterfaceOrientationPortrait]).to.equal(ARArtworkMasonryLayout3Column);
            expect([relatedView masonryLayoutForPadWithOrientation:UIInterfaceOrientationPortraitUpsideDown]).to.equal(ARArtworkMasonryLayout3Column);
        });
    });
});

SpecEnd
