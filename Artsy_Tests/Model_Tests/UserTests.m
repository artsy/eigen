// We want to ignore the NSKeyedUnarchiver, since we'll be moving this to React Native pretty soon anyway.
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"

SpecBegin(User);

describe(@"with profile", ^{
    __block User *user;

    beforeEach(^{
        user = [User modelWithJSON:@{ @"id" : @"user-id", @"default_profile_id" : @"user-profile" }];
        user.profile = [Profile modelWithJSON:@{
            @"id" : @"profile-id",
            @"owner_type" : @"User",
            @"owner" : @{
                @"id" : @"user-id",
                @"type" : @"User"
            }
        }];
    });

    it(@"can be serialized", ^{
        NSData *userData = [NSKeyedArchiver archivedDataWithRootObject:user];
        User *deserializedUser = [NSKeyedUnarchiver unarchiveObjectWithData:userData];
        expect(deserializedUser.userID).to.equal(@"user-id");
    });
});

it(@"migrates model from version 0 to 1", ^{
    NSString *userData_v0 = [[NSBundle bundleForClass:[self class]] pathForResource:@"User_v0" ofType:@"data"];
    User *deserializedUser = [NSKeyedUnarchiver unarchiveObjectWithFile:userData_v0];
    expect(deserializedUser.userID).to.equal(@"4dc805b18101da0001000489");
    expect(deserializedUser.defaultProfileID).to.equal(@"dblockdotorg");
    expect(deserializedUser.name).to.equal(@"dB.");
    expect(deserializedUser.email).to.equal(@"dblock@dblock.org");
});

it(@"loads model version 1", ^{
    NSString *userData_v1 = [[NSBundle bundleForClass:[self class]] pathForResource:@"User_v1" ofType:@"data"];
    User *deserializedUser = [NSKeyedUnarchiver unarchiveObjectWithFile:userData_v1];
    expect(deserializedUser.userID).to.equal(@"4dc805b18101da0001000489");
    expect(deserializedUser.defaultProfileID).to.equal(@"dblockdotorg");
    expect(deserializedUser.name).to.equal(@"dB.");
    expect(deserializedUser.email).to.equal(@"dblock@dblock.org");
});

SpecEnd;

#pragma clang diagnostic pop
