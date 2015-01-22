#import "ARSecureTextFieldWithPlaceholder.h"

@interface ARSecureTextFieldWithPlaceholder ()
@property (nonatomic, strong) NSString *actualText;
@property (nonatomic) BOOL secure;
@end

@implementation ARSecureTextFieldWithPlaceholder

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self setupEvents];
    }
    return self;
}

- (void)awakeFromNib
{
    [super awakeFromNib];
    [self setupEvents];
}

- (void)setupEvents
{
    [self addTarget:self action:@selector(editingDidBegin) forControlEvents:UIControlEventEditingDidBegin];
    [self addTarget:self action:@selector(editingDidChange) forControlEvents:UIControlEventEditingChanged];
    [self addTarget:self action:@selector(editingDidFinish) forControlEvents:UIControlEventEditingDidEnd];
}

- (NSString *)text
{
    if (self.editing || self.secure == NO) {
        return [super text];
    } else {
        return self.actualText;
    }
}


- (void)editingDidBegin
{
    self.secureTextEntry = YES;
    self.text = self.actualText;
}

- (void)editingDidChange
{
    self.actualText = self.text;
}

- (void)editingDidFinish
{
    self.secureTextEntry = NO;
    self.actualText = self.text;
    self.text = [self dotPlaceholder];
}

- (NSString *)dotPlaceholder
{
    int index = 0;
    NSMutableString *dots = @"".mutableCopy;
    while (index < self.text.length) {
        [dots appendString:@"•"];
        index++;
    }
    return dots;
}


@end
