#import "ARFileUtils.h"
#import "ARUserManager.h"
#import "ARUserManager+Stubs.h"

SpecBegin(ARFileUtilsTests);

describe(@"logged out user documents folder", ^{
    beforeEach(^{
        [ARUserManager clearUserData];
    });

    it(@"userDocumentsFolder", ^{
        expect([ARFileUtils userDocumentsPathWithFile:@"folder"]).to.beNil();
    });
});

describe(@"logged in user documents folder", ^{
    beforeEach(^{
        [ARUserManager stubAndSetupUser];
        XCTAssert([User currentUser] != nil, @"Current user is nil even after stubbing. ");
    });

    it(@"userDocumentsFilename", ^{
        NSString *uuid = [[NSUUID UUID] UUIDString];
        NSString *uuidFilePath = [ARFileUtils userDocumentsPathWithFile:uuid];
        expect([uuidFilePath hasSuffix:NSStringWithFormat(@"/Documents/%@/%@", [User currentUser].userID, uuid)]).to.beTruthy();
    });
});

pending(@"application support", ^{
    __block NSString *bundleID;
    afterEach(^{
        bundleID = [[NSBundle bundleForClass:Artwork.class] bundleIdentifier];
        
        NSString *testFolder = [ARFileUtils appSupportPathWithFolder:@"testFolder" filename:nil];
        [[NSFileManager defaultManager] removeItemAtPath:testFolder error:nil];
    });
    
    it(@"returns a path namespaced to the app", ^{
        expect([ARFileUtils appSupportFolder]).to.contain(bundleID);
    });
    
    it(@"returns a ignores the directory /filename inside the app scoped dir", ^{
        expect([ARFileUtils appSupportPathWithFolder:nil filename:@"testFile"]).to.endWith([bundleID stringByAppendingString:@"/testFile"]);
    });

    it(@"returns a directory/filename inside the app scoped dir", ^{
        NSString *path = [ARFileUtils appSupportPathWithFolder:@"testFolder" filename:@"testFile"];
        expect(path).toNot.endWith([bundleID stringByAppendingString:@"/testFile"]);
        expect(path).to.contain(@"/testFolder/");
    });

});

SpecEnd;
