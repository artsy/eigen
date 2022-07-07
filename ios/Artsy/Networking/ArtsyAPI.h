#import <Foundation/Foundation.h>

@interface ArtsyAPI : NSObject

/// Gets a temporary Xapp token asyncronously, or if the user has one will run syncronously
+ (void)getXappTokenWithCompletion:(void (^)(NSString *xappToken, NSDate *expirationDate))callback;

/// Gets a temporary Xapp token asyncronously, or if the user has one will run syncronously
+ (void)getXappTokenWithCompletion:(void (^)(NSString *xappToken, NSDate *expirationDate))callback failure:(void (^)(NSError *error))failure;

@end
