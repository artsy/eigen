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
});


SpecEnd
