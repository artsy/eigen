#import "ARQuicksilverSearchBar.h"
#import <objc/runtime.h>


@implementation ARQuicksilverSearchBar

@dynamic upDownDelegate;

- (void)setUpDownDelegate:(id<ARQuicksilverSearchBarDelegate>)upDownDelegate
{
    objc_setAssociatedObject(self, @selector(upDownDelegate), upDownDelegate, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (id<ARQuicksilverSearchBarDelegate>)upDownDelegate
{
    return objc_getAssociatedObject(self, @selector(upDownDelegate));
}

- (NSArray *)keyCommands
{
    UIKeyCommand *upArrow = [UIKeyCommand keyCommandWithInput:UIKeyInputUpArrow modifierFlags:0 action:@selector(upArrow:)];
    UIKeyCommand *downArrow = [UIKeyCommand keyCommandWithInput:UIKeyInputDownArrow modifierFlags:0 action:@selector(downArrow:)];
    UIKeyCommand *returnCommand = [UIKeyCommand keyCommandWithInput:@"\r" modifierFlags:0 action:@selector(returnCommand:)];
    UIKeyCommand *escapeCommand = [UIKeyCommand keyCommandWithInput:UIKeyInputEscape modifierFlags:0 action:@selector(escapeCommand:)];

    return @[ upArrow, downArrow, returnCommand, escapeCommand ];
}

- (void)escapeCommand:(UIKeyCommand *)keyCommand
{
    [self.upDownDelegate searchBarEscapePressed:self];
}

- (void)returnCommand:(UIKeyCommand *)keyCommand
{
    [self.upDownDelegate searchBarReturnPressed:self];
}

- (void)upArrow:(UIKeyCommand *)keyCommand
{
    [self.upDownDelegate searchBarUpPressed:self];
}

- (void)downArrow:(UIKeyCommand *)keyCommand
{
    [self.upDownDelegate searchBarDownPressed:self];
}

@end
