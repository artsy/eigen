#import "AROnboardingMoreInfoViewController.h"
#import "ARAuthProviders.h"


@interface AROnboardingMoreInfoViewController (Tests)
@property (nonatomic) NSString *name;
@property (nonatomic) NSString *email;
@property (nonatomic) UITextField *nameField;
@property (nonatomic) UITextField *emailField;
@property (nonatomic) ARAuthProviderType provider;
- (BOOL)canSubmit;
@end

SpecBegin(AROnboardingMoreInfoViewController);
__block AROnboardingMoreInfoViewController *vc;


describe(@"facebook", ^{
    beforeEach(^{
        vc = [[AROnboardingMoreInfoViewController alloc] initForFacebookWithToken:@"FacebookToken" email:@"email@email.com" name:@"John Smith"];
    });

//    itHasSnapshotsForDevices(^{ return vc; });

    it(@"prefills name and email", ^{
        [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];

        expect(vc.provider).to.equal(ARAuthProviderFacebook);

        expect(vc.nameField.text).to.equal(@"John Smith");
        expect(vc.name).to.equal(@"John Smith");

        expect(vc.emailField.text).to.equal(@"email@email.com");
        expect(vc.email).to.equal(@"email@email.com");
    });
});

describe(@"twitter", ^{
    beforeEach(^{
        vc = [[AROnboardingMoreInfoViewController alloc] initForTwitterWithToken:@"TwitterToken" andSecret:@"TwitterSecret"];
    });

//    itHasSnapshotsForDevices(^{ return vc; });

    it(@"prefills name and email", ^{
        [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];

        expect(vc.provider).to.equal(ARAuthProviderTwitter);

        expect(vc.nameField.text).to.equal(@"");
        expect(vc.name).to.beNil();

        expect(vc.emailField.text).to.equal(@"");
        expect(vc.email).to.beNil();
    });
});

describe(@"canSubmit", ^{
    beforeEach(^{
        vc = [[AROnboardingMoreInfoViewController alloc] init];
    });

    it(@"is true if name and email are present", ^{
        [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];

        vc.nameField.text = @"Name";
        vc.emailField.text = @"email@email.com";
        expect([vc canSubmit]).to.beTruthy();
    });

    it(@"is false if either is missing", ^{
        expect([vc canSubmit]).to.beFalsy();

        vc.emailField.text = @"email@email.com";
        expect([vc canSubmit]).to.beFalsy();

        vc.emailField.text = @"";
        vc.nameField.text = @"";
        expect([vc canSubmit]).to.beFalsy();
    });
});

SpecEnd;
