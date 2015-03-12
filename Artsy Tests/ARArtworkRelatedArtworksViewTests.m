#import "ARArtworkRelatedArtworksView.h"
#import "AREmbeddedModelsViewController.h"
#import "ARArtworkMasonryModule.h"

#import "ARArtworkWithMetadataThumbnailCell.h"
#import "ARArtworkThumbnailMetadataView.h"

@interface ARArtworkRelatedArtworksView (Testing)
@property (nonatomic, strong) AREmbeddedModelsViewController *artworksVC;
- (void)renderWithArtworks:(NSArray *)artworks heading:(NSString *)heading;
@end

@implementation ARArtworkRelatedArtworksView (Testing)

- (NSString *)titleForSectionWithTag:(ARRelatedArtworksSubviewOrder)tag;
{
    return [(UILabel *)[[self viewWithTag:tag] subviews][0] text];
}

- (NSArray *)titlesOfArtworksInSectionWithTag:(ARRelatedArtworksSubviewOrder)tag;
{
    UIView *artworksVCView = [[self viewWithTag:tag] subviews][1];
    UICollectionView *artworksCollectionView = [artworksVCView.subviews lastObject];
    NSAssert(!CGSizeEqualToSize(artworksCollectionView.frame.size, CGSizeZero),
             @"There are no visible cells in a UICollectionView if it has no visible frame.");
    return [[artworksCollectionView visibleCells] valueForKeyPath:@"metadataView.secondaryLabel.text"];
}

@end

SpecBegin(ARArtworkRelatedArtworksView)

__block NSDictionary *artworkJSON = nil;
__block Artwork *artwork = nil;
__block ARArtworkRelatedArtworksView *relatedView = nil;

before(^{
    // Can't use MTLJSONAdapter to generate JSON from model because, unless we specify all fields, it will raise an
    // exception on all the `null` fields.
    artworkJSON = @{
         @"id": @"el-anatsui-revelation",
      @"title": @"Revelation",
    };
    artwork = [Artwork modelWithJSON:artworkJSON];
    relatedView = [[ARArtworkRelatedArtworksView alloc] initWithArtwork:artwork];
    // Ensure UICollectionView adds visible cells.
    relatedView.frame = CGRectMake(0, 0, 320, 480);
});

it(@"falls back to a section with any related artworks", ^{
});

describe(@"concerning an artwork at a fair", ^{
    __block NSDictionary *otherShowArtworkJSON = nil;
    __block Artwork *otherShowArtwork = nil;

    __block NSDictionary *otherFairArtworkJSON = nil;
    __block Artwork *otherFairArtwork = nil;

    before(^{
        otherShowArtworkJSON = @{
             @"id": @"hyong-keun-yun-burnt-umber-and-ultramarine-1",
          @"title": @"Burnt umber and ultramarine",
        };
        otherShowArtwork = [Artwork modelWithJSON:otherShowArtworkJSON];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/shows?artwork[]=el-anatsui-revelation&fair_id=the-armory-show"
                               withResponse:@[@{ @"id":@"axel-vervoordt-gallery-axel-vervoordt-gallery-at-the-armory-show-2015", @"partner":@{ @"id":@"axel-vervoordt-gallery" } }]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/partner/axel-vervoordt-gallery/show/axel-vervoordt-gallery-axel-vervoordt-gallery-at-the-armory-show-2015/artworks?size=10&published=true&page=1"
                               withResponse:@[artworkJSON, otherShowArtworkJSON]];

        otherFairArtworkJSON = @{
             @"id": @"gilles-barbier-a-very-old-thing",
          @"title": @"A very old Thing",
        };
        otherFairArtwork = [Artwork modelWithJSON:otherFairArtworkJSON];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/fair/the-armory-show-2015/artworks?artwork[]=el-anatsui-revelation"
                               withResponse:@[artworkJSON, otherFairArtworkJSON]];

        Fair *fair = [Fair modelWithJSON:@{
              @"id": @"the-armory-show-2015",
            @"name": @"The Armory Show 2015",
        }];
        [relatedView addSectionForFair:fair];
    });

    it(@"adds a section with other works in the same show (booth)", ^{
      expect([relatedView viewWithTag:ARRelatedArtworksSameShow]).willNot.beNil();
      expect([relatedView titleForSectionWithTag:ARRelatedArtworksSameShow]).to.equal(@"OTHER WORKS IN SHOW");
      expect([relatedView titlesOfArtworksInSectionWithTag:ARRelatedArtworksSameShow]).to.equal(@[otherShowArtwork.title]);
    });

    it(@"adds a section with related works at the fair", ^{
      expect([relatedView viewWithTag:ARRelatedArtworksSameFair]).willNot.beNil();
      expect([relatedView titleForSectionWithTag:ARRelatedArtworksSameFair]).to.equal(@"OTHER WORKS IN FAIR");
      expect([relatedView titlesOfArtworksInSectionWithTag:ARRelatedArtworksSameFair]).to.equal(@[otherFairArtwork.title]);
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
