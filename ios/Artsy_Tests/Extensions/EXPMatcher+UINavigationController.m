#import "EXPMatcher+UINavigationController.h"

EXPMatcherImplementationBegin(haveViewControllerClasses, (NSArray * expectedClasses))
{
    BOOL actualIsNil = (actual == nil);
    BOOL expectedIsNil = (expectedClasses == nil);
    __block NSArray *actualsClassStrings;
    __block NSArray *expectedClassStrings;

    prerequisite(^BOOL {
        return !(actualIsNil || expectedIsNil);
    });

    match(^BOOL {
        NSArray *actuals = [actual viewControllers];
        actualsClassStrings = [actuals map:^id(id object) {
            return NSStringFromClass([object class]);
        }];
        expectedClassStrings = [expectedClasses map:^id(id object) {
            return NSStringFromClass([object class]);
        }];
        BOOL matches = YES;
        for (UIViewController *controller in actuals) {
            NSInteger index = [actuals indexOfObject:controller];
            NSString *expectedClass = NSStringFromClass(expectedClasses[index]);
            if (![NSStringFromClass(controller.class) isEqualToString:expectedClass]) {
                matches = NO;
            }
        }
        return matches;
    });

    failureMessageForTo(^NSString *{
        if (actualIsNil)
            return @"the actual value is nil/null";
        if (expectedIsNil)
            return @"the expected value is nil/null";
        
        return [NSString
                stringWithFormat:@"expected: a view controller structure of %@, "
                "got: a structure of %@",
                [expectedClassStrings join:@" "], [actualsClassStrings join:@" "]];
    });

    failureMessageForNotTo(^NSString *{
        if (actualIsNil)
            return @"the actual value is nil/null";
        if (expectedIsNil)
            return @"the expected value is nil/null";
        return [NSString
               stringWithFormat:@"expected: a view controller to not have a structure of %@, "
               "got: a structure of %@",
               [expectedClassStrings join:@" "], [actualsClassStrings join:@" "]];
    });
}
EXPMatcherImplementationEnd
