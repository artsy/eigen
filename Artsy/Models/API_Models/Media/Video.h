#import <Mantle/Mantle.h>


@interface Video : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *videoID;
@property (nonatomic, copy, readonly) NSString *title;
@property (nonatomic, copy, readonly) NSString *subtitle;

@end
