#import "NSKeyedUnarchiver+ErrorLogging.h"


@implementation NSKeyedUnarchiver (ErrorLogging)

+ (id)unarchiveObjectWithFile:(NSString *)path exceptionBlock:(id (^)(NSException *))exceptionBlock
{
    @try {
        return [NSKeyedUnarchiver unarchiveObjectWithFile:path];
    }
    @catch (NSException *exception) {
        return exceptionBlock(exception);
    }
}

@end
