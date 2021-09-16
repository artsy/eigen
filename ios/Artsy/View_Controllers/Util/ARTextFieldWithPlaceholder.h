#import <UIKit/UIKit.h>


@interface ARTextFieldWithPlaceholder : UITextField

@property (nonatomic, strong) CALayer *baseline;

- (void)setPlaceholder:(NSString *)placeholder withAttributes:(NSDictionary *)attributes;

@end
