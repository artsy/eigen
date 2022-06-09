#import <Mantle/Mantle.h>

@implementation MTLModel (Dictionary)

+ (instancetype)modelFromDictionary:(NSDictionary *)dictionaryValue
{
    NSError *error = nil;
    id instance = [self modelWithDictionary:dictionaryValue error:&error];
    if (!instance && error) {
        [NSException raise:@"Error creating instance from dictionary" format:@"%@", error];
    }
    return instance;
}

@end
