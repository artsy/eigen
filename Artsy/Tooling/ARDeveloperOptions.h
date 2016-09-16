// Per-developer settings in a .eigen file
// accessible like [ARDeveloperOptions options][@"username"];

#import <Foundation/Foundation.h>


@interface ARDeveloperOptions : NSObject

+ (instancetype)options;

- (BOOL)isDeveloper;

- (id)objectForKeyedSubscript:(id<NSCopying>)key;
- (void)updateWithStringContents:(NSString *)contents;
+ (BOOL)keyExists:(id<NSCopying>)key;
@end
