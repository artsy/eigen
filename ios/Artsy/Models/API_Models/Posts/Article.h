#import <Foundation/Foundation.h>

#import "ARShareableObject.h"

@interface Article : NSObject <ARShareableObject>

@property (nonatomic, copy, readonly) NSString *name;

- (instancetype)init NS_UNAVAILABLE;
- (instancetype)initWithURL:(NSURL *)url name:(NSString *)name NS_DESIGNATED_INITIALIZER;

@end
