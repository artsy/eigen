#import "ARArtworkRelatedArtworksView.h"
#import "AREmbeddedModelsViewController.h"
#import "ARArtworkMasonryModule.h"

#import "ARArtworkWithMetadataThumbnailCell.h"
#import "ARArtworkThumbnailMetadataView.h"

@interface ARArtworkRelatedArtworksView (Testing)
@property (nonatomic, strong) AREmbeddedModelsViewController *artworksVC;
- (void)renderWithArtworks:(NSArray *)artworks heading:(NSString *)heading;
@end

SpecBegin(ARArtworkRelatedArtworksView)

__block NSDictionary *artworkJSON = nil;
__block Artwork *artwork = nil;
__block ARArtworkRelatedArtworksView *relatedView = nil;

before(^{
    // Can't use MTLJSONAdapter to generate JSON from model because, unless we specify all fields, it will raise an
    // exception on all the `null` fields.
    artworkJSON = @{
         @"id": @"korakrit-arunanondchai-untitled-memories1",
      @"title": @"Untitled (Memories1)",
    };
    artwork = [Artwork modelWithJSON:artworkJSON];
    relatedView = [[ARArtworkRelatedArtworksView alloc] initWithArtwork:artwork];
    // Ensure UICollectionView adds visible cells.
    relatedView.frame = CGRectMake(0, 0, 320, 480);
});

it(@"falls back to a section with any related artworks", ^{
});

describe(@"concerning an artwork at a fair", ^{
    __block NSDictionary *otherFairArtworkJSON = nil;
    __block Artwork *otherFairArtwork = nil;

    before(^{
        otherFairArtworkJSON = @{
             @"id": @"other-fair-artwork",
          @"title": @"Other fair artwork",
        };
        otherFairArtwork = [Artwork modelWithJSON:otherFairArtworkJSON];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/fair/the-armory-show/artworks?artwork[]=korakrit-arunanondchai-untitled-memories1"
                               withResponse:@[artworkJSON, otherFairArtworkJSON]];

        Fair *fair = [Fair modelWithJSON:@{
              @"id": @"the-armory-show",
            @"name": @"The Armory Show",
        }];
        [relatedView addSectionForFair:fair];
    });

    it(@"adds a section with other works in the same show (booth)", {
    });

    it(@"adds a section with related works at the fair", ^{
      expect([relatedView viewWithTag:ARRelatedArtworksSameFair]).willNot.beNil();
      NSArray *subviews = [[relatedView viewWithTag:ARRelatedArtworksSameFair] subviews];
      expect([(UILabel *)[subviews firstObject] text]).to.equal(@"OTHER WORKS IN FAIR");

      UIView *artworksVCView = [subviews lastObject];
      UICollectionView *artworksCollectionView = [artworksVCView.subviews lastObject];
      NSArray *titles = [[artworksCollectionView visibleCells] valueForKeyPath:@"metadataView.secondaryLabel.text"];
      expect(titles).to.equal(@[otherFairArtwork.title]);
    });
});

describe(@"concerning an artwork at an auction", ^{
    //before(^{
        //[relatedView addSectionForAuction:auction];
    //});

    it(@"adds a section with other works in the same auction", ^{
    });
});

describe(@"concerning an artwork at a show", ^{
    before(^{
        PartnerShow *show = [PartnerShow modelWithJSON:@{
        }];
        [relatedView addSectionForShow:show];
    });

    it(@"adds a section with other works in the same show", ^{
    });

    it(@"adds a section with other works by the same artist (not in the same show?)", ^{
    });

    it(@"adds a section with related works", ^{
    });
});

describe(@"concerning layout", ^{
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
