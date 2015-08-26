SpecBegin(MapFeature);

it(@"maps every feature type to an image", ^{
    for (int mapFeatureType = 0; mapFeatureType < ARMapFeatureTypeMax; mapFeatureType++) {
        expect(NSStringFromARMapFeatureType((enum ARMapFeatureType) mapFeatureType)).toNot.beNil();
    }
});

SpecEnd;
