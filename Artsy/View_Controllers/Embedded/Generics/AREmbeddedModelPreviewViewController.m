#import "AREmbeddedModelPreviewViewController.h"
#import "ARAspectRatioImageView.h"

@interface AREmbeddedModelPreviewViewController ()

@property (nonatomic, strong, readwrite) id object;
@property (nonatomic, strong, readwrite) UIImageView *previewImage;

@end

@implementation AREmbeddedModelPreviewViewController

- (instancetype)initWithObject:(id)object
{
    self = [super init];
    if (!self) {
        return nil;
    }
    _object = object;
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    UIImageView *previewImage = [[UIImageView alloc] initWithFrame:self.view.bounds];
    previewImage.contentMode = UIViewContentModeScaleAspectFit;
    [self.view addSubview:previewImage];
    [previewImage alignToView:self.view];

    self.previewImage = previewImage;
}

- (void)updateWithCell:(UICollectionViewCell *)cell
{
    id object = self.object;

    // Any ARArtworkMasonryModule can define their own
    // UICollectionViewSubclass, so ensure it even has an image view
    // and the image might not have loaded yet either.

    UIImage *image = nil;
    if ([cell respondsToSelector:@selector(imageView)]) {
        image = [[(id)cell imageView] image];
    }

    // Take a few best guesses at a good thumbnail

    NSURL *url = nil;
    if ([object respondsToSelector:@selector(largeImageURL)]) {
        url = [object largeImageURL];
    } else if ([object respondsToSelector:@selector(squareImageURL)]) {
        url = [object squareImageURL];
    } else if ([object respondsToSelector:@selector(defaultImage)]) {
        url = [(Image *)[object defaultImage] urlForDetailImage];
    }

    [self.previewImage ar_setImageWithURL:url placeholderImage:image];
}

- (CGSize)preferredContentSize
{
    if (self.previewImage.image) {
        return self.previewImage.image.size;
    }
    
    if ([self.object respondsToSelector:@selector(defaultImage)]) {
        Image *image = [self.object defaultImage];
        return CGSizeMake(image.originalWidth, image.originalHeight);
    }

    return CGSizeMake(400, 400);
}

@end
