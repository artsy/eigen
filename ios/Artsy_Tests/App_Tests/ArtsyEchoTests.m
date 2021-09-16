#import "ArtsyEcho.h"

@interface ArtsyEcho(Testing)

- (BOOL)isLocalDiscoCompatible;

@end

SpecBegin(ArtsyEcho)

__block ArtsyEcho *subject;

describe(@"an empty Echo object", ^{
    beforeEach(^{
        subject = [[ArtsyEcho alloc] init];
        subject.features = @{};
        subject.messages = @{};
    });

    pending(@"add any future useful tests here");
});

SpecEnd
