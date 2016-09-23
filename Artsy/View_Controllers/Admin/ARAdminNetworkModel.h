#import <Foundation/Foundation.h>

@interface ARAdminNetworkModel : NSObject

- (void)getEmissionJSON:(NSString *)path completion:(void (^)(NSDictionary *json, NSError *error))completion;

- (void)getEmissionFile:(NSString *)path completion:(void (^)(NSString *fileContents, NSError *error))completion;

@end
