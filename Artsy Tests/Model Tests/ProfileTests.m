SpecBegin(Profile)

__block Profile *profile;

describe(@"User", ^{
    beforeEach(^{
        profile = [Profile modelWithJSON:@{
            @"id" : @"profile-id",
            @"owner_type" : @"User",
            @"owner" : @{
                @"id" : @"user-id",
                @"type" : @"User"
            }
        }];
    });

    it(@"creates an owner of type User", ^{
        expect(profile.profileID).to.equal(@"profile-id");
        expect(profile.profileOwner).to.beKindOf([User class]);
        expect([(User *)profile.profileOwner userID]).to.equal(@"user-id");
    });

    it(@"can be serialized", ^{
        NSData *profileData = [NSKeyedArchiver archivedDataWithRootObject:profile];
        Profile *deserializedProfile = [NSKeyedUnarchiver unarchiveObjectWithData:profileData];
        expect(deserializedProfile.profileID).to.equal(profile.profileID);
        expect(deserializedProfile.profileOwner).to.beKindOf([User class]);
        expect([(User *)deserializedProfile.profileOwner userID]).to.equal(@"user-id");
    });
});

describe(@"FairOrganizer", ^{
    beforeEach(^{
        profile = [Profile modelWithJSON:@{
            @"id" : @"profile-id",
            @"owner_type" : @"FairOrganizer",
            @"owner" : @{
                @"id" : @"fair-organizer-id",
                @"default_fair_id" : @"default-fair-id"
            }
        }];
    });

    it(@"creates an owner of type FairOrganizer", ^{
        expect(profile.profileID).to.equal(@"profile-id");
        expect(profile.profileOwner).to.beKindOf([FairOrganizer class]);
        expect([(FairOrganizer *)profile.profileOwner fairOrganizerID]).to.equal(@"fair-organizer-id");
    });

    it(@"can be serialized", ^{
        NSData *profileData = [NSKeyedArchiver archivedDataWithRootObject:profile];
        Profile *deserializedProfile = [NSKeyedUnarchiver unarchiveObjectWithData:profileData];
        expect(deserializedProfile.profileID).to.equal(profile.profileID);
        expect(deserializedProfile.profileOwner).to.beKindOf([FairOrganizer class]);
        expect([(FairOrganizer *)deserializedProfile.profileOwner fairOrganizerID]).to.equal(@"fair-organizer-id");
    });
});

describe(@"Fair", ^{
    beforeEach(^{
        profile = [Profile modelWithJSON:@{
            @"id" : @"profile-id",
            @"owner_type" : @"Fair",
            @"owner" : @{
                @"id" : @"fair-id",
            }
        }];
    });

    it(@"creates an owner of type Fair", ^{
        expect(profile.profileID).to.equal(@"profile-id");
        expect(profile.profileOwner).to.beKindOf([Fair class]);
        expect([(Fair *)profile.profileOwner fairID]).to.equal(@"fair-id");
    });

    it(@"can be serialized", ^{
        NSData *profileData = [NSKeyedArchiver archivedDataWithRootObject:profile];
        Profile *deserializedProfile = [NSKeyedUnarchiver unarchiveObjectWithData:profileData];
        expect(deserializedProfile.profileID).to.equal(profile.profileID);
        expect(deserializedProfile.profileOwner).to.beKindOf([Fair class]);
        expect([(Fair *)deserializedProfile.profileOwner fairID]).to.equal(@"fair-id");
    });
});

describe(@"Partner", ^{
    beforeEach(^{
        profile = [Profile modelWithJSON:@{
            @"id" : @"profile-id",
            @"owner_type" : @"PartnerGallery",
            @"owner" : @{
                @"id" : @"partner-id",
            }
        }];
    });

    it(@"creates an owner of type Partner", ^{
        expect(profile.profileID).to.equal(@"profile-id");
        expect(profile.profileOwner).to.beKindOf([Partner class]);
        expect([(Partner *)profile.profileOwner partnerID]).to.equal(@"partner-id");
    });

    it(@"can be serialized", ^{
        NSData *profileData = [NSKeyedArchiver archivedDataWithRootObject:profile];
        Profile *deserializedProfile = [NSKeyedUnarchiver unarchiveObjectWithData:profileData];
        expect(deserializedProfile.profileID).to.equal(profile.profileID);
        expect(deserializedProfile.profileOwner).to.beKindOf([Partner class]);
        expect([(Partner *)deserializedProfile.profileOwner partnerID]).to.equal(@"partner-id");
    });
});

SpecEnd
