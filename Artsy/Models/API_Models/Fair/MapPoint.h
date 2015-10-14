#import <Mantle/Mantle.h>

@class Image;


@interface MapPoint : MTLModel <MTLJSONSerializing>

@property (nonatomic, assign, readonly) CGFloat z;
@property (nonatomic, assign, readonly) CGFloat y;
@property (nonatomic, assign, readonly) CGFloat x;

- (CGPoint)coordinateOnImage:(Image *)image;

@end
