#import "ARSplitStackView.h"


@interface ARSplitStackView ()
@end


@implementation ARSplitStackView

- (instancetype)initWithLeftPredicate:(NSString *)left rightPredicate:(NSString *)right
{
    self = [super init];

    ORStackView *leftStack = [[ORStackView alloc] init];
    ORStackView *rightStack = [[ORStackView alloc] init];

    _leftStack = leftStack;
    _rightStack = rightStack;

    [self addSubview:leftStack];
    [self addSubview:rightStack];

    [_leftStack alignLeadingEdgeWithView:self predicate:@"0"];
    [_rightStack alignTrailingEdgeWithView:self predicate:@"0"];

    [self alignAttribute:NSLayoutAttributeTop toAttribute:NSLayoutAttributeTop ofView:_rightStack predicate:@"0"];
    [self alignAttribute:NSLayoutAttributeTop toAttribute:NSLayoutAttributeTop ofView:_leftStack predicate:@"0"];

    //    [self alignAttribute:NSLayoutAttributeBottom toAttribute:NSLayoutAttributeBottom ofView:_rightStack predicate:nil];
    //    [self alignAttribute:NSLayoutAttributeBottom toAttribute:NSLayoutAttributeBottom ofView:_leftStack predicate:nil];

    [_leftStack setAutoresizingMask:UIViewAutoresizingFlexibleBottomMargin];
    [_rightStack setAutoresizingMask:UIViewAutoresizingFlexibleBottomMargin];
    [_leftStack constrainHeightToView:self predicate:@"0@250"];
    [_rightStack constrainHeightToView:self predicate:@"0@250"];
    [_leftStack constrainHeightToView:self predicate:@"<=0@1000"];
    [_rightStack constrainHeightToView:self predicate:@"<=0@1000"];

    if (left) {
        [_leftStack constrainWidth:left];
    }

    if (right) {
        [_rightStack constrainWidth:right];
    }

    _leftStack.bottomMarginHeight = 0;
    _rightStack.bottomMarginHeight = 0;

    return self;
}

//- (CGSize)intrinsicContentSize
//{
//    CGSize leftSize = self.leftStack.intrinsicContentSize;
//    CGSize rightSize = self.rightStack.intrinsicContentSize;
//    return (leftSize.height > rightSize.height) ? leftSize : rightSize;
//}

@end
