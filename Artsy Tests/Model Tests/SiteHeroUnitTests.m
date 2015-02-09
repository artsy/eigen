SpecBegin(SiteHeroUnit)

describe(@"currentlyActive", ^{
    it(@"past", ^{
        SiteHeroUnit *siteHeroUnit = [SiteHeroUnit modelWithJSON:@{ @"id": @"past", @"start_at" : @"1976-01-27T05:00:00+00:00", @"end_at" : @"1976-01-27T05:00:00+00:00" } error:nil];
        expect(siteHeroUnit.currentlyActive).to.beFalsy();
    });

    it(@"future", ^{
        SiteHeroUnit *siteHeroUnit = [SiteHeroUnit modelWithJSON:@{ @"id": @"future", @"start_at" : @"2099-01-27T05:00:00+00:00", @"end_at" : @"2099-01-27T05:00:00+00:00" } error:nil];
        expect(siteHeroUnit.currentlyActive).to.beFalsy();
    });

    it(@"current", ^{
        SiteHeroUnit *siteHeroUnit = [SiteHeroUnit modelWithJSON:@{ @"id": @"current", @"start_at" : @"1976-01-27T05:00:00+00:00", @"end_at" : @"2099-01-27T05:00:00+00:00" } error:nil];
        expect(siteHeroUnit.isCurrentlyActive).to.beTruthy();
    });
});

describe(@"alignment", ^{
    it(@"sets left correctly", ^{
        SiteHeroUnit *siteHeroUnit = [SiteHeroUnit modelWithJSON:@{ @"id": @"left_hero_unit", @"type" : @"left" } error:nil];
        expect(siteHeroUnit.alignment).to.equal(ARHeroUnitAlignmentLeft);
    });

    it(@"sets right correctly", ^{
        SiteHeroUnit *siteHeroUnit = [SiteHeroUnit modelWithJSON:@{ @"id": @"right_hero_unit", @"type" : @"right" } error:nil];
        expect(siteHeroUnit.alignment).to.equal(ARHeroUnitAlignmentRight);
    });

    it(@"defaults nil to left", ^{
        SiteHeroUnit *siteHeroUnit = [SiteHeroUnit modelWithJSON:@{ @"id": @"nil_hero_unit", @"type" : NSNull.null } error:nil];
        expect(siteHeroUnit.alignment).to.equal(ARHeroUnitAlignmentLeft);
    });

    it(@"defaults anything else to left", ^{
        SiteHeroUnit *siteHeroUnit = [SiteHeroUnit modelWithJSON:@{ @"id": @"bad_data_hero_unit", @"type" : @"upside_down" } error:nil];
        expect(siteHeroUnit.alignment).to.equal(ARHeroUnitAlignmentLeft);
    });
});

SpecEnd
