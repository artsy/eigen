#import "ARLoginViewController.h"
#import "ARUserManager.h"
#import "ARUserManager+Stubs.h"
#import "ARAuthProviders.h"


@interface ARLoginViewController (Testing)

@property (nonatomic, strong) NSString *email;
@property (nonatomic, strong) UITextField *emailTextField;
@property (nonatomic, strong) UITextField *passwordTextField;

- (void)login:(id)sender;
- (void)fb:(id)sender;
- (void)twitter:(id)sender;
- (void)forgotPassword:(id)sender;
- (void)sendPasswordResetEmail:(NSString *)email;
- (void)textFieldDidChange:(UIView *)textView;
@end
// TODO: Onboarding tests
//SpecBegin(ARLoginViewController);
//
//beforeEach(^{
//    [ARUserManager clearUserData];
//});
//
//afterEach(^{
//    [OHHTTPStubs removeAllStubs];
//});
//
//describe(@"login view controller", ^{
//    __block ARLoginViewController *controller;
//
//    describe(@"snapshots", ^{
//        beforeEach(^{
//            controller = [[ARLoginViewController alloc] init];
//            controller.hideDefaultValues = YES;
//        });
//                   
//        itHasSnapshotsForDevicesWithName(@"blank form", ^{
//            [controller ar_presentWithFrame:[UIScreen mainScreen].bounds];
//            return controller;
//        });
//
//        itHasSnapshotsForDevicesWithName(@"completed form", ^{
//            [controller ar_presentWithFrame:[UIScreen mainScreen].bounds];
//            controller.emailTextField.text = [ARUserManager stubUserEmail];
//            controller.passwordTextField.text = [ARUserManager stubUserPassword];
//            [controller textFieldDidChange:nil];
//
//            return controller;
//        });
//    });
//    
//    describe(@"initWithEmail", ^{
//        beforeEach(^{
//            controller = [[ARLoginViewController alloc] initWithEmail:[ARUserManager stubUserEmail]];
//            [controller view]; // loads view and calls viewDidLoad
//        });
//
//        it(@"sets username text field to the value of the email", ^{
//            expect(controller.email).to.equal([ARUserManager stubUserEmail]);
//            expect(controller.emailTextField.text).to.equal([ARUserManager stubUserEmail]);
//        });
//    });
//
//    describe(@"login", ^{
//        beforeEach(^{
//            controller = [[ARLoginViewController alloc] init];
//            [controller view]; // loads view and calls viewDidLoad
//        });
//
//        describe(@"with username and password", ^{
//            it(@"succeeds", ^{
//                [ARUserManager stubAccessToken:[ARUserManager stubAccessToken] expiresIn:[ARUserManager stubAccessTokenExpiresIn]];
//                [ARUserManager stubMe:[ARUserManager stubUserID] email:[ARUserManager stubUserEmail] name:[ARUserManager stubUserName]];
//                expect([ARUserManager sharedManager].currentUser).to.beNil();
//
//                controller.emailTextField.text = [ARUserManager stubUserEmail];
//                controller.passwordTextField.secureTextEntry = YES;
//                controller.passwordTextField.text = [ARUserManager stubUserPassword];
//                controller.passwordTextField.secureTextEntry = NO;
//                [controller login:nil];
//                expect([ARUserManager sharedManager].currentUser).willNot.beNil();
//
//                User *currentUser = [[ARUserManager sharedManager] currentUser];
//                expect(currentUser.userID).to.equal(ARUserManager.stubUserID);
//                expect(currentUser.email).to.equal(ARUserManager.stubUserEmail);
//                expect(currentUser.name).to.equal(ARUserManager.stubUserName);
//            });
//
//            it(@"fails and displays error", ^{
//                [OHHTTPStubs stubJSONResponseAtPath:@"/oauth2/access_token" withResponse:@{ @"error": @"invalid_client", @"error_description": @"missing client_id" } andStatusCode:401];
//
//                controller.emailTextField.text = [ARUserManager stubUserEmail];
//                controller.passwordTextField.secureTextEntry = YES;
//                controller.passwordTextField.text = [ARUserManager stubUserPassword];
//                controller.passwordTextField.secureTextEntry = NO;
//
//                id mockAlertView = [OCMockObject mockForClass:[UIAlertView class]];
//                [[mockAlertView expect] setAlertViewStyle:UIAlertViewStyleDefault];
//                [[[mockAlertView stub] andReturn:mockAlertView] alloc];
//
//                (void)[[[mockAlertView expect] andReturn:mockAlertView]
//                       initWithTitle:@"Couldn’t Log In"
//                       message:@"Please check your email and password"
//                       delegate:OCMOCK_ANY
//                       cancelButtonTitle:OCMOCK_ANY
//                       otherButtonTitles:OCMOCK_ANY, nil];
//                [[mockAlertView expect] show];
//                [controller login:nil];
//                [mockAlertView verifyWithDelay:1];
//                [mockAlertView stopMocking];
//            });
//        });
//
//        describe(@"with facebook", ^{
//            it(@"succeeds", ^{
//                [ARUserManager stubAccessToken:[ARUserManager stubAccessToken] expiresIn:[ARUserManager stubAccessTokenExpiresIn]];
//                [ARUserManager stubMe:[ARUserManager stubUserID] email:[ARUserManager stubUserEmail] name:[ARUserManager stubUserName]];
//                expect([ARUserManager sharedManager].currentUser).to.beNil();
//
//                id authProviders = [OCMockObject mockForClass:[ARAuthProviders class]];
//                [[[authProviders stub] andDo:^(NSInvocation *invocation) {
//                    void(^successBlock)(NSString *token, NSString *email, NSString *name);
//                    [invocation getArgument:&successBlock atIndex:2];
//                    successBlock(@"facebook token", [ARUserManager stubUserEmail], [ARUserManager stubUserName]);
//                }] getTokenForFacebook:OCMOCK_ANY failure:OCMOCK_ANY];
//
//                [controller fb:nil];
//
//                expect([ARUserManager sharedManager].currentUser).willNot.beNil();
//
//                User *currentUser = [[ARUserManager sharedManager] currentUser];
//                expect(currentUser.userID).to.equal(ARUserManager.stubUserID);
//                expect(currentUser.email).to.equal(ARUserManager.stubUserEmail);
//                expect(currentUser.name).to.equal(ARUserManager.stubUserName);
//            });
//
//            it(@"fails and displays an error", ^{
//                id authProviders = [OCMockObject mockForClass:[ARAuthProviders class]];
//                [[[authProviders stub] andDo:^(NSInvocation *invocation) {
//                    void(^failureBlock)(NSError *);
//                    [invocation getArgument:&failureBlock atIndex:3];
//                    failureBlock([NSError errorWithDomain:@"error" code:500 userInfo:nil]);
//                }] getTokenForFacebook:OCMOCK_ANY failure:OCMOCK_ANY];
//
//                id mockAlertView = [OCMockObject mockForClass:[UIAlertView class]];
//                [[mockAlertView expect] setAlertViewStyle:UIAlertViewStyleDefault];
//                [[[mockAlertView stub] andReturn:mockAlertView] alloc];
//                (void)[[[mockAlertView expect] andReturn:mockAlertView]
//                       initWithTitle:@"Couldn’t get Facebook credentials"
//                       message:OCMOCK_ANY
//                       delegate:OCMOCK_ANY
//                       cancelButtonTitle:OCMOCK_ANY
//                       otherButtonTitles:OCMOCK_ANY, nil];
//                [[mockAlertView expect] show];
//                [controller fb:nil];
//                [mockAlertView verifyWithDelay:1];
//                [mockAlertView stopMocking];
//            });
//        });
//
//        describe(@"twitter", ^{
//            it(@"succeeds", ^{
//                [ARUserManager stubAccessToken:[ARUserManager stubAccessToken] expiresIn:[ARUserManager stubAccessTokenExpiresIn]];
//                [ARUserManager stubMe:[ARUserManager stubUserID] email:[ARUserManager stubUserEmail] name:[ARUserManager stubUserName]];
//
//                expect([ARUserManager sharedManager].currentUser).to.beNil();
//                id authProviders = [OCMockObject mockForClass:[ARAuthProviders class]];
//                [[[authProviders stub] andDo:^(NSInvocation *invocation) {
//                    void(^successBlock)(NSString *token, NSString *secret);
//                    [invocation getArgument:&successBlock atIndex:2];
//                    successBlock(@"twitter token", @"secret");
//                }] getReverseAuthTokenForTwitter:OCMOCK_ANY failure:OCMOCK_ANY];
//
//                [controller twitter:nil];
//                expect([ARUserManager sharedManager].currentUser).willNot.beNil();
//
//                User *currentUser = [[ARUserManager sharedManager] currentUser];
//                expect(currentUser.userID).to.equal(ARUserManager.stubUserID);
//                expect(currentUser.email).to.equal(ARUserManager.stubUserEmail);
//                expect(currentUser.name).to.equal(ARUserManager.stubUserName);
//            });
//
//            it(@"fails and displays an error", ^{
//                id authProviders = [OCMockObject mockForClass:[ARAuthProviders class]];
//                [[[authProviders stub] andDo:^(NSInvocation *invocation) {
//                    void(^failureBlock)(NSError *);
//                    [invocation getArgument:&failureBlock atIndex:3];
//                    failureBlock([NSError errorWithDomain:@"error" code:500 userInfo:nil]);
//                }] getReverseAuthTokenForTwitter:OCMOCK_ANY failure:OCMOCK_ANY];
//
//                id mockAlertView = [OCMockObject mockForClass:[UIAlertView class]];
//                [[mockAlertView expect] setAlertViewStyle:UIAlertViewStyleDefault];
//                [[[mockAlertView stub] andReturn:mockAlertView] alloc];
//                (void)[[[mockAlertView expect] andReturn:mockAlertView]
//                       initWithTitle:@"Couldn’t get Twitter credentials"
//                       message:OCMOCK_ANY
//                       delegate:OCMOCK_ANY
//                       cancelButtonTitle:OCMOCK_ANY
//                       otherButtonTitles:OCMOCK_ANY, nil];
//
//                [[mockAlertView expect] show];
//                [controller twitter:nil];
//                [mockAlertView verifyWithDelay:1];
//                [mockAlertView stopMocking];
//            });
//        });
//    });
//
//    describe(@"forgot password", ^{
//        beforeEach(^{
//            controller = [[ARLoginViewController alloc] init];
//            [controller view]; // loads view and calls viewDidLoad
//        });
//
//        it(@"displays a password reset form", ^{
//            id mockResetPasswordView = [OCMockObject mockForClass:[UIAlertView class]];
//            [[[mockResetPasswordView stub] andReturn:mockResetPasswordView] alloc];
//            (void)[[[mockResetPasswordView expect] andReturn:mockResetPasswordView]
//                   initWithTitle:@"Forgot Password"
//                   message:@"Please enter your email address and we’ll send you a reset link."
//                   delegate:OCMOCK_ANY
//                   cancelButtonTitle:@"Cancel"
//                   otherButtonTitles:@"Send Link", nil];
//            [[[mockResetPasswordView expect] ignoringNonObjectArgs] textFieldAtIndex:0];
//            [[mockResetPasswordView expect] setAlertViewStyle:UIAlertViewStylePlainTextInput];
//            [[mockResetPasswordView expect] setTapBlock:OCMOCK_ANY];
//            [[mockResetPasswordView expect] show];
//
//            [controller forgotPassword:nil];
//            [mockResetPasswordView verify];
//            [mockResetPasswordView stopMocking];
//        });
//
//        it(@"displays a confirmation after sending a password reset email", ^{
//            [ARUserManager stubXappToken:[ARUserManager stubXappToken] expiresIn:[ARUserManager stubXappTokenExpiresIn]];
//            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/users/send_reset_password_instructions" withResponse:@{ @"status": @"success" } andStatusCode:201];
//
//            id mockAlertView = [OCMockObject mockForClass:[UIAlertView class]];
//            [[mockAlertView expect] setAlertViewStyle:UIAlertViewStyleDefault];
//            [[[mockAlertView stub] andReturn:mockAlertView] alloc];
//            (void)[[[mockAlertView expect] andReturn:mockAlertView]
//                   initWithTitle:@"Please Check Your Email"
//                   message:OCMOCK_ANY
//                   delegate:OCMOCK_ANY
//                   cancelButtonTitle:OCMOCK_ANY
//                   otherButtonTitles:OCMOCK_ANY, nil];
//            [[mockAlertView expect] show];
//
//            [controller sendPasswordResetEmail:@"foo@example.com"];
//
//            [mockAlertView verifyWithDelay:1];
//            [mockAlertView stopMocking];
//        });
//
//        it(@"displays an error on failure to send a reset password email", ^{
//            [ARUserManager stubXappToken:[ARUserManager stubXappToken] expiresIn:[ARUserManager stubXappTokenExpiresIn]];
//            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/users/send_reset_password_instructions" withResponse:@{ @"error": @"foobar" } andStatusCode:400];
//
//            id mockAlertView = [OCMockObject mockForClass:[UIAlertView class]];
//            [[mockAlertView expect] setAlertViewStyle:UIAlertViewStyleDefault];
//            [[[mockAlertView stub] andReturn:mockAlertView] alloc];
//            (void)[[[mockAlertView expect] andReturn:mockAlertView]
//                   initWithTitle:@"Couldn’t Reset Password"
//                   message:OCMOCK_ANY
//                   delegate:OCMOCK_ANY
//                   cancelButtonTitle:OCMOCK_ANY
//                   otherButtonTitles:OCMOCK_ANY, nil];
//            [[mockAlertView expect] show];
//
//            [controller sendPasswordResetEmail:@"foo@example.com"];
//
//            [mockAlertView verifyWithDelay:1];
//            [mockAlertView stopMocking];
//        });
//    });
//});
//
//SpecEnd;
