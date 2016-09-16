#import "NSArray+Additions.h"


@implementation NSArray (Additions)

- (void)betweenObjects:(void (^)(id lhs, id rhs))block
{
    for (NSInteger i = 0; i < self.count - 1; i++) {
        block(self[i], self[i + 1]);
    }
}

@end
