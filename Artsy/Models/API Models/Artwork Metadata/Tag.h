#import "MTLModel.h"

@interface Tag : MTLModel<MTLJSONSerializing>

@property (readonly, nonatomic, copy) NSString *name;
@property (readonly, nonatomic, copy) NSString *tagID;

@end
