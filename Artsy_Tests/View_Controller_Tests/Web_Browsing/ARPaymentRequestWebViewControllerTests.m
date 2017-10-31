#import "ARPaymentRequestWebViewController.h"

#import <OCMock/OCObserverMockObject.h>

SpecBegin(ARPaymentRequestWebViewController);

it(@"ensures production URLs use https but does not alter the initialURL", ^{
    NSURL *URL = [NSURL URLWithString:@"http://invoicing-demo-partner.artsyinvoicing.com/invoices/42/gUsxioLRJQaBunE73cWMwjfv"];
    ARPaymentRequestWebViewController *controller = [[ARPaymentRequestWebViewController alloc] initWithURL:URL];
    expect(controller.initialURL.scheme).to.equal(@"https");
    expect(controller.originalURL.scheme).to.equal(@"http");
});

it(@"does not change scheme of staging URLs", ^{
    NSURL *URL = [NSURL URLWithString:@"http://invoicing-demo-partner.lewitt-web-public-staging.artsy.net/invoices/42/gUsxioLRJQaBunE73cWMwjfv"];
    ARPaymentRequestWebViewController *controller = [[ARPaymentRequestWebViewController alloc] initWithURL:URL];
    expect(controller.initialURL.scheme).to.equal(@"http");
});

describe(@"an initialized view controller", ^{
    __block NSURL *paymentRequestURL = nil;
    __block ARPaymentRequestWebViewController *controller = nil;
    
    beforeEach(^{
        paymentRequestURL = [NSURL URLWithString:@"http://example.com/invoice"];
        controller = [[ARPaymentRequestWebViewController alloc] initWithURL:paymentRequestURL];
    });
    
    afterEach(^{
        controller = nil;
    });

    it(@"listens for a payment to have been made but doesn’t block the ‘success’ page from rendering", ^{
        id navigationActionMock = [OCMockObject mockForClass:WKNavigationAction.class];
        [[[navigationActionMock stub] andReturnValue:@(WKNavigationTypeOther)] navigationType];
        NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:@"http://example.com/invoice#success"]];
        [[[navigationActionMock stub] andReturn:request] request];
    
        id mock = [OCMockObject partialMockForObject:controller];
        [[mock expect] paymentRequestHasBeenPaid];
    
        expect([controller shouldLoadNavigationAction:navigationActionMock]).to.equal(WKNavigationActionPolicyAllow);
        [mock verify];
    });
    
    describe(@"once a payment has been made", ^{
        it(@"posts a ‘paid’ notification", ^{
            id mock = [OCMockObject observerMock];
            [[NSNotificationCenter defaultCenter] addMockObserver:mock
                                                             name:ARPaymentRequestPaidNotification
                                                           object:nil];
            
            [[mock expect] notificationWithName:ARPaymentRequestPaidNotification
                                         object:controller
                                       userInfo:@{ ARPaymentRequestURLKey: paymentRequestURL }];
            [controller paymentRequestHasBeenPaid];
            
            [mock verify];
            [[NSNotificationCenter defaultCenter] removeObserver:mock];
        });
    });
});

SpecEnd;
