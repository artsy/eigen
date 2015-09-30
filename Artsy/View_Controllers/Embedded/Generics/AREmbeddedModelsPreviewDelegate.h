#import <Foundation/Foundation.h>

@class AREmbeddedModelsViewController;
@interface AREmbeddedModelsPreviewDelegate : NSObject <UIViewControllerPreviewingDelegate>

- (instancetype)initWithModelVC:(AREmbeddedModelsViewController *)modelVC;

@end
