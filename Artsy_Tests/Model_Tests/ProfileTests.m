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

describe(@"imageURL", ^{
    __block Profile *profile;
    describe(@"without a default image", ^{
        before(^{
            profile = [Profile modelWithJSON:@{
                @"id" : @"profile-id",
                @"icon" : @{
                    @"image_urls" : @{
                        @"square" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square.png",
                        @"large" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/large.png",
                    }
                }
            }];
        });

        it(@"uses any available icon version", ^{
            expect(profile.iconURL).to.contain(@"http://static1.artsy.net/profile_icons");
        });
    });

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

        it(@"uses the specified icon version", ^{
            expect(profile.iconURL).to.equal(@"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/large.png");
        });

        it(@"uses the square avatar icon version", ^{
            expect(profile.avatarURLString).to.equal(@"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/square.png");
        });
    });


    describe(@"with only a large image", ^{
        before(^{
            profile = [Profile modelWithJSON:@{
                @"id" : @"profile-id",
                @"default_icon_version" : @"large",
                @"icon" : @{
                    @"image_urls" : @{
                        @"large" : @"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/large.png"
                    }
                }
            }];
        });

        it(@"uses the square avatar icon version", ^{
            expect(profile.iconURL).to.equal(@"http://static1.artsy.net/profile_icons/530cc50c9c18dbab9a00005b/large.png");
        });
    });

    describe(@"with no image", ^{
        before(^{
            profile = [Profile modelWithJSON:@{
                @"id" : @"profile-id",
                @"default_icon_version" : @"large",
                @"icon" : @{
                    @"image_urls" : @{
                    }
                }
            }];
        });
        
        it(@"uses the specified icon version", ^{
            expect(profile.iconURL).to.beNil();
        });
    });
});

SpecEnd;

#pragma clang diagnostic pop
