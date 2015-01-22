@interface ArtsyAPI (Genes)

+ (void)getGeneForGeneID:(NSString *)geneID success:(void (^)(id gene))success failure:(void (^)(NSError *error))failure;

@end
