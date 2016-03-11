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

// We want to see this in the JSON but not persist it
@property (readonly, nonatomic, copy) NSString *type;


@end
