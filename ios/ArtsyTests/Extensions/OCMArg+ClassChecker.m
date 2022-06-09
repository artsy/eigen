#import "OCMArg+ClassChecker.h"


@implementation OCMArg (ClassChecker)

+ (id)checkForClass:(Class)klass
{
    return [self checkWithBlock:^BOOL(id obj) {
        return [obj isKindOfClass:klass];
    }];
}

@end
