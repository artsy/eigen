#import <Foundation/Foundation.h>

@protocol ARMenuAwareViewController <NSObject>

@optional
@property (readonly, nonatomic, assign) BOOL hidesToolbarMenu;
@property (readonly, nonatomic, assign) BOOL hidesNavigationButtons;
@property (readonly, nonatomic, assign) BOOL hidesBackButton;
@property (readonly, nonatomic, assign) BOOL hidesSearchButton;
@property (readonly, nonatomic, assign) BOOL hidesStatusBarBackground;

@end
