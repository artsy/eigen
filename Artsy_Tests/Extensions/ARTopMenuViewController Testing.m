
#import "ARTopMenuViewController+Testing.h"
#import "ARTopMenuNavigationDataSource.h"

@interface ARTopMenuViewController(TestingPrivateDetails)
@property (readwrite, nonatomic, strong) ARTopMenuNavigationDataSource *navigationDataSource;
@end

@implementation ARTopMenuViewController (Testing)

- (instancetype)initWithStubbedViewControllers
{
    return [super init];
}

@end
