#import <Artsy_UIButtons/ARButtonSubclasses.h>

@class ARFairMapPreview, Map;

@interface ARFairMapPreviewButton : ARClearFlatButton

- (instancetype)initWithFrame:(CGRect)frame map:(Map *)map NS_DESIGNATED_INITIALIZER;

@property (readonly, nonatomic, strong) ARFairMapPreview *mapPreview;

@end