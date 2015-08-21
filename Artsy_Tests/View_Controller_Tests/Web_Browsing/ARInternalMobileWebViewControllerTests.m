#import "AROptions.h"
#import "ARInternalMobileWebViewController.h"
#import "ARUserManager+Stubs.h"
#import "ARUserManager.h"
#import "ARNetworkConstants.h"
#import "ARTrialController.h"
#import "ARSwitchBoard.h"
#import "ARInternalShareValidator.h"


@interface ARInternalMobileWebViewController (Testing)

@property (nonatomic, strong) ARInternalShareValidator *shareValidator;
@property (nonatomic, strong) UIWebView *webView;

@end

SpecBegin(ARInternalMobileViewController);

it(@"passes on fair context", ^{
    id fair = [OCMockObject mockForClass:[Fair class]];
    id switchboardMock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
    [[switchboardMock expect] loadURL:OCMOCK_ANY fair:[OCMArg checkWithBlock:^BOOL(id obj) {
        return obj == fair;
    }]];

    ARInternalMobileWebViewController<UIWebViewDelegate> *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"http://artsy.net/foo/bar"]];
    controller.fair = fair;
    
    NSURL *url = [NSURL URLWithString:@"http://artsy.net/foo/bar"];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    [controller webView:controller.webView shouldStartLoadWithRequest:request navigationType:UIWebViewNavigationTypeLinkClicked];
    
    [switchboardMock verify];
    [switchboardMock stopMocking];
    [fair stopMocking];
});

describe(@"initWithURL", ^{
    describe(@"in production", ^{
        beforeEach(^{
            [AROptions setBool:false forOption:ARUseStagingDefault];
        });

        it(@"rewrites the scheme", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"http://m.artsy.net/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://m.artsy.net/foo/bar");
        });

        it(@"with an artsy.net url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"http://artsy.net/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://m.artsy.net/foo/bar");
        });

        it(@"with a relative url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://m.artsy.net/foo/bar");
        });

        it(@"with an external artsy.net url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"https://2013.artsy.net"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://2013.artsy.net");
        });

        it(@"with an external url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"http://example.com/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"http://example.com/foo/bar");
        });
    });

    describe(@"in production on ipad", ^{
        beforeEach(^{
            [AROptions setBool:false forOption:ARUseStagingDefault];
            [ARTestContext stubDevice:ARDeviceTypePad];
        });

        afterEach(^{
            [ARTestContext stopStubbing];
        });

        it(@"with a relative url on ipad", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://artsy.net/foo/bar");
        });
    });

    describe(@"in staging", ^{
        beforeEach(^{
            [AROptions setBool:true forOption:ARUseStagingDefault];
        });

        it(@"rewrites the scheme", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"https://m-staging.artsy.net/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"http://m-staging.artsy.net/foo/bar");
        });

        it(@"with an artsy.net url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"http://staging.artsy.net/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"http://m-staging.artsy.net/foo/bar");
        });

        it(@"with a relative url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"http://m-staging.artsy.net/foo/bar");
        });

        it(@"with an external artsy.net url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"https://2013.artsy.net"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://2013.artsy.net");
        });

        it(@"with an external url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"https://example.com/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://example.com/foo/bar");
        });
    });
});

describe(@"zooming", ^{
    it(@"does not provide a view for zooming", ^{
        ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"/foo/bar"]];
        expect([controller viewForZoomingInScrollView:controller.scrollView]).to.beNil();
    });
});

describe(@"authenticated", ^{
    beforeEach(^{
        [ARUserManager stubAndLoginWithUsername];
    });
    
    afterEach(^{
        [ARUserManager clearUserData];
    });
    
    it(@"injects an X-Auth-Token header in requests", ^{
        ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"http://m.artsy.net/"]];
        NSURLRequest *request = [controller requestWithURL:controller.currentURL];
        expect([request valueForHTTPHeaderField:ARAuthHeader]).toNot.beNil();
    });

    it(@"doesn't leak X-Auth-Token to non-Artsy domains", ^{
        ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"http://example.com/"]];
        NSURLRequest *request = [controller requestWithURL:controller.currentURL];
        expect([request valueForHTTPHeaderField:ARAuthHeader]).to.beNil();
    });

    describe(@"shouldStartLoadWithRequest:navigationType", ^{
        __block ARInternalMobileWebViewController *controller;
        
        beforeEach(^{
            controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@""]];
        });
        
        it(@"doesn't show a trial login/signup view on a request to log_in", ^{
            NSURLRequest *request = [controller requestWithURL:[NSURL URLWithString:@"http://m.artsy.net/log_in"]];
            id mockUser = [OCMockObject mockForClass:[User class]];
            [[[mockUser stub] andReturnValue:OCMOCK_VALUE(NO)] isTrialUser];

            id mock = [OCMockObject partialMockForObject:[ARTrialController instance]];
            [[mock reject] presentTrialWithContext:ARTrialContextNotTrial success:[OCMArg any]];

            id switchboardMock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
            [[switchboardMock reject] loadURL:[OCMArg any] fair:[OCMArg any]];

            expect([controller webView:controller.webView shouldStartLoadWithRequest:request navigationType:UIWebViewNavigationTypeOther]).to.beFalsy();

            [mock verify];
            [switchboardMock verify];

            [mockUser stopMocking];
            [switchboardMock stopMocking];
            [mock stopMocking];
        });
    });
});

describe(@"unauthenticated", ^{
    beforeEach(^{
        [ARUserManager clearUserData];
    });
    
    it(@"doesn't inject an X-Auth-Token header in requests", ^{
        ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"http://example.com/"]];
        NSURLRequest *request = [controller requestWithURL:controller.currentURL];
        expect([request valueForHTTPHeaderField:ARAuthHeader]).to.beNil();
    });

    describe(@"shouldStartLoadWithRequest:navigationType", ^{
        __block ARInternalMobileWebViewController *controller;
        
        beforeEach(^{
            controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@""]];
        });
        
        it(@"handles an internal link being clicked", ^{
            NSURLRequest *request = [controller requestWithURL:[NSURL URLWithString:@"/artwork/andy-warhol-skull"]];
            expect([controller webView:controller.webView shouldStartLoadWithRequest:request navigationType:UIWebViewNavigationTypeLinkClicked]).to.beFalsy();
        });
        
        it(@"handles an external link being clicked (via a browser)", ^{
            NSURLRequest *request = [controller requestWithURL:[NSURL URLWithString:@"http://example.com"]];
            expect([controller webView:controller.webView shouldStartLoadWithRequest:request navigationType:UIWebViewNavigationTypeLinkClicked]).to.beFalsy();
        });

        it(@"doesn't handle non-link requests", ^{
            NSURLRequest *request = [controller requestWithURL:[NSURL URLWithString:@"http://example.com"]];
            expect([controller webView:controller.webView shouldStartLoadWithRequest:request navigationType:UIWebViewNavigationTypeFormSubmitted]).to.beTruthy();
        });

        it(@"doesn't handle a link with an non-http protocol", ^{
            NSURLRequest *request = [controller requestWithURL:[NSURL URLWithString:@"ftp://example.com"]];
            expect([controller webView:controller.webView shouldStartLoadWithRequest:request navigationType:UIWebViewNavigationTypeLinkClicked]).to.beTruthy();
        });

        it(@"shows a trial login/signup view on a request to log_in", ^{
            NSURLRequest *request = [controller requestWithURL:[NSURL URLWithString:@"http://m.artsy.net/log_in"]];
            id mockUser = [OCMockObject mockForClass:[User class]];
            [[[mockUser stub] andReturnValue:OCMOCK_VALUE(YES)] isTrialUser];

            id mock = [OCMockObject partialMockForObject:[ARTrialController instance]];
            [[mock expect] presentTrialWithContext:ARTrialContextNotTrial success:[OCMArg any]];

            id switchboardMock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
            [[switchboardMock reject] loadURL:[OCMArg any] fair:[OCMArg any]];

            expect([controller webView:controller.webView shouldStartLoadWithRequest:request navigationType:UIWebViewNavigationTypeOther]).to.beFalsy();

            [mock verify];
            [switchboardMock verify];

            [mockUser stopMocking];
            [switchboardMock stopMocking];
            [mock stopMocking];
        });

        it(@"shows a trial login/signup view on a request to sign_up", ^{
            NSURLRequest *request = [controller requestWithURL:[NSURL URLWithString:@"http://m.artsy.net/sign_up"]];
            id mockUser = [OCMockObject mockForClass:[User class]];
            [[[mockUser stub] andReturnValue:OCMOCK_VALUE(YES)] isTrialUser];

            id mock = [OCMockObject partialMockForObject:[ARTrialController instance]];
            [[mock expect] presentTrialWithContext:ARTrialContextNotTrial success:[OCMArg any]];

            id switchboardMock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
            [[switchboardMock reject] loadURL:[OCMArg any] fair:[OCMArg any]];

            expect([controller webView:controller.webView shouldStartLoadWithRequest:request navigationType:UIWebViewNavigationTypeOther]).to.beFalsy();

            [mock verify];
            [switchboardMock verify];

            [mockUser stopMocking];
            [switchboardMock stopMocking];
            [mock stopMocking];
        });
    });
});

describe(@"sharing", ^{
    __block ARInternalMobileWebViewController *controller;
    __block id shareValidator;

    beforeEach(^{
        controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@""]];
        shareValidator = [OCMockObject niceMockForClass:[ARInternalShareValidator class]];
        controller.shareValidator = shareValidator;
    });

    it(@"redirects sharing link taps to the shareValidator", ^{
        [[[shareValidator stub] andReturnValue:@(YES)] isSocialSharingURL:OCMOCK_ANY];
        [[[shareValidator expect] ignoringNonObjectArgs] shareURL:OCMOCK_ANY inView:OCMOCK_ANY frame:CGRectNull];

        [controller webView:controller.webView shouldStartLoadWithRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@""]] navigationType:UIWebViewNavigationTypeOther];

        [shareValidator verify];
    });

    it(@"returns NO when asked to start loading sharing request", ^{
        [[[shareValidator stub] andReturnValue:@(YES)] isSocialSharingURL:OCMOCK_ANY];

        BOOL shouldLoad = [controller webView:controller.webView shouldStartLoadWithRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@""]] navigationType:UIWebViewNavigationTypeOther];

        expect(shouldLoad).to.beFalsy();
    });
});

SpecEnd
