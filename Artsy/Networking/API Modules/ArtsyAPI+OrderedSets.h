@interface ArtsyAPI (OrderedSets)

+ (AFJSONRequestOperation *)getOrderedSetsWithOwnerType:(NSString *)ownerType
                                                  andID:(NSString *)ownerID
                                                success:(void (^)(NSMutableDictionary *orderedSets))success
                                                failure:(void (^)(NSError *error))failure;

+ (AFJSONRequestOperation *) getOrderedSetWithKey:(NSString *)key
                                          success:(void (^)(OrderedSet *set))success
                                          failure:(void (^)(NSError *error))failure;

+ (AFJSONRequestOperation *) getOrderedSetItemsWithKey:(NSString *)key
                                               success:(void (^)(NSArray *items))success
                                               failure:(void (^)(NSError *error))failure;

+ (AFJSONRequestOperation *) getOrderedSetItemsWithKey:(NSString *)key
                                               andName:(NSString *)name
                                               success:(void (^)(NSArray *items))success
                                               failure:(void (^)(NSError *error))failure;

+ (AFJSONRequestOperation *)getOrderedSetItems:(NSString *)orderedSetID
                                      withType:(Class)class
                                       success:(void (^)(NSArray *orderedSets))success
                                       failure:(void (^)(NSError *error))failure;

+ (AFJSONRequestOperation *)getOrderedSetItems:(NSString *)orderedSetID
                                        atPage:(NSInteger)page
                                      withType:(Class)class
                                       success:(void (^)(NSArray *orderedSets))success
                                       failure:(void (^)(NSError *error))failure;

@end
