#import "ARTheme+HeightAdditions.h"

@interface ARTheme()
- (id)itemWithKey:(id <NSCopying>)key;
@end

@implementation ARTheme (HeightAdditions)

// In FLKLayout because there are dimensions relative to the place where you
// are connecting, it can be natural to have negative margins which
// wouldn't actually subtract from the total amount. So we ensure a negative
// margin does not subtract from the returned value.

- (CGFloat)combinedFloatValueOfLayoutElementsWithKeys:(NSArray *)keys
{
    CGFloat sum = 0;
    for (id <NSCopying> key in keys) {
        NSString *layoutValue = [self itemWithKey:key];
        if (!layoutValue) {
            ARErrorLog(@"Could not find value for %@", key);
        }

        sum += [layoutValue floatValue];
    }
    return sum;
}


@end
