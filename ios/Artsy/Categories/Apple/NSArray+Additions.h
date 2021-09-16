#import <Foundation/Foundation.h>

@interface NSArray<__covariant ObjectType> (Additions)

/// Enumerates over an array passing pairwise elements at (0,1) (1,2)...(n-1, n).
- (void)betweenObjects:(void (^)(ObjectType lhs, ObjectType rhs))block;

@end
