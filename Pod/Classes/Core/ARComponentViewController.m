#import "ARComponentViewController.h"

@interface ARComponentViewController ()
@property (nonatomic, strong, readonly) RCTBridge *bridge;
@property (nonatomic, strong, readonly) NSString *moduleName;
@end

@implementation ARComponentViewController

- (instancetype)initWithBridge:(RCTBridge *)bridge moduleName:(NSString *)moduleName;
{
  if ((self = [super initWithNibName:nil bundle:nil])) {
    _bridge = bridge;
    _moduleName = moduleName;
  }
  return self;
}

- (void)viewDidLoad;
{
  [super viewDidLoad];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:self.bridge
                                                   moduleName:self.moduleName
                                            initialProperties:nil];
  [self.view addSubview:rootView];
  
  rootView.translatesAutoresizingMaskIntoConstraints = NO;
  [self.view addConstraints:@[
    [NSLayoutConstraint constraintWithItem:rootView
                                 attribute:NSLayoutAttributeTop
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:self.topLayoutGuide
                                 attribute:NSLayoutAttributeBottom
                                multiplier:1
                                  constant:0],
    [NSLayoutConstraint constraintWithItem:rootView
                                 attribute:NSLayoutAttributeLeading
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:self.view
                                 attribute:NSLayoutAttributeLeading
                                multiplier:1
                                  constant:0],
    [NSLayoutConstraint constraintWithItem:rootView
                                 attribute:NSLayoutAttributeTrailing
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:self.view
                                 attribute:NSLayoutAttributeTrailing
                                multiplier:1
                                  constant:0],
    [NSLayoutConstraint constraintWithItem:rootView
                                 attribute:NSLayoutAttributeBottom
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:self.bottomLayoutGuide
                                 attribute:NSLayoutAttributeTop
                                multiplier:1
                                  constant:0]
  ]];
}

@end
