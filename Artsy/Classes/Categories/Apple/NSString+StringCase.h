#import <Foundation/Foundation.h>


@interface NSString (StringCase)

+ (NSString *)humanReadableStringFromClass:(Class)klass;

- (NSString *)fromCamelCaseToDashed;

@end
