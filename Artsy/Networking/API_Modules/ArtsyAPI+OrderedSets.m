#import "ArtsyAPI+Private.h"


@implementation ArtsyAPI (OrderedSets)

+ (AFHTTPRequestOperation *)getOrderedSetsWithOwnerType:(NSString *)ownerType
                                                  andID:(NSString *)ownerID
                                                success:(void (^)(NSMutableDictionary *orderedSets))success
                                                failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter orderedSetsWithOwnerType:ownerType andID:ownerID];
    return [self getRequest:request parseIntoAnArrayOfClass:[OrderedSet class] success:^(NSArray *orderedSets) {
        NSMutableDictionary *orderedSetsByKey = [[NSMutableDictionary alloc] init];
        for (OrderedSet * orderedSet in orderedSets) {
            NSArray *sets = orderedSetsByKey[orderedSet.key] ?: @[];
            orderedSetsByKey[orderedSet.key] = [sets arrayByAddingObject:orderedSet];
        }
        if (success) {
            success(orderedSetsByKey);
        }
    } failure:failure];
}

+ (AFHTTPRequestOperation *)getOrderedSetWithKey:(NSString *)key
                                         success:(void (^)(OrderedSet *set))success
                                         failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter orderedSetsWithKey:key];
    return [self getRequest:request parseIntoAnArrayOfClass:[OrderedSet class] success:^(NSArray *orderedSets) {
        return success(orderedSets.firstObject);
    } failure:failure];
}

+ (AFHTTPRequestOperation *)getOrderedSetItemsWithKey:(NSString *)key
                                              success:(void (^)(NSArray *sets))success
                                              failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter orderedSetsWithKey:key];
    return [self getRequest:request parseIntoAnArrayOfClass:[OrderedSet class] success:^(NSArray *orderedSets) {
        for (OrderedSet *orderedSet in orderedSets) {
            [orderedSet getItems:success];
        }
    } failure:failure];
}

+ (AFHTTPRequestOperation *)getOrderedSetItemsWithKey:(NSString *)key
                                              andName:(NSString *)name
                                              success:(void (^)(NSArray *items))success
                                              failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter orderedSetsWithKey:key];
    return [self getRequest:request parseIntoAnArrayOfClass:[OrderedSet class] success:^(NSArray *orderedSets) {
        for (OrderedSet *orderedSet in orderedSets) {
            if ([orderedSet.name isEqualToString:name]) {
                [orderedSet getItems:success];
            }
        }
    } failure:failure];
}

+ (AFHTTPRequestOperation *)getOrderedSetItems:(NSString *)orderedSetID
                                      withType:(Class) class
                                       success:(void (^)(NSArray *orderedSets))success
                                       failure:(void (^)(NSError *error))failure
{
    NSURLRequest *request = [ARRouter orderedSetItems:orderedSetID];
    return [self getRequest:request parseIntoAnArrayOfClass:class success:success failure:failure];
}

    + (AFHTTPRequestOperation *)getOrderedSetItems : (NSString *)orderedSetID
                                                     atPage : (NSInteger)page
                                                              withType : (Class) class
                                                                         success : (void (^)(NSArray *orderedSets))success
                                                                                   failure : (void (^)(NSError *error))failure;
{
    NSURLRequest *request = [ARRouter orderedSetItems:orderedSetID atPage:page];
    return [self getRequest:request parseIntoAnArrayOfClass:class success:success failure:failure];
}

@end
