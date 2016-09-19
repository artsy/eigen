#import "ARSearchViewController.h"


@interface ARAppSearchViewController : ARSearchViewController

+ (instancetype)sharedSearchViewController;

- (void)setBackgroundImage:(UIImage *)backgroundImage;

- (void)closeSearch:(id)sender;

@end
