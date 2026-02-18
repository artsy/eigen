#import "ARRouter+RestAPI.h"
#import "AROptions.h"
#import "ARNetworkConstants.h"
#import "ARUserManager+Stubs.h"

SpecBegin(ARRouter);

describe(@"requestForURL", ^{
    describe(@"with auth token", ^{
        beforeEach(^{
            [ARRouter setAuthToken:@"token"];
        });

        afterEach(^{
            [ARRouter setAuthToken:nil];
        });

        it(@"sets router auth token for Artsy URLs", ^{
            NSURLRequest *request = [ARRouter requestForURL:[NSURL URLWithString:@"http://www.artsy.net"]];
            expect([request valueForHTTPHeaderField:ARAuthHeader]).to.equal(@"token");
        });

        it(@"doesn't set auth token for external URLs", ^{
            NSURLRequest *request = [ARRouter requestForURL:[NSURL URLWithString:@"http://example.com"]];
            expect([request valueForHTTPHeaderField:ARAuthHeader]).to.beNil();
        });
    });

    describe(@"with xapp token", ^{
        beforeEach(^{
            [ARRouter setXappToken:@"token"];
        });

        afterEach(^{
            [ARRouter setXappToken:nil];
        });

        it(@"sets router xapp token for Artsy URLs", ^{
            NSURLRequest *request = [ARRouter requestForURL:[NSURL URLWithString:@"http://www.artsy.net"]];
            expect([request valueForHTTPHeaderField:ARXappHeader]).to.equal(@"token");
        });

        it(@"doesn't set xapp token for external URLs", ^{
            NSURLRequest *request = [ARRouter requestForURL:[NSURL URLWithString:@"http://example.com"]];
            expect([request valueForHTTPHeaderField:ARXappHeader]).to.beNil();
        });
    });
});

describe(@"isInternalURL", ^{
    it(@"returns true with a touch link", ^{
        NSURL *url = [[NSURL alloc] initWithString:@"applewebdata://internal"];
        expect([ARRouter isInternalURL:url]).to.beTruthy();
    });

    it(@"returns true with an artsy link", ^{
        NSURL *url = [[NSURL alloc] initWithString:@"artsy://internal"];
        expect([ARRouter isInternalURL:url]).to.beTruthy();
    });

    it(@"returns true with an artsy www", ^{
        NSURL *url = [[NSURL alloc] initWithString:@"http://www.artsy.net/thing"];
        expect([ARRouter isInternalURL:url]).to.beTruthy();
    });

    it(@"returns true for every artsy url", ^{
        NSSet *artsyHosts = [ARRouter artsyHosts];
        for (NSString *host in artsyHosts){
            NSURL *url = [[NSURL alloc] initWithString:NSStringWithFormat(@"%@/some/path", host)];
            expect([ARRouter isInternalURL:url]).to.beTruthy();
        }
    });

    it(@"returns true for artsy subdomains", ^{
        NSURL *url = [[NSURL alloc] initWithString:@"http://anything.artsy.net"];
        expect([ARRouter isInternalURL:url]).to.beTruthy();
    });

    it(@"returns false for external urls", ^{
        NSURL *url = [[NSURL alloc] initWithString:@"http://externalurl.com/path"];
        expect([ARRouter isInternalURL:url]).to.beFalsy();
    });

    it(@"returns true for relative urls", ^{
        NSURL *url = [[NSURL alloc] initWithString:@"/relative/url"];
        expect([ARRouter isInternalURL:url]).to.beTruthy();
    });
});

describe(@"isWebURL", ^{
    it(@"returns true with a http link", ^{
        NSURL *url = [[NSURL alloc] initWithString:@"http://internal"];
        expect([ARRouter isWebURL:url]).to.beTruthy();
    });

    it(@"returns true with a link without a scheme", ^{
        NSURL *url = [[NSURL alloc] initWithString:@"internal"];
        expect([ARRouter isWebURL:url]).to.beTruthy();
    });

    it(@"returns true with a https link", ^{
        NSURL *url = [[NSURL alloc] initWithString:@"https://internal"];
        expect([ARRouter isWebURL:url]).to.beTruthy();
    });

    it(@"returns false for mailto: urls", ^{
        NSURL *url = [[NSURL alloc] initWithString:@"mailto:orta.therox@gmail.com"];
        expect([ARRouter isWebURL:url]).to.beFalsy();
    });
});

describe(@"isBNMORequestURL", ^{
    it(@"returns YES with an orders URL", ^{
        NSURL *url = [NSURL URLWithString:@"/orders/some-bnmo-order-id"];
        expect([ARRouter isBNMORequestURL:url]).to.beTruthy();
    });

    it(@"returns YES with an absolte orders URL", ^{
        // Emission routes relative URLs, but let's make sure it works for absolute URLs, too.
        NSURL *url = [NSURL URLWithString:@"https://artsy.net/orders/some-bnmo-order-id"];
        expect([ARRouter isBNMORequestURL:url]).to.beTruthy();
    });
});

describe(@"User-Agent", ^{
    __block NSString *userAgent = [[NSUserDefaults standardUserDefaults] valueForKey:@"UserAgent"];

    it(@"uses Artsy-Mobile hard-coded in Microgravity", ^{
        expect(userAgent).to.contain(@"Artsy-Mobile/");
    });

    it(@"contains compatibility strings", ^{
        expect(userAgent).to.contain(@"AppleWebKit/");
        expect(userAgent).to.contain(@"KHTML");
    });

    it(@"uses Eigen", ^{
        expect(userAgent).to.contain(@"Eigen/");
    });

    it(@"contains version number", ^{
        expect(userAgent).to.contain([[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"]);
    });

    it(@"contains build number", ^{
        expect(userAgent).to.contain([[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"]);
    });

    it(@"is contained in requests sent out from router", ^{
        NSURLRequest *request = [ARRouter newSystemTimeRequest];
        expect(request.allHTTPHeaderFields[@"User-Agent"]).to.equal(userAgent);
    });
});

describe(@"metaphysics", ^{
    it(@"does not add a role for nil role param", ^{
        NSURLRequest *request = [ARRouter liveSaleStaticDataRequest:@"my-sale" role:nil];
        expect([[NSString alloc] initWithData:request.HTTPBody encoding:NSUTF8StringEncoding]).toNot.contain(@"role:");
    });

    it(@"adds an uppercased role when using the role param", ^{
        NSURLRequest *request = [ARRouter liveSaleStaticDataRequest:@"my-sale" role:@"my_role"];
        expect([[NSString alloc] initWithData:request.HTTPBody encoding:NSUTF8StringEncoding]).to.contain(@"role: MY_ROLE");
    });

});

SpecEnd;
