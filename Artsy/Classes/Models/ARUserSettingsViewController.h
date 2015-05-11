#import <FODFormKit/FODFormViewController.h>

@interface ARUserSettingsViewController : FODFormViewController <ARMenuAwareViewController>

- (instancetype)initWithUser:(User *)user;

@end
