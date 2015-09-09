#import "ARTabContentView.h"
#import "ARTestTopMenuNavigationDataSource.h"

SpecBegin(ARTabView);

__block UIViewController *outerController, *innerController1, *innerController2;
__block OCMockObject *mockVC1, *mockVC2;
__block ARTabContentView *sut;
__block ARTestTopMenuNavigationDataSource *dataSource;

before(^{
    CGRect frame = CGRectMake(0, 0, 320, 480);

    outerController = [[UIViewController alloc] init];
    innerController1 = [[UIViewController alloc] init];
    innerController1.view.backgroundColor = [UIColor blueColor];
    innerController2 = [[UIViewController alloc] init];
    innerController2.view.backgroundColor = [UIColor redColor];

    dataSource = [[ARTestTopMenuNavigationDataSource alloc] init];
    dataSource.controller1 = innerController1;
    dataSource.controller2 = innerController2;

    sut = [[ARTabContentView alloc] initWithFrame:frame hostViewController:outerController delegate:nil dataSource:dataSource];
    [outerController.view addSubview:sut];

    [sut setCurrentViewIndex:0 animated:NO];
});

it(@"sets current and previous view index", ^{
    [sut setCurrentViewIndex:1 animated:NO];
    expect(sut.currentViewIndex).to.equal(1);
    expect(sut.previousViewIndex).to.equal(0);

    [sut setCurrentViewIndex:0 animated:NO];
    expect(sut.currentViewIndex).to.equal(0);
    expect(sut.previousViewIndex).to.equal(1);
});

describe(@"correctly shows a navigation controller", ^{
    it(@"at first index" , ^{
        expect(outerController).to.haveValidSnapshot();
    });

    it(@"at another index" , ^{
        [sut setCurrentViewIndex:1 animated:NO];
        expect(outerController).to.haveValidSnapshot();
    });

});

it(@"correctly sets the child view controller", ^{
    expect(outerController.childViewControllers).to.contain(innerController1);
    expect(outerController.childViewControllers).toNot.contain(innerController2);
    [sut setCurrentViewIndex:1 animated:NO];
    expect(outerController.childViewControllers).to.contain(innerController1);
    expect(outerController.childViewControllers).to.contain(innerController2);
});

describe(@"sends appearance message to child view controller", ^{
    
    before(^{
        mockVC1 = [OCMockObject partialMockForObject:innerController1];
        mockVC2 = [OCMockObject partialMockForObject:innerController2];
    });
    
    it(@"viewDidLoad", ^{
        UIViewController *newController = [[UIViewController alloc] init];
        OCMockObject *mockVC3 = [OCMockObject partialMockForObject:newController];

        [[mockVC3 expect] viewDidLoad];
        dataSource.controller2 = newController;
        [sut setCurrentViewIndex:1 animated:NO];
        [mockVC3 verify];
    });
    
    it(@"viewWillAppear", ^{
        [[mockVC2 expect] viewWillAppear:NO];
        [sut setCurrentViewIndex:1 animated:NO];
        [mockVC2 verify];
    });

    it(@"viewDidAppear", ^{
        [[mockVC2 expect] viewDidAppear:NO];
        [sut setCurrentViewIndex:1 animated:NO];
        [mockVC2 verify];
    });

    it(@"viewWillDisappear", ^{
        [[mockVC1 expect] viewWillDisappear:NO];
        [sut setCurrentViewIndex:1 animated:NO];
        [mockVC1 verify];
    });

    it(@"viewDidDisappear", ^{
        [[mockVC1 expect] viewDidDisappear:NO];
        [sut setCurrentViewIndex:1 animated:NO];
        [mockVC1 verify];
    });
});

SpecEnd;
