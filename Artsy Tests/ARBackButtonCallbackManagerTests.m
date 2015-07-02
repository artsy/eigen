#import "ARBackButtonCallbackManager.h"


@interface ARBackButtonCallbackManager (Testing)
- (BOOL)canHandleBackForViewController:(UIViewController *)viewController;
@end


@interface TestBlockWasCalledObject : NSObject
- (void)callSomeMethod;
@end


@implementation TestBlockWasCalledObject

- (void)callSomeMethod
{
}

@end

SpecBegin(ARBackButtonCallbackManagerTests);

__block TestBlockWasCalledObject *testBlockWasCalledObject;

dispatch_block_t block = ^{
    [testBlockWasCalledObject callSomeMethod];
};

__block UIViewController *vc;
__block ARBackButtonCallbackManager *manager;

before(^{
    testBlockWasCalledObject = [[TestBlockWasCalledObject alloc] init];
    vc = [[UIViewController alloc] init];
    manager = [[ARBackButtonCallbackManager alloc] initWithViewController:vc andBackBlock:block];
});

it(@"sets viewController and block", ^{
    expect(manager.viewController).to.equal(vc);
    expect(manager.backBlock).to.equal(block);
});

describe(@"canHandleBackForViewController:", ^{
    it(@"returns YES if vcs match", ^{
        expect([manager canHandleBackForViewController:vc]).to.beTruthy();
    });

    it(@"returns NO if vc has been removed", ^{
        vc = nil;
        expect([manager canHandleBackForViewController:vc]).to.beFalsy();
    });

    it(@"returns NO if vcs don't match", ^{
        expect([manager canHandleBackForViewController:[[UIViewController alloc] init]]).to.beFalsy();
    });
});

describe(@"handleBackForViewController:", ^{
    __block id mock;
    before(^{
        mock = [OCMockObject partialMockForObject:testBlockWasCalledObject];
    });

    it(@"does not execute block and returns NO if canHandleBackForViewController: is NO", ^{
        [[mock reject] callSomeMethod];
        vc = nil;
        BOOL handled = [manager handleBackForViewController:vc];
        [mock verify];
        expect(handled).to.beFalsy();
    });

    it(@"executes block and returns YES if canHandleBackForViewController: is YES", ^{
        [[mock expect] callSomeMethod];
        BOOL handled = [manager handleBackForViewController:vc];
        [mock verify];
        expect(handled).to.beTruthy();
    });
});

SpecEnd
