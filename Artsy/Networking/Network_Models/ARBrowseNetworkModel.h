#import <Foundation/Foundation.h>


@interface ARBrowseNetworkModel : NSObject

@property (nonatomic, copy, readonly) NSArray *links;

- (void)getBrowseFeaturedLinks:(void (^)(NSArray *links))success failure:(void (^)(NSError *error))failure;

@end
