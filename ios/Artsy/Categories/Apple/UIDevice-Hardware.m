#import "UIDevice-Hardware.h"
#import <UIKit/UIKit.h>
#import <sys/utsname.h>


@implementation UIDevice (Hardware)

+ (BOOL)isPad
{
    return UI_USER_INTERFACE_IDIOM() != UIUserInterfaceIdiomPhone;
}

+ (BOOL)isPhone
{
    return UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone;
}

+ (NSString *)modelName
{
    struct utsname systemInfo;
    uname(&systemInfo);
    return [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
}
@end
