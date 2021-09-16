#import "ARFeedHostItem.h"

#import <Mantle/Mantle.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

@implementation MTLModel (JSON)

+ (NSArray *)arrayOfModelsWithJSON:(NSArray *)dictionaries
{
    return [dictionaries map:^id(NSDictionary *dictionary) {
        return [self modelWithJSON:dictionary];
    }];
}


+ (instancetype)modelWithJSON:(NSDictionary *)JSONdictionary
{
    NSError *error = nil;
    id instance = [self modelWithJSON:JSONdictionary error:&error];
    if (!instance && error) {
        [NSException raise:@"Error creating instance from JSON" format:@"%@", error];
    }
    return instance;
}

+ (instancetype)modelWithJSON:(NSDictionary *)JSONdictionary error:(NSError **)error
{
    id initialObject = [MTLJSONAdapter modelOfClass:self fromJSONDictionary:JSONdictionary error:error];


    // For some feed items we're given the feed item JSON and object it represents
    // in the same JSON structure, to deal with this we allow declaring it as a host object.
    // This means sending the same JSON data to property on the feed item class itself.

    if ([initialObject conformsToProtocol:@protocol(ARFeedHostItem)]) {
        Class secondaryObjectClass = [initialObject hostedObjectClass];
        SEL setSecondaryObject = [initialObject setHostPropertySelector];
        id secondObject = [secondaryObjectClass modelWithJSON:JSONdictionary error:error];

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
        [initialObject performSelector:setSecondaryObject withObject:secondObject];
#pragma clang diagnostic pop
    }

    return initialObject;
}

@end
