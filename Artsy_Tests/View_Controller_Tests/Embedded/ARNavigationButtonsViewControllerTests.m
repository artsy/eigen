#import "ARNavigationButtonsViewController.h"
#import "ARNavigationButton.h"
#import "ARButtonWithImage.h"

SpecBegin(ARNavigationButtonsViewController);

describe(@"init", ^{
    __block ARNavigationButtonsViewController *vc;

    it(@"should set the button descriptions", ^{
        vc = [[ARNavigationButtonsViewController alloc] initWithButtonDescriptions:@[]];

        expect(vc.buttonDescriptions).to.equal(@[]);
    });

    it(@"should create buttons based on the descriptions", ^{
        NSArray *buttonDescriptions = @[
            @{
                ARNavigationButtonPropertiesKey: @{
                    @"title": @"foo"
                }
            },
            @{
                ARNavigationButtonPropertiesKey: @{
                    @"title": @"bar"
                }
            }
        ];

        vc = [[ARNavigationButtonsViewController alloc] initWithButtonDescriptions:buttonDescriptions];

        expect(vc.navigationButtons).to.haveCountOf(2);
    });

    it(@"should call block when tapped", ^{
        __block BOOL passed = NO;
        NSArray *buttonDescriptions = @[
            @{
                ARNavigationButtonPropertiesKey: @{
                    @"title": @"foo"
                },
                ARNavigationButtonHandlerKey: ^(UIButton *button) {
                    passed = YES;
                }
            }
        ];

        vc = [[ARNavigationButtonsViewController alloc] initWithButtonDescriptions:buttonDescriptions];
        UIButton *firstButton = vc.navigationButtons.firstObject;
        [firstButton sendActionsForControlEvents:UIControlEventTouchUpInside];

        expect(passed).to.beTruthy();
});
});

describe(@"creating buttons", ^{
    __block ARNavigationButtonsViewController *vc;

    beforeEach(^{
         NSArray *buttonDescriptions = @[
            @{
                ARNavigationButtonPropertiesKey: @{
                    @"backgroundColor": UIColor.redColor
                }
            },
            @{
                ARNavigationButtonClassKey: ARButtonWithImage.class,
                ARNavigationButtonPropertiesKey: @{
                    @"title": NSNull.null,
                }
            }
        ];

        vc = [[ARNavigationButtonsViewController alloc] init];

        vc.buttonDescriptions = buttonDescriptions;
    });

    it(@"should default to ARNavigationButton as the button class", ^{
        UIButton *firstButton = vc.navigationButtons[0];

        expect(firstButton).to.beKindOf(ARNavigationButton.class);
    });

    it(@"should allow different button classes", ^{
        UIButton *secondButton = vc.navigationButtons[1];

        expect(secondButton).to.beKindOf(ARButtonWithImage.class);
    });

    it(@"should set properties of the buttons", ^{
        UIButton *firstButton = vc.navigationButtons.firstObject;

        expect(firstButton.backgroundColor).to.equal(UIColor.redColor);
    });

    it(@"should treat NSNull as nil", ^{
        ARButtonWithImage *secondButton = vc.navigationButtons[1];

        expect(secondButton.title).to.beNil();
    });

    it(@"should allow updates", ^{
        vc.buttonDescriptions = @[];

        expect(vc.navigationButtons).to.beEmpty();

        vc.buttonDescriptions = @[
            @{
                ARNavigationButtonClassKey: ARButtonWithImage.class
            }
        ];

        expect(vc.navigationButtons).to.haveCountOf(1);
    });
});

SpecEnd;
