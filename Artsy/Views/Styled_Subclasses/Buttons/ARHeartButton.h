#import <Artsy_UIButtons/ARButtonSubclasses.h>

#import "ARHeartStatus.h"


@interface ARHeartButton : ARCircularActionButton

@property (nonatomic, assign) ARHeartStatus status;
@property (nonatomic, readonly, getter=isHearted) BOOL hearted;

- (void)setStatus:(ARHeartStatus)hearted;
- (void)setStatus:(ARHeartStatus)hearted animated:(BOOL)animated;
- (void)setHearted:(BOOL)hearted;
- (void)setHearted:(BOOL)hearted animated:(BOOL)animated;

@end
