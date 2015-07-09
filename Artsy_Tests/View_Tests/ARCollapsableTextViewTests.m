#import "ARCollapsableTextView.h"


@interface ARCollapsableTextView (Tests)
- (void)openToFullHeight;
@property (nonatomic, strong, readonly) NSLayoutConstraint *heightCollapsingConstraint;
@property (nonatomic, strong, readonly) NSLayoutConstraint *fullHeightConstraint;
@end

SpecBegin(ARCollapsableTextView);

__block ARCollapsableTextView *textView;

void (^sharedBefore)(NSString *) = ^void(NSString *string) {
    textView = [[ARCollapsableTextView alloc] init];
    textView.shouldAnimate = NO;
    [textView setFrame:[UIScreen mainScreen].bounds];

    NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc] init];
    [paragraphStyle setLineSpacing:3];
    [paragraphStyle setLineBreakMode:NSLineBreakByWordWrapping];

    NSAttributedString *attributedString = [[NSAttributedString alloc] initWithString:string
                                                                           attributes:@{NSParagraphStyleAttributeName : paragraphStyle}];

    [textView setAttributedText:attributedString];
};

after(^{
    textView = nil;
});

describe(@"text is shorter than collapsed height", ^{
    before(^{
        NSString *shortString = @"Short String Short String Short String Short String Short String Short String Short String Short String Short String";
        sharedBefore(shortString);
    });

    it(@"constrains height to text", ^{
        expect(textView.heightCollapsingConstraint.active).to.beFalsy();
        expect(textView.fullHeightConstraint.active).to.beTruthy();
    });

    it(@"looks correct" , ^{
        expect(textView).to.haveValidSnapshot();
    });
});


describe(@"text is taller than collapsed height", ^{
    before(^{
        NSString *longString = @"Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String Long String ";
        sharedBefore(longString);
    });

    describe(@"before expansion", ^{
        it(@"constrains height to text", ^{
            expect(textView.heightCollapsingConstraint.active).to.beTruthy();
            expect(textView.fullHeightConstraint.active).to.beFalsy();
        });

        it(@"looks correct" , ^{
            expect(textView).to.haveValidSnapshot();
        });
    });

    pending(@"after expansion", ^{
        before(^{
            [textView openToFullHeight];
            [textView setNeedsLayout];
            [textView layoutIfNeeded];
        });

        it(@"constrains height to text", ^{
            expect(textView.heightCollapsingConstraint.active).to.beFalsy();
            expect(textView.fullHeightConstraint.active).to.beTruthy();
        });

        it(@"looks correct" , ^{
            expect(textView).to.haveValidSnapshot();
        });
    });

});

SpecEnd
