#import "AREmbeddedModelPreviewViewController.h"
#import "ARAspectRatioImageView.h"
#import "ARSharingController.h"


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
    if ([self.object isKindOfClass:Artwork.class]) {
        return [self previewActionItemsForArtwork:(Artwork *)self.object];
    }

    return nil;
}

- (NSArray<id<UIPreviewActionItem>> *)previewActionItemsForArtwork:(Artwork *)artwork
{
    NSString *favoriteText = @"Favorite";
    UIPreviewActionStyle favoriteActionStyle = UIPreviewActionStyleDefault;
    if (artwork.heartStatus == ARHeartStatusYes) {
        favoriteText = @"Remove from Favorites";
        favoriteActionStyle = UIPreviewActionStyleDestructive;
    }

    UIPreviewAction *favoriteAction = [UIPreviewAction actionWithTitle:favoriteText style:favoriteActionStyle handler:^(UIPreviewAction *_Nonnull action, UIViewController *_Nonnull previewViewController) {
        [self tappedFavorite];
    }];

    NSString *followText = artwork.artist.followed ? @"Unfollow " : @"Follow ";
    followText = [followText stringByAppendingString:artwork.artist.name];
    UIPreviewActionStyle followActionStyle = artwork.artist.followed ? UIPreviewActionStyleDestructive : UIPreviewActionStyleDefault;

    UIPreviewAction *followArtistAction = [UIPreviewAction actionWithTitle:followText style:followActionStyle handler:^(UIPreviewAction *_Nonnull action, UIViewController *_Nonnull previewViewController) {
        [self tappedFollow];
    }];

    UIPreviewAction *shareAction = [UIPreviewAction actionWithTitle:@"Share" style:UIPreviewActionStyleDefault handler:^(UIPreviewAction *_Nonnull action, UIViewController *_Nonnull previewViewController) {
        [self tappedArtworkShare];
    }];

    return @[ favoriteAction, followArtistAction, shareAction ];
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

#pragma mark - Actions

- (void)tappedFavorite
{
    if ([User isTrialUser]) {
        [ARTrialController presentTrialWithContext:ARTrialContextFavoriteArtwork success:^(BOOL newUser) {
            [self tappedFavorite];
        }];
        return;
    }

    if ([self.object isKindOfClass:Artwork.class]) {
        Artwork *artwork = (Artwork *)self.object;
        BOOL isHearted = artwork.heartStatus == ARHeartStatusYes ? YES : NO;
        [artwork setFollowState:!isHearted success:nil failure:^(NSError *error) {
            [ARNetworkErrorManager presentActiveError:error withMessage:@"Failed to save artwork."];
        }];
    }
}

- (void)tappedFollow
{
    if ([User isTrialUser]) {
        [ARTrialController presentTrialWithContext:ARTrialContextFavoriteArtwork success:^(BOOL newUser) {
            [self tappedFollow];
        }];
        return;
    }

    if ([self.object isKindOfClass:Artwork.class]) {
        Artwork *artwork = (Artwork *)self.object;
        [artwork.artist setFollowState:!artwork.artist.followed success:nil failure:^(NSError *error) {
            [ARNetworkErrorManager presentActiveError:error withMessage:@"Failed to follow artist."];
        }];
    }
}

- (void)tappedArtworkShare
{
    Artwork *artwork = (Artwork *)self.object;

    NSURL *thumbnailImageURL = nil;
    UIImage *image = nil;
    if (artwork.defaultImage.downloadable) {
        thumbnailImageURL = artwork.defaultImage.urlForThumbnailImage;
        image = self.previewImageView.image;
    } else if (artwork.canShareImage) {
        thumbnailImageURL = artwork.defaultImage.urlForThumbnailImage;
    }
    ARSharingController *sharingController = [ARSharingController sharingControllerWithObject:artwork
                                                                            thumbnailImageURL:thumbnailImageURL
                                                                                        image:image];
    [sharingController presentActivityViewControllerFromView:self.view];
}
@end
