#import "ARHomeComponentViewController.h"

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

@end
