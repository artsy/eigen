#import <Foundation/Foundation.h>

@interface Article : NSObject <ARShareableObject>

- (instancetype)initWithURL:(NSURL *)url name:(NSString *)name NS_DESIGNATED_INITIALIZER;

@end
