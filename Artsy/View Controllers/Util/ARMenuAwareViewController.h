#import <Foundation/Foundation.h>

@protocol ARMenuAwareViewController <NSObject>

@property (readonly, nonatomic, assign) BOOL hidesToolbarMenu;
@property (readonly, nonatomic, assign) BOOL hidesBackButton;

@optional
@property (readonly, nonatomic, assign) BOOL hidesStatusBarBackground;
@property (readonly, nonatomic, assign) BOOL enableMenuButtons;

@end
