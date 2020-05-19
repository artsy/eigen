#import "ARHomeComponentViewController.h"

@implementation ARHomeComponentViewController

- (instancetype)init
{
    return [self initWithEmission:nil];
}

- (instancetype)initWithEmission:(nullable AREmission*)emission;
{
    return [super initWithEmission:emission
                        moduleName:@"Home"
                 initialProperties:@{}];
}

- (void)showAlertWithTitle:(NSString *)title message:(NSString *)message;
{
    UIAlertController *alert = [UIAlertController
                                          alertControllerWithTitle:title
                                          message:message
                                          preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *okAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:^(UIAlertAction *_Nonnull action) {
        [self dismissViewControllerAnimated:YES completion:nil];
    }];
    [alert addAction:okAction];
    [self presentViewController:alert animated:YES completion:nil];
}

@end
