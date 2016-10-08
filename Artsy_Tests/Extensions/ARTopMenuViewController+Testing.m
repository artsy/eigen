
#import "ARTopMenuViewController+Testing.h"
#import "ARTopMenuNavigationDataSource.h"
#import "ARTestTopMenuNavigationDataSource.h"

@interface ARTopMenuViewController(TestingPrivateDetails)
@property (readwrite, nonatomic, strong) ARTopMenuNavigationDataSource *navigationDataSource;
@end

@implementation ARTopMenuViewController (Testing)

- (instancetype)initWithStubbedViewControllers
{
    self = [super init];
    // A general data source that acts almost the exact same, but will only
    // return UIViewControllers inside the navigation controllers
    self.navigationDataSource = [[ARStubbedTopMenuNavigationDataSource alloc] init];
    return self;
}

@end
