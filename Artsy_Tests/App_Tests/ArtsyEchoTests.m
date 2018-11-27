#import "ArtsyEcho.h"
#import "ArtsyEcho+BNMO.h"

SpecBegin(ArtsyEcho)

__block ArtsyEcho *subject;

describe(@"an empty Echo object", ^{
    beforeEach(^{
        subject = [[ArtsyEcho alloc] init];
        subject.features = @{};
        subject.messages = @[];
    });

    describe(@"make offer", ^{
        describe(@"with compatible Exchange version", ^{
            beforeEach(^{
                subject.messages = @[
                                     [[Message alloc] initWithName:@"ExchangeCurrentVersion" content:@"1"]
                                     ];
            });

            it(@"returns NO for isMakeOfferAccessible", ^{
                expect(subject.isMakeOfferAccessible).to.beFalsy();
            });

            it(@"returns YES for isMakeOfferAccessible when enabled", ^{
                subject.features = @{ @"AREnableMakeOfferFlow": [[Feature alloc] initWithName:@"AREnableMakeOfferFlow" state:@(1)] };
                expect(subject.isMakeOfferAccessible).to.beTruthy();
            });
        });

        describe(@"with outdated Exchange version", ^{
            beforeEach(^{
                subject.messages = @[
                                     [[Message alloc] initWithName:@"ExchangeCurrentVersion" content:@"10000000"]
                                     ];
            });

            it(@"returns NO for isMakeOfferAccessible", ^{
                expect(subject.isMakeOfferAccessible).to.beFalsy();
            });

            it(@"returns NO for isMakeOfferAccessible, even when enabled", ^{
                subject.features = @{ @"AREnableMakeOfferFlow": [[Feature alloc] initWithName:@"AREnableMakeOfferFlow" state:@(1)] };
                expect(subject.isMakeOfferAccessible).to.beFalsy();
            });
        });
    });
});

SpecEnd
