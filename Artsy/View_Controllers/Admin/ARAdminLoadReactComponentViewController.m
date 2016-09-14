#import "ARAdminLoadReactComponentViewController.h"
#import "ARAdminNetworkModel.h"
#import "NSString+StringBetweenStrings.h"
#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <Artsy_UIFonts/UIFont+ArtsyFonts.h>

#import <Emission/AREmission.h>
#import <Emission/ARComponentViewController.h>

#import <ObjectiveSugar/ObjectiveSugar.h>
#import <FLKAutoLayout/FLKAutoLayout.h>


@interface ARAdminLoadReactComponentViewController ()
@property (weak, nonatomic) IBOutlet UITextField *moduleNameTextfield;
@property (weak, nonatomic) IBOutlet UITextView *jsonTextField;
@property (weak, nonatomic) IBOutlet UIView *buttonsView;

@end

@implementation ARAdminLoadReactComponentViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Show some of the Containers we have registered
    ARAdminNetworkModel *model = [[ARAdminNetworkModel alloc] init];
    [model getEmissionFile:@"lib/containers/index.js" completion:^(NSString *file, NSError *error) {
        NSString *containers = [file substringBetween:@"export default {" and:@"}"];
        NSArray *buttonsNames = [containers componentsSeparatedByString:@","];
        NSArray *buttons = [buttonsNames map:^id(NSString *buttonName) {

            ARUnderlineButton *button = [[ARUnderlineButton alloc] initWithFrame:CGRectMake(0, 0, 10, 40)];
            [button setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
            button.titleLabel.font = [UIFont serifFontWithSize:14];

            NSString *title = [[buttonName stringByReplacingOccurrencesOfString:@"\n" withString:@""] stringByReplacingOccurrencesOfString:@" " withString:@""];
            [button setUnderlinedTitle:title underlineRange:NSRangeFromString(title) forState:UIControlStateNormal];
            [button addTarget:self action:@selector(containerTapped:) forControlEvents:UIControlEventTouchUpInside];
            [self.buttonsView addSubview:button];
            return button;
        }];
        [[buttons first] alignLeadingEdgeWithView:self.buttonsView predicate:@"0"];
        [UIView spaceOutViewsHorizontally:buttons predicate:@"10"];
        [UIView alignTopAndBottomEdgesOfViews:[@[self.buttonsView] arrayByAddingObjectsFromArray:buttons]];
    }];
}

- (void)containerTapped:(UIButton *)button
{
    self.moduleNameTextfield.text = button.titleLabel.text;
}

- (IBAction)clearTapped:(id)sender
{
    self.jsonTextField.text = @"";
}

- (IBAction)pushTapped:(id)sender
{
    NSDictionary *JSON = [NSJSONSerialization JSONObjectWithData:[self.jsonTextField.text dataUsingEncoding:NSUnicodeStringEncoding] options:NSJSONReadingAllowFragments error:nil];
    ARComponentViewController *componentVC = [[ARComponentViewController alloc] initWithEmission:[AREmission sharedInstance] moduleName:self.moduleNameTextfield.text initialProperties:JSON];
    [self.navigationController pushViewController:componentVC animated:YES];
}

@end
