#import "ARArtworkRelatedArtworksView.h"
#import "AREmbeddedModelsViewController.h"
#import "ARArtworkMasonryModule.h"

#import "ARArtworkWithMetadataThumbnailCell.h"
#import "ARArtworkThumbnailMetadataView.h"


@interface ARArtworkRelatedArtworksContentView : ORStackView
@property (nonatomic, strong) AREmbeddedModelsViewController *artworksVC;
@end


@interface ARArtworkRelatedArtworksView (Private)

@property (nonatomic, strong) Artwork *artwork;
@property (nonatomic, strong) AREmbeddedModelsViewController *artworksVC;

- (void)addSectionsForFair:(Fair *)fair;
- (void)addSectionsForShow:(PartnerShow *)show;
- (void)addSectionsForAuction:(Sale *)auction;
- (void)addSectionWithRelatedArtworks;
- (ARArtworkRelatedArtworksContentView *)addSectionWithTag:(ARRelatedArtworksSubviewOrder)tag artworks:(NSArray *)artworks heading:(NSString *)heading;

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
    return [artworksCollectionView.visibleCells map:^(ARArtworkWithMetadataThumbnailCell *cell) {
        return cell.metadataView.secondaryLabel.text;
    }];
}

- (AREmbeddedModelsViewController *)viewControllerForTag:(ARRelatedArtworksSubviewOrder)tag
{
    return [(ARArtworkRelatedArtworksContentView *)[self viewWithTag:tag] artworksVC];
}

@end

SpecBegin(ARArtworkRelatedArtworksView);

__block NSDictionary *artworkJSON = nil;
__block Artwork *artwork = nil;
__block ARArtworkRelatedArtworksView *relatedView = nil;

__block NSDictionary *showJSON = nil;
__block PartnerShow *show = nil;

__block NSDictionary *relatedArtworkJSON = nil;
__block Artwork *relatedArtwork = nil;

before(^{
    artworkJSON = @{
            @"id": @"el-anatsui-revelation",
         @"title": @"Revelation",
        @"artist": @{ @"id": @"el-anatsui", @"name": @"El Anatsui" },
    };
    artwork = [Artwork modelWithJSON:artworkJSON];

    showJSON = @{
             @"id":@"axel-vervoordt-gallery-axel-vervoordt-gallery-at-the-armory-show-2015",
        @"partner":@{ @"id":@"axel-vervoordt-gallery" }
    };
    show = [PartnerShow modelWithJSON:showJSON];

    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/shows?artwork[]=el-anatsui-revelation&fair_id=the-armory-show"
                           withResponse:@[showJSON]];

    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/partner/axel-vervoordt-gallery/show/axel-vervoordt-gallery-axel-vervoordt-gallery-at-the-armory-show-2015/artworks"
                             withParams:@{@"size" : @"10", @"published" : @YES, @"page" : @1}
                           withResponse:@[artworkJSON, @{ @"id":@"id-1", @"title":@"Title1" },
                                          @{ @"id":@"id-2", @"title":@"Title2" }, @{ @"id":@"id-3", @"title":@"Title3" },
                                          @{ @"id":@"id-4", @"title":@"Title4" }, @{ @"id":@"id-5", @"title":@"Title5" },
                                          @{ @"id":@"id-6", @"title":@"Title6" }, @{ @"id":@"id-7", @"title":@"Title7" },
                                          @{ @"id":@"id-8", @"title":@"Title8" }, @{ @"id":@"id-9", @"title":@"Title9" },
                                          ]];

    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/partner/axel-vervoordt-gallery/show/axel-vervoordt-gallery-axel-vervoordt-gallery-at-the-armory-show-2015/artworks"
                             withParams:@{@"size" : @"10", @"published" : @YES, @"page" : @2}
                           withResponse:@[@{ @"id":@"id-10", @"title":@"Title10" }, @{ @"id":@"id-11", @"title":@"Title11" }]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/partner/axel-vervoordt-gallery/show/axel-vervoordt-gallery-axel-vervoordt-gallery-at-the-armory-show-2015/artworks"
                             withParams:@{@"size" : @"10", @"published" : @YES, @"page" : @3}
                           withResponse:@[]];

    relatedArtworkJSON = @{
           @"id": @"judy-pfaff-wallabout",
        @"title": @"Wallabout",
    };
    relatedArtwork = [Artwork modelWithJSON:relatedArtworkJSON];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks?artwork[]=el-anatsui-revelation"
                           withResponse:@[artworkJSON, relatedArtworkJSON]];

    relatedView = [ARArtworkRelatedArtworksView new];
    relatedView.artwork = artwork;
    // Ensure UICollectionView adds visible cells.
    relatedView.frame = CGRectMake(0, 0, 320, 480);
});

it(@"falls back to a section with any related artworks", ^{
    [relatedView addSectionWithRelatedArtworks];
    expect([relatedView viewWithTag:ARRelatedArtworks]).willNot.beNil();
    expect([relatedView titleForSectionWithTag:ARRelatedArtworks]).to.equal(@"RELATED ARTWORKS");
    expect([relatedView titlesOfArtworksInSectionWithTag:ARRelatedArtworks]).to.equal(@[relatedArtwork.title]);
});

it(@"does not add a section when there are no artworks for that section", ^{
    [relatedView addSectionWithTag:0 artworks:@[] heading:@"Empty"];
    expect(relatedView.subviews).to.haveACountOf(0);
});

describe(@"concerning an artwork at a fair", ^{
    __block NSDictionary *otherFairArtworkJSON = nil;
    __block Artwork *otherFairArtwork = nil;

    before(^{
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
        [relatedView addSectionsForFair:fair];
    });

    it(@"adds a section with other works in the same show (booth)", ^{
        expect([relatedView viewWithTag:ARRelatedArtworksSameShow]).to.beTruthy();
        expect([relatedView titleForSectionWithTag:ARRelatedArtworksSameShow]).to.equal(@"OTHER WORKS IN SHOW");
        AREmbeddedModelsViewController *vc = [relatedView viewControllerForTag:ARRelatedArtworksSameShow];
        expect(vc.items.count).to.equal(11);
    });

    it(@"adds a section with related works at the fair", ^{
        expect([relatedView viewWithTag:ARRelatedArtworksSameFair]).to.beTruthy();
        expect([relatedView titleForSectionWithTag:ARRelatedArtworksSameFair]).to.equal(@"OTHER WORKS IN FAIR");
        expect([relatedView titlesOfArtworksInSectionWithTag:ARRelatedArtworksSameFair]).to.equal(@[otherFairArtwork.title]);
    });
});

describe(@"concerning an artwork at an auction", ^{
    __block NSDictionary *otherSaleArtworkJSON = nil;
    __block Artwork *otherSaleArtwork = nil;

    before(^{
        otherSaleArtworkJSON = @{
               @"id": @"ed-ruscha-cockroaches-from-insects-portfolio",
            @"title": @"Cockroaches (from Insects Portfolio)",
        };
        otherSaleArtwork = [Artwork modelWithJSON:otherSaleArtworkJSON];

        [OHHTTPStubs stubJSONResponseAtPath:@""
                               withResponse:@{
            @"data": @{
                @"sale": @{
                    @"sale_artworks": @[
                        @{
                            @"artwork": artworkJSON
                        },
                        @{
                            @"artwork": otherSaleArtworkJSON
                        },
                    ]
                }
            }
        }];

        // The main artwork fixture is not actually on sale at this auction, but such is life :)
        Sale *auction = [Sale modelWithJSON: @{
                    @"id": @"los-angeles-modern-auctions-march-2015",
            @"is_auction": @(YES),
        }];
        [relatedView addSectionsForAuction:auction];
    });

    it(@"adds a section with other works in the same auction", ^{
        expect([relatedView viewWithTag:ARRelatedArtworksSameAuction]).willNot.beNil();
        expect([relatedView titleForSectionWithTag:ARRelatedArtworksSameAuction]).to.equal(@"OTHER WORKS IN AUCTION");
        expect([relatedView titlesOfArtworksInSectionWithTag:ARRelatedArtworksSameAuction]).to.equal(@[otherSaleArtwork.title]);
    });
});

describe(@"concerning an artwork at a show", ^{

    it(@"does not add a section with other works by the same artist if the artwork has no associated artist", ^{
        relatedView.artwork.artist = nil;
        [relatedView addSectionsForShow:show];
        expect([relatedView viewWithTag:ARRelatedArtworksArtistArtworks]).to.beNil();
    });

    describe(@"with artwork metadata", ^{
        __block NSDictionary *otherWorkByArtistJSON = nil;
        __block Artwork *otherWorkByArtist = nil;

        before(^{
            otherWorkByArtistJSON = @{ @"id":@"el-anatsui-wet", @"title":@"Wet" };
            otherWorkByArtist = [Artwork modelWithJSON:otherWorkByArtistJSON];
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artist/el-anatsui/artworks?page=1&size=10"
                                   withResponse:@[artworkJSON, otherWorkByArtistJSON]];
            
            [relatedView addSectionsForShow:show];
        });

        it(@"adds a section with other works in the same show", ^{
            relatedView.frame = CGRectMake(0, 0, 320, 1200);
            expect([relatedView viewWithTag:ARRelatedArtworksSameShow]).willNot.beNil();
            expect([relatedView titleForSectionWithTag:ARRelatedArtworksSameShow]).to.equal(@"OTHER WORKS IN SHOW");
            AREmbeddedModelsViewController *vc = [relatedView viewControllerForTag:ARRelatedArtworksSameShow];
            expect(vc.items.count).will.equal(11);
        });

        it(@"adds a section with other works by the same artist", ^{
            relatedView.frame = CGRectMake(0, 0, 320, 1200);
            expect([relatedView viewWithTag:ARRelatedArtworksArtistArtworks]).willNot.beNil();
            expect([relatedView titleForSectionWithTag:ARRelatedArtworksArtistArtworks]).to.equal(@"OTHER WORKS BY EL ANATSUI");
            expect([relatedView titlesOfArtworksInSectionWithTag:ARRelatedArtworksArtistArtworks]).to.equal(@[otherWorkByArtist.title]);
        });

        it(@"adds a section with related works", ^{
            relatedView.frame = CGRectMake(0, 0, 320, 1200);
            expect([relatedView viewWithTag:ARRelatedArtworks]).willNot.beNil();
            expect([relatedView titleForSectionWithTag:ARRelatedArtworks]).to.equal(@"RELATED ARTWORKS");
            expect([relatedView titlesOfArtworksInSectionWithTag:ARRelatedArtworks]).to.equal(@[relatedArtwork.title]);
        });
    });

});

describe(@"concerning layout", ^{
    __block ARArtworkRelatedArtworksContentView *section = nil;

    before(^{
        section = [relatedView addSectionWithTag:0 artworks:@[[Artwork modelFromDictionary:@{@"title": @"Title"}]] heading:@"Related Heading"];
    });

    describe(@"iPhone", ^{
        it(@"initializes module with correct layout", ^{
            ARArtworkMasonryLayout layout = [(ARArtworkMasonryModule *)section.artworksVC.activeModule layout];
            expect(layout).to.equal(ARArtworkMasonryLayout2Column);
        });

        it(@"returns correct layout for orientation", ^{
            expect([relatedView masonryLayoutForSize:CGSizeMake(400, 300)]).to.equal(ARArtworkMasonryLayout2Column);
            expect([relatedView masonryLayoutForSize:CGSizeMake(300, 400)]).to.equal(ARArtworkMasonryLayout2Column);
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
            ARArtworkMasonryLayout layout = [(ARArtworkMasonryModule *)section.artworksVC.activeModule layout];
            expect(layout).to.equal(ARArtworkMasonryLayout3Column);
        });

        it(@"returns correct layout for orientation", ^{
            expect([relatedView masonryLayoutForSize:CGSizeMake(400, 300)]).to.equal(ARArtworkMasonryLayout4Column);
            expect([relatedView masonryLayoutForSize:CGSizeMake(300, 400)]).to.equal(ARArtworkMasonryLayout3Column);
        });
    });
});

SpecEnd;
