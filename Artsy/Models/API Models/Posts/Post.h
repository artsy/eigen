#import "MTLModel.h"

@interface Post : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *postID;
@property (nonatomic, copy, readonly) NSString *title;

@end
