


@interface ARFairPopupViewController : UIViewController

- (instancetype)initWithFair:(Fair *)fair;
- (instancetype)initWithFairTitle:(NSString *)title imageBackgroundURL:(NSURL *)url slug:(NSString *)slug NS_DESIGNATED_INITIALIZER;

@property (weak, nonatomic) IBOutlet UIImageView *backgroundImageView;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UIView *popoverView;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *popoverYCenterConstraint;

- (void)presentOnViewController:(UIViewController *)parent animated:(BOOL)animated;

@end
