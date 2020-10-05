#import <Foundation/Foundation.h>

@class ARNavigationController;


@interface ARTopMenuNavigationDataSource : NSObject

- (ARNavigationController *)navigationControllerForTabType:(NSString *)tabType;

@end
