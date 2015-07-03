#import <Foundation/Foundation.h>

// In the process of phasing this out in favor of ARHasImageURLs
@protocol ARHasImageBaseURL <NSObject>
- (NSString *)baseImageURL;
@end

// Use this:
@protocol ARHasImageURLs <NSObject>
@property (nonatomic, strong, readwrite) NSDictionary *imageURLs;
@end
