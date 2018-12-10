#import <Foundation/Foundation.h>

@protocol SearchResultable <NSObject>
/** Text to show */
@property (readonly, nonatomic, copy) NSString *displayText;
/** Should we show this? */
@property (readonly, nonatomic, strong) NSNumber *isPublished;

@optional

/** Optional URL to route */
@property (readonly, nonatomic, copy) NSString *href;

/** Optional Image URL to use */
@property (readonly, nonatomic, copy) NSString *imageURL;

/** Optional Image URL Request to use */
- (NSURLRequest *)imageRequest;
@end
