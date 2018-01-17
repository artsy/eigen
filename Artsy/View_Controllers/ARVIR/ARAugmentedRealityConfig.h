@import UIKit;

@interface ARAugmentedRealityConfig : NSObject
NS_ASSUME_NONNULL_BEGIN

/** The image to display on the wall */
@property (nonatomic, strong, readonly, nullable) UIImage *image;

/** The real-world size of the artwork, in inches */
@property (nonatomic, assign, readonly) CGSize size;

/** The depth of the art canvas. Defaults to 3/4" */
@property (nonatomic, assign, readonly) CGFloat depth;

- (nonnull instancetype)initWithImage:(nonnull UIImage *)image
                                 size:(CGSize)size;

- (nonnull instancetype)initWithImage:(nonnull UIImage *)image
                                 size:(CGSize)size
                                depth:(CGFloat)depth;

NS_ASSUME_NONNULL_END
@end
