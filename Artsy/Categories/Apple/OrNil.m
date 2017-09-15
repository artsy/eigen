#import "OrNil.h"

@implementation NSObject (OrNil)
- (id) orNil { return self; }
@end

@implementation NSNull (OrNil)
- (id)orNil { return nil; }
@end
