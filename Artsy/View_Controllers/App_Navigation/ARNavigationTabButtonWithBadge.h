//
//  ARNavigationTabButtonWithBadge.h
//  Artsy
//
//  Created by Brian Beckerle on 4/23/20.
//  Copyright © 2020 Artsy. All rights reserved.
//

#import "ARButtonSubclasses.h"

NS_ASSUME_NONNULL_BEGIN

@interface ARNavigationTabButtonWithBadge : ARNavigationTabButton
@property (nonatomic, strong) UIImage *icon;
- (void)setBadgeCount:(NSUInteger)badgeCount;
@end

NS_ASSUME_NONNULL_END
