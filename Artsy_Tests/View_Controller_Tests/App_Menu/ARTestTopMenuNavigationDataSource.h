#import "ARTopMenuNavigationDataSource.h"

/// A general data source gives you the choice of your own view controllers
/// inside for testing

@interface ARTestTopMenuNavigationDataSource : ARTopMenuNavigationDataSource

@property (nonatomic, strong, readwrite) UIViewController *controller1;
@property (nonatomic, strong, readwrite) UIViewController *controller2;

@end

/// A data source that replicates the API almost exactly, however it will never
/// return the actual view controllers inside it, only new UIViewControllers

/// This is the default for -ARTopMenuViewController initWithStubbedViewControllers

@interface ARStubbedTopMenuNavigationDataSource : ARTopMenuNavigationDataSource

@end
