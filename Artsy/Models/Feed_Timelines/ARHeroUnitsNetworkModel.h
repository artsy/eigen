#import <Foundation/Foundation.h>


@interface ARHeroUnitsNetworkModel : NSObject

@property (nonatomic, readonly, copy) NSArray *heroUnits;
@property (nonatomic, readonly) BOOL isLoading;

- (void)downloadHeroUnits;
- (void)getHeroUnitsWithSuccess:(void (^)(NSArray *heroUnits))success
                        failure:(void (^)(NSError *error))failure;

@end
