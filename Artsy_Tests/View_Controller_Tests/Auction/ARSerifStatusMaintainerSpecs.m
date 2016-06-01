#import <Forgeries/ForgeriesApplication.h>
#import "ARSerifStatusMaintainer.h"

SpecBegin(ARSerifStatusMaintainer);

__block UIApplication *app;
__block ARSerifStatusMaintainer *subject;

before(^{
    app = [[ForgeriesApplication alloc] init];
    subject = [[ARSerifStatusMaintainer alloc] init];
});

describe(@"hidden", ^{
    it(@"changes the hidden to NO", ^{
        app.statusBarHidden = YES;
        [subject viewWillAppear:false app:app];
        expect(app.statusBarHidden).to.equal(NO);
    });

    it(@"sets the hidden back correctly", ^{
        app.statusBarHidden = YES;
        [subject viewWillAppear:NO app:app];
        [subject viewWillDisappear:NO app:app];
        expect(app.statusBarHidden).to.equal(YES);
    });
});

describe(@"status bar", ^{
    it(@"changes the hidden to NO", ^{
        app.statusBarStyle = UIStatusBarStyleLightContent;
        [subject viewWillAppear:NO app:app];
        expect(app.statusBarStyle).to.equal(UIStatusBarStyleDefault);
    });

    it(@"sets the hidden back correctly", ^{
        app.statusBarStyle = UIStatusBarStyleLightContent;
        [subject viewWillAppear:NO app:app];
        [subject viewWillDisappear:NO app:app];
        expect(app.statusBarStyle).to.equal(UIStatusBarStyleLightContent);
    });
});

SpecEnd
