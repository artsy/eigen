#import "ARFairSectionViewController.h"
#import "ORStackView+ArtsyViews.h"

@interface ARFairSectionViewController ()
@property (nonatomic, strong) ORStackView *view;
@end

@implementation ARFairSectionViewController

@dynamic view;

- (instancetype)initWithFair:(Fair *)fair
{
    self = [super init];
    if (!self) { return nil; }

    _fair = fair;

    return self;
}

- (void)loadView
{
    self.view = [[ORStackView alloc] init];
    self.view.backgroundColor = [UIColor whiteColor];
    self.view.bottomMarginHeight = 0;
}

- (UILabel *)addPageTitleWithString:(NSString *)title
{
    return [self.view addPageTitleWithString:title];
}

- (void)addSubview:(UIView *)view withTopMargin:(NSString *)margin
{
    [self.view addSubview:view withTopMargin:margin];
}

- (void)addSubview:(UIView *)view withTopMargin:(NSString *)topMargin sideMargin:(NSString *)sideMargin
{
    [self.view addSubview:view withTopMargin:topMargin sideMargin:sideMargin];
}

- (void)addGenericSeparatorWithSideMargin:(NSString *)margin
{
    [self.view addGenericSeparatorWithSideMargin:margin];
}

- (CGSize)preferredContentSize
{
    return (CGSize){
        .width = CGRectGetWidth(self.parentViewController.view.bounds),
        .height = CGRectGetWidth(self.view.bounds)
    };
}

@end
