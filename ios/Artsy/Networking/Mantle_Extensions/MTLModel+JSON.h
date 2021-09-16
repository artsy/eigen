#import <Mantle/Mantle.h>


@interface MTLModel (JSON)

/// There isn't a logical one-liner to create a JSON model without jumping to a non-relevant class.

+ (NSArray *)arrayOfModelsWithJSON:(NSArray *)dictionaries;
+ (instancetype)modelWithJSON:(NSDictionary *)JSONdictionary;
+ (instancetype)modelWithJSON:(NSDictionary *)JSONdictionary error:(NSError **)error;

@end
