#import "ARImagePageViewController.h"

#import "ARFonts.h"
#import "Image.h"

#import "UIImageView+AsyncImageLoading.h"


@interface ARImageViewController : UIViewController

- (instancetype)initWithImageURL:(NSURL *)imageURL contentMode:(UIViewContentMode)contentMode index:(NSInteger)index;

@property (nonatomic, assign) NSInteger index;
@property (nonatomic, assign) UIViewContentMode contentMode;
@property (nonatomic, strong) NSURL *imageURL;

@end


@interface ARImagePageViewController () <UIPageViewControllerDataSource>
@end


@implementation ARImagePageViewController

- (id)init
{
    self = [super initWithTransitionStyle:UIPageViewControllerTransitionStyleScroll navigationOrientation:UIPageViewControllerNavigationOrientationHorizontal options:nil];
    if (!self) return nil;

    self.dataSource = self;
    _images = [NSArray array];
    _imageContentMode = UIViewContentModeScaleAspectFit;

    UIPageControl *pageControl = [UIPageControl appearanceWhenContainedInInstancesOfClasses:@[[ARImagePageViewController class]]];
    pageControl.pageIndicatorTintColor = [UIColor artsyGrayMedium];
    pageControl.currentPageIndicatorTintColor = [UIColor blackColor];

    return self;
}

- (void)setImages:(NSArray *)images
{
    if (_images.count == 0 && images.count > 0) {
        _images = images.copy;

        NSArray *initialVCs = @[ [self viewControllerForIndex:0] ];
        [self setViewControllers:initialVCs direction:UIPageViewControllerNavigationDirectionForward animated:NO completion:nil];

    } else {
        _images = images.copy;
    }
}

- (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerBeforeViewController:(ARImageViewController *)viewController
{
    if (self.images.count == 1) {
        return nil;
    }

    NSInteger newIndex = viewController.index - 1;
    if (newIndex < 0) {
        newIndex = self.images.count - 1;
    }
    return [self viewControllerForIndex:newIndex];
}

- (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerAfterViewController:(ARImageViewController *)viewController
{
    if (self.images.count == 1) {
        return nil;
    }

    NSInteger newIndex = (viewController.index + 1) % self.images.count;
    return [self viewControllerForIndex:newIndex];
}

- (ARImageViewController *)viewControllerForIndex:(NSInteger)index
{
    if (index < 0 || index >= self.images.count) {
        return nil;
    }

    Image *image = self.images[index];
    ARImageViewController *viewController = [[ARImageViewController alloc] initWithImageURL:image.urlForThumbnailImage contentMode:self.imageContentMode index:index];

    return viewController;
}

- (NSInteger)presentationCountForPageViewController:(UIPageViewController *)pageViewController
{
    return self.images.count;
}

- (NSInteger)presentationIndexForPageViewController:(UIPageViewController *)pageViewController
{
    return [pageViewController.viewControllers.firstObject index];
}

- (void)setHidesPageIndicators:(BOOL)hidden
{
    UIPageControl *pageControl = [[self.view.subviews filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"(class = %@)", [UIPageControl class]]] lastObject];
    pageControl.hidden = hidden;
}

@end


@implementation ARImageViewController

- (instancetype)initWithImageURL:(NSURL *)imageURL contentMode:(UIViewContentMode)contentMode index:(NSInteger)index
{
    self = [super initWithNibName:nil bundle:nil];
    if (!self) {
        return nil;
    }

    self.imageURL = imageURL;
    self.contentMode = contentMode;
    self.index = index;

    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    UIImageView *imageView = [[UIImageView alloc] init];
    imageView.contentMode = self.contentMode;
    imageView.frame = self.view.bounds;

    if ([self.imageURL isFileURL]) {
        imageView.image = [UIImage imageWithData:[NSData dataWithContentsOfURL:self.imageURL]];
    } else {
        [imageView ar_setImageWithURL:self.imageURL];
    }

    // We can't use autoresizing masks in a view controller contained in a UIPageViewController
    // See: http://stackoverflow.com/questions/17729336/uipageviewcontroller-auto-layout-rotation-issue
    imageView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self.view addSubview:imageView];
}

@end
