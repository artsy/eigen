#import "ARHomeComponentViewController.h"
#import <React/RCTRootView.h>

@implementation ARHomeComponentViewController

- (instancetype)initWithEmission:(AREmission *)emission;
{
  return [super initWithEmission:emission moduleName:@"Home" initialProperties:nil];
}

- (NSLayoutConstraint *)topLayoutConstraintWithRootView:(UIView *)rootView;
{
  return [NSLayoutConstraint constraintWithItem:rootView
                                      attribute:NSLayoutAttributeTop
                                      relatedBy:NSLayoutRelationEqual
                                         toItem:self.view
                                      attribute:NSLayoutAttributeTop
                                     multiplier:1
                                       constant:0];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
    RCTRootView *rootView = self.view.subviews.firstObject;
    [rootView setAppProperties:@{ @"trigger1pxScrollHack": @YES }];
}

- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
    
    RCTRootView *rootView = self.view.subviews.firstObject;
    [rootView setAppProperties:@{ @"trigger1pxScrollHack": @NO }];
}

@end
