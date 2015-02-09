// Per-developer settings in a .eigen file
// accessible like [ARDeveloperOptions options][@"username"];

@interface ARDeveloperOptions : NSObject

+ (instancetype)options;

- (BOOL)isDeveloper;

- (id)objectForKeyedSubscript:(id <NSCopying>)key;
- (void)updateWithStringContents:(NSString *)contents;

@end
