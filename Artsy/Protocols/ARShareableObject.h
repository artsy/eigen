#import <Foundation/Foundation.h>

@protocol ARShareableObject <NSObject>
- (NSString *)publicArtsyPath;
@property (nonatomic, copy, readonly) NSString *name;
@end
