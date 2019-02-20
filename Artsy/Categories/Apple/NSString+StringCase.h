#import <Foundation/Foundation.h>


@interface NSString (StringCase)

+ (NSString *)humanReadableStringFromClass:(Class)klass;

/// HelloWorldSure -> Hello_world_sure
- (NSString *)fromCamelCaseToDashed;

/// HelloWorldSure -> Hello world sure
- (NSString *)fromCamelCaseToSentence;
@end
