#import "UIDevice-Hardware.h"
#import <UIKit/UIKit.h>
#import <sys/utsname.h>


@implementation UIDevice (Hardware)

+ (BOOL)isPad
{
    return [[UIDevice currentDevice] userInterfaceIdiom] != UIUserInterfaceIdiomPhone;
}

+ (BOOL)isPhone
{
    return [[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPhone;
}

+ (NSString *)modelName
{
    struct utsname systemInfo;
    uname(&systemInfo);
    return [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
}
@end
