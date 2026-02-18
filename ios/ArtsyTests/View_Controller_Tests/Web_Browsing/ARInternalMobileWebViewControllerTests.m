#import "AROptions.h"
#import "ARInternalMobileWebViewController.h"
#import "ARUserManager+Stubs.h"
#import "ARUserManager.h"
#import "ARNetworkConstants.h"
#import "ARInternalShareValidator.h"
#import "AREmission.h"
#import "ARAppDelegateHelper+Testing.h"


static WKNavigationAction *StubNavActionForRequest(NSURLRequest *request, WKNavigationType type)
{
    id action = [OCMockObject mockForClass:WKNavigationAction.class];
    [[[action stub] andReturnValue:OCMOCK_VALUE(type)] navigationType];
    [[[action stub] andReturn:request] request];
    return action;
}


@interface ARInternalMobileWebViewController (Testing)

@property (nonatomic, strong) ARInternalShareValidator *shareValidator;
- (NSURLRequest *)requestWithURL:(NSURL *)url;
- (WKNavigationActionPolicy)shouldLoadNavigationAction:(WKNavigationAction *)navigationAction;

@end

SpecBegin(ARInternalMobileViewController);

describe(@"initWithURL", ^{
    describe(@"in production", ^{

        beforeAll(^{
            [[[AREmission sharedInstance] notificationsManagerModule] updateReactState:@{@"webURL": @"https://www.artsy.net"}];
            [ARRouter setup];
        });

        afterAll(^{
            [[[AREmission sharedInstance] notificationsManagerModule] updateReactState:@{@"webURL": @"https://staging.artsy.net"}];
            [ARRouter setup];
        });

        it(@"rewrites the scheme", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"http://www.artsy.net/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://www.artsy.net/foo/bar");
        });

        it(@"with an artsy.net url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"https://artsy.net/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://www.artsy.net/foo/bar");
        });

        it(@"with an m.artsy.net url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"https://m.artsy.net/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://www.artsy.net/foo/bar");
        });

        it(@"with a relative url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://www.artsy.net/foo/bar");
        });

        it(@"with an external artsy.net url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"https://2013.artsy.net"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://2013.artsy.net");
        });

        it(@"with an external url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"http://example.com/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"http://example.com/foo/bar");
        });

        describe(@"on ipad", ^{
            beforeEach(^{
                [ARTestContext stubDevice:ARDeviceTypePad];
            });

            afterEach(^{
                [ARTestContext stopStubbing];
            });

            it(@"with a relative url", ^{
                ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"/foo/bar"]];
                expect([controller currentURL].absoluteString).to.equal(@"https://www.artsy.net/foo/bar");
            });
        });
    });

    describe(@"in staging", ^{

        it(@"rewrites the scheme", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"http://staging.artsy.net/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://staging.artsy.net/foo/bar");
        });

        it(@"with an artsy.net url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"https://artsy.net/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://staging.artsy.net/foo/bar");
        });

        it(@"with an m-staging.artsy.net url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"https://m-staging.artsy.net/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://staging.artsy.net/foo/bar");
        });

        it(@"with a relative url", ^{
            ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"/foo/bar"]];
            expect([controller currentURL].absoluteString).to.equal(@"https://staging.artsy.net/foo/bar");
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

describe(@"authenticated", ^{
    beforeEach(^{
        [ARUserManager stubAndSetupUser];
    });

    afterEach(^{
        [ARUserManager clearUserData];
    });

    it(@"injects an X-Auth-Token header in requests", ^{
        ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"http://www.artsy.net/"]];
        NSURLRequest *request = [controller requestWithURL:controller.currentURL];
        expect([request valueForHTTPHeaderField:ARAuthHeader]).toNot.beNil();
    });

    it(@"doesn't leak X-Auth-Token to non-Artsy domains", ^{
        ARInternalMobileWebViewController *controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@"http://example.com/"]];
        NSURLRequest *request = [controller requestWithURL:controller.currentURL];
        expect([request valueForHTTPHeaderField:ARAuthHeader]).to.beNil();
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
            ARAppDelegateHelper *delegate = [[ARAppDelegateHelper alloc] init];
            [ARAppDelegateHelper setSharedInstanceForTesting:delegate];
            controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@""]];
        });

        afterAll(^{
            [ARAppDelegateHelper setSharedInstanceForTesting:nil];
        });

        it(@"handles a non-native internal link being clicked", ^{
            NSURLRequest *request = [controller requestWithURL:[NSURL URLWithString:@"/something/andy-warhol-skull"]];
            id action = StubNavActionForRequest(request, WKNavigationTypeLinkActivated);
            expect([controller shouldLoadNavigationAction:action]).to.equal(WKNavigationActionPolicyCancel);
        });

        it(@"handles a native internal link being clicked", ^{
            NSURLRequest *request = [controller requestWithURL:[NSURL URLWithString:@"/artwork/andy-warhol-skull"]];

            id action = StubNavActionForRequest(request, WKNavigationTypeLinkActivated);
            expect([controller shouldLoadNavigationAction:action]).to.beFalsy();
        });

        it(@"handles an external link being clicked (via a browser)", ^{
            NSURLRequest *request = [controller requestWithURL:[NSURL URLWithString:@"http://example.com"]];

            id action = StubNavActionForRequest(request, WKNavigationTypeLinkActivated);
            expect([controller shouldLoadNavigationAction:action]).to.beFalsy();
        });

        it(@"doesn't handle non-link requests", ^{
            NSURLRequest *request = [controller requestWithURL:[NSURL URLWithString:@"http://example.com"]];

            id action = StubNavActionForRequest(request, WKNavigationTypeFormSubmitted);
            expect([controller shouldLoadNavigationAction:action]).to.beTruthy();
        });

        it(@"doesn't handle a link with an non-http protocol", ^{
            NSURLRequest *request = [controller requestWithURL:[NSURL URLWithString:@"ftp://example.com"]];

            id action = StubNavActionForRequest(request, WKNavigationTypeLinkActivated);
            expect([controller shouldLoadNavigationAction:action]).to.equal(WKNavigationActionPolicyCancel);
        });
    });
});

describe(@"sharing", ^{
    __block ARInternalMobileWebViewController *controller;
    __block id shareValidator;

    beforeEach(^{
        controller = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:@""]];
        ARAppDelegateHelper *delegate = [[ARAppDelegateHelper alloc] init];
        [ARAppDelegateHelper setSharedInstanceForTesting:delegate];
        shareValidator = [OCMockObject niceMockForClass:[ARInternalShareValidator class]];
        controller.shareValidator = shareValidator;
    });

    afterAll(^{
        [ARAppDelegateHelper setSharedInstanceForTesting:nil];
    });


    it(@"redirects sharing link taps to the shareValidator", ^{
        [[[shareValidator stub] andReturnValue:@(YES)] isSocialSharingURL:OCMOCK_ANY];
        [[[shareValidator expect] ignoringNonObjectArgs] shareURL:OCMOCK_ANY inView:OCMOCK_ANY frame:CGRectNull];

        id action = StubNavActionForRequest(nil, WKNavigationTypeLinkActivated);
        [controller shouldLoadNavigationAction:action];

        [shareValidator verify];
    });

    it(@"returns NO when asked to start loading sharing request", ^{
        [[[shareValidator stub] andReturnValue:@(YES)] isSocialSharingURL:OCMOCK_ANY];

        id action = StubNavActionForRequest(nil, WKNavigationTypeLinkActivated);
        expect([controller shouldLoadNavigationAction:action]).to.beFalsy();
    });
});

SpecEnd;
