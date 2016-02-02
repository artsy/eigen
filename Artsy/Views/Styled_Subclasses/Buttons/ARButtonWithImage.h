#import <UIKit/UIKit.h>


@interface ARButtonWithImage : UIButton

@property (readwrite, nonatomic, copy) NSString *title;
@property (readwrite, nonatomic, copy) NSString *subtitle;

@property (readwrite, nonatomic, strong) UIFont *titleFont;
@property (readwrite, nonatomic, strong) UIFont *subtitleFont;

@property (readonly, nonatomic, strong) UIImageView *buttonImageView;
@property (readwrite, nonatomic, copy) NSURL *imageURL;
@property (readwrite, nonatomic, copy) NSURL *targetURL;
@property (readwrite, nonatomic, copy) UIImage *image;

@end
