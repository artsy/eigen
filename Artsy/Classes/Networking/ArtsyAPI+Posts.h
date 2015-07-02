

@interface ArtsyAPI (Posts)

+ (void)getPostForPostID:(NSString *)postID success:(void (^)(Post *post))success failure:(void (^)(NSError *error))failure;

@end
