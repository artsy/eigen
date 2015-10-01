#import "AREmbeddedModelPreviewViewController.h"
#import "ARAspectRatioImageView.h"


@interface AREmbeddedModelPreviewViewController ()

@property (nonatomic, strong, readwrite) id object;
@property (nonatomic, strong, readwrite) UIImageView *previewImageView;

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

- (void)updateWithCell:(UICollectionViewCell *)cell
{
    id object = self.object;

    if (!self.previewImageView) {
        UIImageView *previewImageView = [[UIImageView alloc] initWithFrame:self.view.bounds];
        previewImageView.contentMode = UIViewContentModeScaleAspectFit;
        [self.view addSubview:previewImageView];
        [previewImageView alignToView:self.view];
        self.previewImageView = previewImageView;
    }

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

    [self.previewImageView ar_setImageWithURL:url placeholderImage:image];
}

- (NSArray<id<UIPreviewActionItem>> *)previewActionItems
{
    UIPreviewAction *favoriteAction = [UIPreviewAction actionWithTitle:@"Heart" style:UIPreviewActionStyleDefault handler:^(UIPreviewAction *_Nonnull action, UIViewController *_Nonnull previewViewController) {
        [self tappedFavorite:previewViewController];
    }];

    return @[ favoriteAction ];
}

- (void)tappedFavorite:(id)sender
{
    if ([User isTrialUser]) {
        [ARTrialController presentTrialWithContext:ARTrialContextFavoriteArtwork success:^(BOOL newUser) {
            [self tappedFavorite:sender];
        }];
        return;
    }

    if ([self.object isKindOfClass:Artwork.class]) {
        Artwork *artwork = (Artwork *)self.object;

        [artwork setFollowState:!artwork.heartStatus success:^(id json) {

        } failure:^(NSError *error) {
            [ARNetworkErrorManager presentActiveError:error withMessage:@"Failed to save artwork."];
        }];
    }
}

- (CGSize)preferredContentSize
{
    if (self.previewImageView.image) {
        return self.previewImageView.image.size;
    }

    if ([self.object respondsToSelector:@selector(defaultImage)]) {
        Image *image = [self.object defaultImage];
        return CGSizeMake(image.originalWidth, image.originalHeight);
    }

    return CGSizeMake(400, 400);
}

@end
