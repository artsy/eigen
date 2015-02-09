#import "ARPendingOperationViewController.h"
#import "ARSpinner.h"

@interface ARPendingOperationViewController ()

@property (nonatomic, strong) UILabel *label;
@property (nonatomic, strong) ARSpinner *spinner;

@end

@implementation ARPendingOperationViewController

- (instancetype)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self == nil) { return nil; }
    
    _message = @"locating...";
    
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor colorWithWhite:0.0f alpha:0.5f];
    
    self.label = [[ARSerifLabel alloc] init];
    self.label.font = [UIFont serifFontWithSize:24];
    RAC(self.label, text) = RACObserve(self, message);
    self.label.textColor = [UIColor whiteColor];
    self.label.backgroundColor = [UIColor clearColor];
    [self.view addSubview:self.label];
    [self.label alignCenterXWithView:self.view predicate:nil];
    [self.label alignCenterYWithView:self.view predicate:nil];
    
    self.spinner = [[ARSpinner alloc] init];
    self.spinner.spinnerColor = [UIColor whiteColor];
    [self.spinner fadeInAnimated:YES];
    [self.view addSubview:self.spinner];
    [self.spinner alignCenterXWithView:self.view predicate:nil];
    [self.spinner alignTop:@"44" bottom:nil toView:self.label];
    [self.spinner constrainTopSpaceToView:self.label predicate:@"20"];
}

@end
