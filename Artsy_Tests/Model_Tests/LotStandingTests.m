SpecBegin(LotStanding);

it(@"deserializes the sale artwork", ^{
    LotStanding *subject = [LotStanding modelWithJSON:@{
        @"sale_artwork": @{ @"id": @"some-sale-artwork-id" },
        @"leading_position": [NSNull null]
    }];

    expect(subject.saleArtwork.saleArtworkID).to.equal(@"some-sale-artwork-id");
});

it(@"isLeading is false with nil leading_position", ^{
    LotStanding *subject = [LotStanding modelWithJSON:@{
        @"sale_artwork": @{ @"id": @"some-sale-artwork-id" },
        @"leading_position": [NSNull null]
    }];

    expect(subject.isLeading).to.beFalsy();
});

it(@"isLeading is true with non-nil leading_position", ^{
    LotStanding *subject = [LotStanding modelWithJSON:@{
        @"sale_artwork": @{
            @"id": @"some-sale-artwork-id"
        },
        @"leading_position": @{ @"some non-nil key": @"data" }
    }];

    expect(subject.isLeading).to.beTruthy();
});

SpecEnd;
