#import "ARAdminTableViewCell.h"
#import "ARAdminTableViewController.h"

#import "ARFonts.h"

CGFloat ARTableViewCellSettingsHeight = 60;


@implementation ARAdminTableViewCell

CGFloat MainTextVerticalOffset = 4;
CGFloat DetailTextVerticalOffset = 6;

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    BOOL overwriteStyle = [reuseIdentifier isEqualToString:ARTwoLabelCell];
    UITableViewCellStyle usedStyle = overwriteStyle ? UITableViewCellStyleSubtitle : style;

    self = [super initWithStyle:usedStyle reuseIdentifier:reuseIdentifier];
    if (!self) {
        return nil;
    }

    self.useSerifFont = YES;

    UIView *backgroundView = [[UIView alloc] init];
    backgroundView.backgroundColor = [UIColor artsyGrayRegular];
    self.selectedBackgroundView = backgroundView;

    self.textLabel.backgroundColor = [UIColor clearColor];
    self.detailTextLabel.textColor = [UIColor artsyGrayBold];

    return self;
}


- (void)setUseSerifFont:(BOOL)newUseSerifFont
{
    _useSerifFont = newUseSerifFont;

    if (_useSerifFont) {
        self.textLabel.font = [UIFont serifFontWithSize:18];
        self.detailTextLabel.font = [UIFont serifItalicFontWithSize:16];
    } else {
        self.textLabel.font = [UIFont sansSerifFontWithSize:15];
        self.detailTextLabel.font = [UIFont sansSerifFontWithSize:15];
    }
}

- (void)layoutSubviews
{
    [super layoutSubviews];

    if (!self.detailTextLabel) {
        if (_useSerifFont) {
            CGRect frame = self.textLabel.frame;
            frame.size.height -= MainTextVerticalOffset;
            self.textLabel.frame = frame;
            self.textLabel.center = CGPointMake(self.textLabel.center.x, self.textLabel.center.y + MainTextVerticalOffset);
        }
    } else {
        self.detailTextLabel.center = CGPointMake(self.detailTextLabel.center.x, self.detailTextLabel.center.y + DetailTextVerticalOffset);
    }
}

@end
