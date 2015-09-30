#import <FLKAutoLayout/UIView+FLKAutoLayout.h>;
#import "ARCollapsableTextView.h"


static NSAttributedString *AttributedStringForString(NSString *string)
{
    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineSpacing:3];
    [paragraphStyle setLineBreakMode:NSLineBreakByWordWrapping];

    return [[NSAttributedString alloc] initWithString:string
                                           attributes:@{NSParagraphStyleAttributeName : paragraphStyle}];
}

SpecBegin(ARCollapsableTextView);

__block ARCollapsableTextView *subject;
__block UIViewController *hostVC;

before(^{
    hostVC = [[UIViewController alloc] init];
    subject = [[ARCollapsableTextView alloc] init];
    subject.frame = CGRectMake(20, 20, 200, 30);
    [hostVC.view addSubview:subject];

    [subject alignCenterXWithView:hostVC.view predicate:@""];
    [subject constrainWidth:@"200"];
    [subject alignTopEdgeWithView:hostVC.view predicate:@"20"];

    [hostVC ar_presentWithFrame:CGRectMake(0, 0, 440, 600)];

    subject.backgroundColor = [UIColor redColor];
});

it(@"calls the callback block", ^{
    __block BOOL ran = NO;
    [subject setExpansionBlock:^(ARCollapsableTextView *textView) {
        ran = YES;
    }];
    [subject openToFullHeightAnimated:NO];
    expect(ran).to.beTruthy();
});

describe(@"when text is shorter than collapsed height", ^{
    before(^{
        subject.attributedText = AttributedStringForString(@"Short String Short String Short    ");
    });

    it(@"looks correct" , ^{
        expect(hostVC).to.haveValidSnapshot();
    });
});


describe(@"text is taller than collapsed height", ^{
    before(^{
        NSString *longString = @"Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String ";
        subject.attributedText = AttributedStringForString(longString);
    });

    describe(@"before expansion", ^{
        it(@"looks correct" , ^{
            expect(hostVC).to.haveValidSnapshot();
        });
    });

    describe(@"after expansion", ^{
        before(^{
            subject.expansionBlock = ^(ARCollapsableTextView *textView) {
                [hostVC viewDidLayoutSubviews];
            };

            [subject openToFullHeightAnimated:NO];
        });

        it(@"looks correct" , ^{
            expect(hostVC).to.haveValidSnapshot();
        });
    });

});

SpecEnd;
