#import "UIDevice-Hardware.h"
#import <UIKit/UIKit.h>


@implementation UIDevice (Hardware)

+ (BOOL)isPad
{
    return UI_USER_INTERFACE_IDIOM() != UIUserInterfaceIdiomPhone;
}

+ (BOOL)isPhone
{
    return UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone;
}

@end
