


@interface ARFeed : NSObject <UIStateRestoring>

+ (NSSet *)feedItemTypes;

@property (nonatomic, readonly, copy) NSString *cursor;

- (void)getFeedItemsWithCursor:(NSString *)cursor success:(void (^)(NSOrderedSet *parsed))success failure:(void (^)(NSError *error))failure;

@end
