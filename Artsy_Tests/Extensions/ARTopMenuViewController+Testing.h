#import <Foundation/Foundation.h>


@interface ARTopMenuViewController (Testing)

/// Gives a normal ARTopMenuViewController, but also triggers
/// stubbed networking API calls for the View Controllers
- (instancetype)initWithStubbedNetworking;

@end
