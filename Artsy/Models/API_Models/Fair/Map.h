#import <Mantle/Mantle.h>
#import "ARFeedHostItem.h"

@class Image;

@interface Map : MTLModel <MTLJSONSerializing, ARFeedHostItem>

@property (readonly, nonatomic, copy) NSString *mapID;
@property (readonly, nonatomic, copy) NSArray *features;
@property (readonly, nonatomic, strong) Image *image;

@end
