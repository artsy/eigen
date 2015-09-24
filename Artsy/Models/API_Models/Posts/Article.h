#import <Foundation/Foundation.h>


@interface Article : NSObject <ARShareableObject>

@property (nonatomic, copy, readonly) NSString *name;

- (instancetype)initWithURL:(NSURL *)url name:(NSString *)name NS_DESIGNATED_INITIALIZER;

@end
