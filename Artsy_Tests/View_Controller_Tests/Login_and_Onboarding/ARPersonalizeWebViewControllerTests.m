#import "ARPersonalizeWebViewController.h"

SpecBegin(ARPersonalizeWebViewController);

__block ARPersonalizeWebViewController *sut;

before(^{
    sut = [[ARPersonalizeWebViewController alloc] initWithURL:[NSURL URLWithString:@""]];
});

it(@"allows google urls to pass", ^{
    NSURL *url = [NSURL URLWithString:@"https://google.com/hi"];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];

    id action = [OCMockObject mockForClass:WKNavigationAction.class];
    [[[action stub] andReturnValue:OCMOCK_VALUE(UIWebViewNavigationTypeOther)] navigationType];
    [[[action stub] andReturn:request] request];

    expect([sut shouldLoadNavigationAction:action]).to.beTruthy();
});

it(@"returns no on artsy root urls", ^{
    NSURL *url = [NSURL URLWithString:@"https://staging.artsy.net/"];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];

    id action = [OCMockObject mockForClass:WKNavigationAction.class];
    [[[action stub] andReturnValue:OCMOCK_VALUE(UIWebViewNavigationTypeOther)] navigationType];
    [[[action stub] andReturn:request] request];

    expect([sut shouldLoadNavigationAction:action]).to.beFalsy();
});


SpecEnd
