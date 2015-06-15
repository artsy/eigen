#import <Mantle/Mantle.h>
#import "ARPostAttachment.h"
#import "ARHasImageBaseURL.h"

@interface PostImage : MTLModel<ARPostAttachment, MTLJSONSerializing, ARHasImageBaseURL>

@property (readonly, nonatomic, copy) NSString *imageID;
@property (readonly, nonatomic, copy) NSString *url;

@property (readonly, nonatomic) CGFloat originalHeight;
@property (readonly, nonatomic) CGFloat originalWidth;
@property (readwrite, nonatomic) CGFloat aspectRatio;

@end
