SpecBegin(Partner);

describe(@"defaultImage", ^{
    __block Partner *partner;
    __block NSDictionary *partnerJSON;

    before(^{
        partner = nil;
    });

    it(@"sets profile_public to NO if nil", ^{
        partnerJSON = @{
            @"id": @"profile_id",
            @"default_profile_id":@"profile_id",
            @"default_profile_public":[NSNull null]
        };
        expect(^{
            partner = [Partner modelWithJSON: partnerJSON];
        }).notTo.raiseAny();
        expect(partner.defaultProfilePublic).notTo.beNil();
        expect(partner.defaultProfilePublic).to.beFalsy;
    });
});

SpecEnd;
