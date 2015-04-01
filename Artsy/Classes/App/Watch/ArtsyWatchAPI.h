#import <Foundation/Foundation.h>

@interface ArtsyWatchAPI : NSObject

+ (void)getRequest:(NSURLRequest *)request parseToArrayOfClass:(Class)klass :(void (^)(NSArray *objects, NSURLResponse *response, NSError *error))completionHandler;

@end
