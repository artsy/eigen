

@interface ARBrowseNetworkModel : NSObject

@property (nonatomic, strong, readonly) NSArray *links;
- (void)getBrowseFeaturedLinks:(void (^)(NSArray *links))success failure:(void (^)(NSError *error))failure;

@end
