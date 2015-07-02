

@interface ArtsyAPI (Genes)

+ (void)getGeneForGeneID:(NSString *)geneID success:(void (^)(id gene))success failure:(void (^)(NSError *error))failure;
+ (void)getFeaturedLinksForGenesWithSuccess:(void (^)(NSArray *genes))success failure:(void (^)(NSError *error))failure;
+ (void)getFeaturedLinkCategoriesForGenesWithSuccess:(void (^)(NSArray *sets))success failure:(void (^)(NSError *error))failure;
+ (void)getPersonalizeGenesWithSuccess:(void (^)(NSArray *genes))success failure:(void (^)(NSError *error))failure;

@end
