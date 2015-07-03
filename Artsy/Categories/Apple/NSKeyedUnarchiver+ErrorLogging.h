#import <Foundation/Foundation.h>


@interface NSKeyedUnarchiver (ErrorLogging)
+ (id)unarchiveObjectWithFile:(NSString *)path exceptionBlock:(id (^)(NSException *exception))exceptionBlock;
@end
