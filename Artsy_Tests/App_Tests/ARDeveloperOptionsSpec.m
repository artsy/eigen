#import "ARDeveloperOptions.h"

SpecBegin(ARDeveloperOptions);

it(@"transforms the correct syntax to options", ^{
    ARDeveloperOptions *sut = [[ARDeveloperOptions alloc] init];
    NSString *data = @"hello:world\ntest:data";
    [sut updateWithStringContents:data];

    expect(sut[@"hello"]).to.equal(@"world");
    expect(sut[@"test"]).to.equal(@"data");
});

SpecEnd;
