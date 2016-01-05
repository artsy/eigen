#import "ARAppDelegate.h"

SpecBegin(ARAppDelegate);

__block ARAppDelegate *sut;

it(@"doesn't setup a UI during will/did launch process", ^{
    sut = [[ARAppDelegate alloc] init];
    UIApplication *app = (id)[[NSObject alloc] init];

    // not currently set up, but here for future proofing
    if ([sut respondsToSelector:@selector(application:willFinishLaunchingWithOptions:)]){
        [sut application:app willFinishLaunchingWithOptions:@{}];
    }

    if ([sut respondsToSelector:@selector(application:didFinishLaunchingWithOptions:)]){
        [sut application:app didFinishLaunchingWithOptions:@{}];
    }

    expect(sut.window).to.beFalsy();
});

SpecEnd
