#import "NSKeyedUnarchiver+ErrorLogging.h"


@implementation NSKeyedUnarchiver (ErrorLogging)

+ (id)unarchiveObjectWithFile:(NSString *)path exceptionBlock:(id (^)(NSException *))exceptionBlock
{
    @try {
        // We'll be moving persisted models to React Native pretty soon anyway.
        #pragma clang diagnostic push
        #pragma clang diagnostic ignored "-Wdeprecated-declarations"
        return [NSKeyedUnarchiver unarchiveObjectWithFile:path];
        #pragma clang diagnostic pop
    }
    @catch (NSException *exception) {
        return exceptionBlock(exception);
    }
}

@end
