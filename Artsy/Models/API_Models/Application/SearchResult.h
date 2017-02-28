#import <Mantle/Mantle.h>


@interface SearchResult : MTLModel <MTLJSONSerializing>

@property (readonly, nonatomic, copy) NSString *modelString;
@property (readonly, nonatomic, copy) NSString *modelID;
@property (readonly, nonatomic, copy) NSString *displayText;
@property (readonly, nonatomic, copy) NSString *label;
@property (readonly, nonatomic, copy) NSString *searchDetail;
@property (readonly, nonatomic, strong) NSNumber *isPublished;
@property (readonly, nonatomic, copy) NSString *imageURL;

+ (BOOL)searchResultIsSupported:(NSDictionary *)dict;
- (NSURLRequest *)imageRequest;
- (Class)model;
@end
