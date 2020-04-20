//
//  ARNavigationTabButtonWithBadge.m
//  Artsy
//
//  Created by Brian Beckerle on 4/23/20.
//  Copyright © 2020 Artsy. All rights reserved.
//

#import "ARNavigationTabButtonWithBadge.h"
#import "UIColor+ArtsyColors.h"

@implementation ARNavigationTabButtonWithBadge

- (void)setup;
{
    [super setup];
    [self setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [self setTitleColor:[UIColor whiteColor] forState:UIControlStateSelected];

    // TODO: Clears all on tap. This needs to get more sophisticated, as per
    // https://github.com/artsy/collector-experience/issues/661
    [self addTarget:self action:@selector(clearBadge) forControlEvents:UIControlEventTouchUpInside];
}

- (void)clearBadge;
{
    self.badgeCount = 0;
}

- (void)setBadgeCount:(NSUInteger)badgeCount;
{
    if (badgeCount) {
        [self setImage:nil forState:UIControlStateNormal];
        [self setImage:nil forState:UIControlStateSelected];
        [self setBackgroundImage:[self badgeBackgroundImageWithColor:[UIColor blackColor]] forState:UIControlStateNormal];
        [self setBackgroundImage:[self badgeBackgroundImageWithColor:[UIColor artsyPurpleRegular]] forState:UIControlStateSelected];
        [self setTitle:[NSString stringWithFormat:@"%lu", badgeCount] forState:UIControlStateNormal];
        [self setTitle:[NSString stringWithFormat:@"%lu", badgeCount] forState:UIControlStateSelected];
    } else {
        [self setImage:self.icon forState:UIControlStateNormal];
        [self setImage:self.icon forState:UIControlStateSelected];
        [self setBackgroundImage:nil forState:UIControlStateNormal];
        [self setBackgroundImage:nil forState:UIControlStateSelected];
        [self setTitle:nil forState:UIControlStateNormal];
        [self setTitle:nil forState:UIControlStateSelected];
    }
}

- (void)setIcon:(UIImage *)icon;
{
    _icon = icon;
    [self setImage:_icon forState:UIControlStateNormal];
    [self setImage:_icon forState:UIControlStateSelected];
}

- (UIImage *)badgeBackgroundImageWithColor:(UIColor *)color;
{
    CGSize size = self.bounds.size;
    CGSize circleSize = self.bounds.size;
    circleSize.width /= 2;
    circleSize.height /= 2;
    // We dont want to alter the size of the button so we need to only halve the ellipse size, the button will otherwise resize to the image we return
    UIGraphicsBeginImageContextWithOptions(size, NO, 0);
    [color setFill];
    CGContextFillEllipseInRect(UIGraphicsGetCurrentContext(), CGRectMake(circleSize.width / 2, circleSize.height / 2, circleSize.width, circleSize.height));
    UIImage *backgroundImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return backgroundImage;
}
@end
