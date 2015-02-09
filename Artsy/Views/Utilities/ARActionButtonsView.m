#import "ARActionButtonsView.h"

NSString * const ARActionButtonImageKey = @"ARActionButtonImageKey";
NSString * const ARActionButtonHandlerKey = @"ARActionButtonHandlerKey";

@interface ARActionButtonsView ()
@property (nonatomic, strong) NSMapTable *handlersByButton;
@end

@implementation ARActionButtonsView

- (void)setActionButtonDescriptions:(NSArray *)actionButtonDescriptions
{
    _handlersByButton = [NSMapTable strongToStrongObjectsMapTable];

    [self.subviews makeObjectsPerformSelector:@selector(removeFromSuperview)];

    _actionButtonDescriptions = [actionButtonDescriptions copy];

    for(NSDictionary *description in actionButtonDescriptions) {
        ARActionButtonHandler handler = description[ARActionButtonHandlerKey];
        NSString *imageName = description[ARActionButtonImageKey];

        ARCircularActionButton *actionButton = [[ARCircularActionButton alloc] initWithImageName:imageName];
        [self.handlersByButton setObject:handler forKey:actionButton];

        [actionButton addTarget:self action:@selector(tappedItem:) forControlEvents:UIControlEventTouchUpInside];
        [self addSubview:actionButton];

        NSInteger index = [actionButtonDescriptions indexOfObject:description];
        if(index == 0){
            [actionButton alignTrailingEdgeWithView:self predicate:nil];

        } else {
            UIView *closestSibling = self.subviews[index-1];
            [actionButton alignAttribute:NSLayoutAttributeTrailing toAttribute:NSLayoutAttributeLeading ofView:closestSibling predicate:@"-10"];
        }
        [actionButton alignTopEdgeWithView:self predicate:nil];
    }
}

- (void)tappedItem:(ARCircularActionButton *)sender
{
    ARActionButtonHandler handler = [self.handlersByButton objectForKey:sender];
    handler(sender);
}

- (CGSize)intrinsicContentSize
{
    return (CGSize){
        .height = [ARCircularActionButton buttonSize],
        .width = UIViewNoIntrinsicMetric
    };
}

@end
