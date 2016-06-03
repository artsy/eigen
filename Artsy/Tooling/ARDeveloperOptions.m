#import "ARDeveloperOptions.h"


@interface ARDeveloperOptions ()
@property (nonatomic, strong, readonly) NSDictionary *data;
@end


@implementation ARDeveloperOptions

+ (instancetype)options
{
    static ARDeveloperOptions *_sharedOptions = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        _sharedOptions = [[self alloc] init];
    });

    return _sharedOptions;
}

- (instancetype)init
{
    self = [super init];
    if (!self) return nil;

    NSString *initialPath = [[@"~" stringByExpandingTildeInPath] componentsSeparatedByString:@"Library"][0];
    NSString *dotFilePath = [initialPath stringByAppendingString:@".eigen"];

    if ([[NSFileManager defaultManager] fileExistsAtPath:dotFilePath]) {
        NSString *defaultContents = [NSString stringWithContentsOfFile:dotFilePath encoding:NSASCIIStringEncoding error:nil];
        [self updateWithStringContents:defaultContents];
    }

    return self;
}

- (BOOL)isDeveloper
{
    return _data != nil;
}

- (void)updateWithStringContents:(NSString *)contents
{
    _data = [self dictionaryWithStringContents:contents];
}

- (NSDictionary *)dictionaryFromContentsOfFile:(NSString *)path
{
    NSString *fileContents = [NSString stringWithContentsOfFile:path encoding:NSASCIIStringEncoding error:nil];
    return [self dictionaryFromContentsOfFile:fileContents];
}

- (NSDictionary *)dictionaryWithStringContents:(NSString *)contents
{
    NSMutableDictionary *settings = [NSMutableDictionary dictionary];

    for (NSString *line in [contents componentsSeparatedByCharactersInSet:[NSCharacterSet newlineCharacterSet]]) {
        NSArray *components = [line componentsSeparatedByString:@":"];
        if (components.count != 2) continue;

        NSString *key = components[0];
        id value = components[1];

        if ([value isEqualToString:@"yes"] || [value isEqualToString:@"true"]) {
            value = @(YES);
        }

        else if ([value isEqualToString:@"no"] || [value isEqualToString:@"false"]) {
            value = @(NO);
        }

        settings[key] = value;
    }

    return [NSDictionary dictionaryWithDictionary:settings];
}

- (id)objectForKeyedSubscript:(id<NSCopying>)key
{
    return [self.data objectForKey:key];
}

+ (BOOL)keyExists:(id<NSCopying>)key
{
    return [[self options] objectForKeyedSubscript:key] != nil;
}
@end
