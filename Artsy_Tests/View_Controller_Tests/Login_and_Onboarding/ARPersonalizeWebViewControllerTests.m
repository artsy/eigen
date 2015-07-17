#import "ARPersonalizeWebViewController.h"

SpecBegin(ARPersonalizeWebViewController);

__block ARPersonalizeWebViewController *sut;

before(^{
    sut = [[ARPersonalizeWebViewController alloc] initWithURL:[NSURL URLWithString:@""]];
});

it(@"allows google urls to pass", ^{
    NSURL *url = [NSURL URLWithString:@"https://google.com/hi"];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    BOOL allowed = [sut webView:nil shouldStartLoadWithRequest:request navigationType:UIWebViewNavigationTypeOther];
    expect(allowed).to.beTruthy();
});

it(@"returns no on artsy root urls", ^{
    NSURL *url = [NSURL URLWithString:@"https://staging.artsy.net/"];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    BOOL allowed = [sut webView:nil shouldStartLoadWithRequest:request navigationType:UIWebViewNavigationTypeOther];
    expect(allowed).to.beFalsy();
});

it(@"is positioned correctly", ^{
    [ARTestContext stubDevice:ARDeviceTypePad];
    [sut ar_presentWithFrame:[UIScreen mainScreen].bounds];
    expect(sut).to.haveValidSnapshot();
    [ARTestContext stopStubbing];
});


SpecEnd
