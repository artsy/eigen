#import "ARZoomView.h"

@interface ARZoomArtworkImageViewController : UIViewController <ARMenuAwareViewController>

- (instancetype)initWithImage:(Image *)image;

@property (nonatomic, strong, readonly) Image *image;

// ZoomView is given via the transition
@property (readwrite, nonatomic, strong) ARZoomView *zoomView;
@property (readwrite, nonatomic, assign) BOOL suppressZoomViewCreation;

- (void)unconstrainZoomView;

@end
