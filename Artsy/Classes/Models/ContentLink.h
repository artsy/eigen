#import <Mantle/Mantle.h>
#import "ARPostAttachment.h"

@interface ContentLink : MTLModel <ARPostAttachment, MTLJSONSerializing>

@property (readonly, nonatomic, copy) NSString *linkID;
@property (readonly, nonatomic, copy) NSString *thumbnailUrl;
@property (readonly, nonatomic, copy) NSString *url;

@property (readonly, nonatomic) NSInteger thumbnailHeight;
@property (readonly, nonatomic) NSInteger thumbnailWidth;
@property (readonly, nonatomic) NSInteger width;
@property (readonly, nonatomic) NSInteger height;

// Apparently Mantle no longer considers that you might want
// to see something in the JSON but not persist it
// so now we end up with this redundant BS
@property (readonly, nonatomic, copy) NSString *type;


@end
