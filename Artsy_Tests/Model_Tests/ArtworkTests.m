// We want to ignore the NSKeyedUnarchiver, since we'll be moving this to React Native pretty soon anyway.
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

SpecBegin(Artwork);

describe(@"hasHeightAndWidth", ^{
    it(@"with height and width", ^{
        Artwork *artwork = [Artwork modelWithJSON:@{ @"id" : @"artwork-id", @"width" : @(100), @"height" : @(200) }];
        expect(artwork.hasWidth).to.beTruthy();
        expect(artwork.hasHeight).to.beTruthy();
        expect(artwork.hasDepth).to.beFalsy();
        expect(artwork.hasDiameter).to.beFalsy();
        expect(artwork.hasWidthAndHeight).to.beTruthy();
    });

    it(@"without width", ^{
        Artwork *artwork = [Artwork modelWithJSON:@{ @"id" : @"artwork-id", @"height" : @(200) }];
        expect(artwork.hasWidth).to.beFalsy();
        expect(artwork.hasHeight).to.beTruthy();
        expect(artwork.hasDepth).to.beFalsy();
        expect(artwork.hasDiameter).to.beFalsy();
        expect(artwork.hasWidthAndHeight).to.beFalsy();
    });

    it(@"with depth", ^{
        Artwork *artwork = [Artwork modelWithJSON:@{ @"id" : @"artwork-id", @"depth" : @(200) }];
        expect(artwork.hasWidth).to.beFalsy();
        expect(artwork.hasHeight).to.beFalsy();
        expect(artwork.hasDepth).to.beTruthy();
        expect(artwork.hasDiameter).to.beFalsy();
        expect(artwork.hasWidthAndHeight).to.beFalsy();
    });
});

describe(@"defaultImage", ^{
    __block Artwork *artwork;
    __block NSDictionary *artworkJSON;
    before(^{
        artwork = nil;
    });
    it(@"sets default image to the appropriate image", ^{
        artworkJSON = @{
            @"id": @"artwork_id",
            @"artist":@{ @"id":@"artist_id" },
            @"images":@[
                    @{@"id": @"image_1_id",
                      @"is_default": @NO,
                      @"image_versions": @[@"small", @"square"]},
                    @{@"id": @"image_2_id",
                      @"is_default": @YES,
                      @"image_versions": @[@"small", @"square"]}]
            };
        expect(^{
            artwork = [Artwork modelWithJSON: artworkJSON];
        }).notTo.raiseAny();
        expect(artwork.defaultImage).notTo.beNil();
        expect(artwork.defaultImage.imageID).to.equal(@"image_2_id");
    });

    it(@"sets default image to nil if no default", ^{
        artworkJSON = @{
            @"id":@"artwork_id",
            @"artist":@{ @"id":@"artist_id" },
            @"images":@[
                    @{@"id": @"image_1_id",
                      @"is_default": @NO,
                      @"image_versions": @[@"small", @"square"]},
                    @{@"id": @"image_2_id",
                      @"is_default": @NO,
                      @"image_versions": @[@"small", @"square"]}]
            };
        expect(^{
            artwork = [Artwork modelWithJSON: artworkJSON];
        }).notTo.raiseAny();
        expect(artwork.defaultImage).to.beNil();

    });

    it(@"sets default image to nil if no images", ^{
        artworkJSON = @{
            @"id":@"artwork_id",
            @"artist":@{ @"id":@"artist_id" },
            @"images":@[]
            };
        expect(^{
            artwork = [Artwork modelWithJSON: artworkJSON];
        }).notTo.raiseAny();
        expect(artwork.defaultImage).to.beNil();
        
    });


    it(@"migrates model from version 0 to 1", ^{
        NSString *artworkData_v0 = [[NSBundle bundleForClass:[self class]] pathForResource:@"Artwork_v0" ofType:@"data"];
        Artwork *deserializedArtwork = [NSKeyedUnarchiver unarchiveObjectWithFile:artworkData_v0];
        expect(deserializedArtwork.additionalInfo).to.equal(@"In the collection of European Painting and Sculpture at LACMA.\n\nPaul Rodman Mabury Collection (39.12.3)");
    });

    it(@"loads model version 1", ^{
        NSString *artworkData_v1 = [[NSBundle bundleForClass:[self class]] pathForResource:@"Artwork_v1" ofType:@"data"];
        Artwork *deserializedArtwork = [NSKeyedUnarchiver unarchiveObjectWithFile:artworkData_v1];
        expect(deserializedArtwork.additionalInfo).to.equal(@"In the collection of European Painting and Sculpture at LACMA.\n\nPaul Rodman Mabury Collection (39.12.3)");
    });


    it(@"availablityString returns the string version of availablilty", ^{
       Artwork *artwork = [Artwork modelWithJSON:@{ @"id" : @"artwork-id", @"availability" : @"on hold" }];
       expect(artwork.availablityString).to.equal(@"on hold");
    });

    it(@"isBuyNowable returns NO for BuyNowable artworks that have mutliple editions", ^{
        Artwork *artwork = [Artwork modelWithJSON:
                            @{ @"id" : @"artwork-id",
                               @"edition_sets" : @[
                                       @"it doesn't matter",
                                       @"what values are in this array",
                                       @"as long as there are several"]
                               }];
        expect(artwork.isBuyNowable).to.beFalsy();
    });

    describe(@"funky mp / grav compatibility", ^{
    
        it(@"deals with mp style results for the is_* things", ^{
            Artwork *artwork = [Artwork modelWithJSON:@{
                @"id":@"artwork_id",
                @"is_sold": @(YES),
                @"is_acquireable": @(YES),
                @"is_inquireable": @(YES),
                @"is_offerable": @(YES),
                @"is_price_hidden": @(YES),
                @"mp_attribution_class": @{
                    @"name": @"classy class"
                }
            }];

            expect(artwork.sold).to.beTruthy();
            expect(artwork.isAcquireable).to.beTruthy();
            expect(artwork.isInquireable).to.beTruthy();
            expect(artwork.isPriceHidden).to.beTruthy();
            expect(artwork.attributionClass).to.equal(@"classy class");
        });
        
        it(@"deals with gravity style results for the is_* things", ^{
            Artwork *artwork = [Artwork modelWithJSON:@{
                @"id":@"artwork_id",
                @"sold": @(YES),
                @"acquireable": @(YES),
                @"inquireable": @(YES),
                @"offerable": @(YES),
                @"price_hidden": @(YES),
                @"attribution_class": @"classy class"
            }];
            
            expect(artwork.sold).to.beTruthy();
            expect(artwork.isAcquireable).to.beTruthy();
            expect(artwork.isInquireable).to.beTruthy();
            expect(artwork.isPriceHidden).to.beTruthy();
            expect(artwork.attributionClass).to.equal(@"classy class");
        });
        
    });
});


SpecEnd;

#pragma clang diagnostic pop
