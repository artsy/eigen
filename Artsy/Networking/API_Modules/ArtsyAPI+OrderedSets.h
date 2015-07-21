


@interface ArtsyAPI (OrderedSets)

+ (AFHTTPRequestOperation *)getOrderedSetsWithOwnerType:(NSString *)ownerType
                                                  andID:(NSString *)ownerID
                                                success:(void (^)(NSMutableDictionary *orderedSets))success
                                                failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getOrderedSetWithKey:(NSString *)key
                                         success:(void (^)(OrderedSet *set))success
                                         failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getOrderedSetItemsWithKey:(NSString *)key
                                              success:(void (^)(NSArray *items))success
                                              failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getOrderedSetItemsWithKey:(NSString *)key
                                              andName:(NSString *)name
                                              success:(void (^)(NSArray *items))success
                                              failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getOrderedSetItems:(NSString *)orderedSetID
                                      withType:(Class) class
                                       success:(void (^)(NSArray *orderedSets))success
                                       failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getOrderedSetItems:(NSString *)orderedSetID
                                        atPage:(NSInteger)page
                                      withType:(Class) class
                                       success:(void (^)(NSArray *orderedSets))success
                                       failure:(void (^)(NSError *error))failure;

@end
