

@interface ARSlideshowView : UIView

/// Create a new slideshow view with an ordered collection of UIImages
- (instancetype)initWithSlides:(NSArray *)slides;

/// Returns `YES` if there are slides left to show
- (BOOL)hasNext;

/// Show the next slide, if any
- (void)next;

@property (nonatomic, assign, readonly) NSInteger index;

@end
