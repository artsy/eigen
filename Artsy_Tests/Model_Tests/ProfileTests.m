// We want to ignore the NSKeyedUnarchiver, since we'll be moving this to React Native pretty soon anyway.
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

SpecBegin(Profile);

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
    });

    it(@"can be serialized", ^{
        NSData *profileData = [NSKeyedArchiver archivedDataWithRootObject:profile];
        Profile *deserializedProfile = [NSKeyedUnarchiver unarchiveObjectWithData:profileData];
        expect(deserializedProfile.profileID).to.equal(profile.profileID);
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
    });

    it(@"can be serialized", ^{
        NSData *profileData = [NSKeyedArchiver archivedDataWithRootObject:profile];
        Profile *deserializedProfile = [NSKeyedUnarchiver unarchiveObjectWithData:profileData];
        expect(deserializedProfile.profileID).to.equal(profile.profileID);
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
    });

    it(@"can be serialized", ^{
        NSData *profileData = [NSKeyedArchiver archivedDataWithRootObject:profile];
        Profile *deserializedProfile = [NSKeyedUnarchiver unarchiveObjectWithData:profileData];
        expect(deserializedProfile.profileID).to.equal(profile.profileID);
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
    });

    it(@"can be serialized", ^{
        NSData *profileData = [NSKeyedArchiver archivedDataWithRootObject:profile];
        Profile *deserializedProfile = [NSKeyedUnarchiver unarchiveObjectWithData:profileData];
        expect(deserializedProfile.profileID).to.equal(profile.profileID);
    });
});

describe(@"imageURL", ^{
    __block Profile *profile;
    describe(@"with a default image", ^{
        before(^{
            profile = [Profile modelWithJSON:@{
                @"id" : @"profile-id",
                @"default_icon_version" : @"large",
                @"icon" : @{
                    @"image_urls" : @{
                        @"square" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square.png",
                        @"large" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/large.png"
                    }
                }
            }];
        });

        it(@"uses the square avatar icon version", ^{
            expect(profile.avatarURLString).to.equal(@"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square.png");
        });
    });
});

SpecEnd;

#pragma clang diagnostic pop
