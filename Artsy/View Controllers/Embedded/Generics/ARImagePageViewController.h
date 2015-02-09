#import <Foundation/Foundation.h>

@interface ARImagePageViewController : UIPageViewController

- (id)initWithTransitionStyle:(UIPageViewControllerTransitionStyle)style navigationOrientation:(UIPageViewControllerNavigationOrientation)navigationOrientation options:(NSDictionary *)options   __attribute__((unavailable("Please use init.")));

@property (nonatomic, copy) NSArray *images;
@property (nonatomic, assign) UIViewContentMode imageContentMode;

- (void)setHidesPageIndicators:(BOOL)hidden;

@end
