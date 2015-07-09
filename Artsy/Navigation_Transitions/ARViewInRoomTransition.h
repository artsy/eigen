#import "ARNavigationTransition.h"

/// This Transition will only work on an ArtworkSetVC and a ViewInRoomVC

/// It works by taking the details of the current artwork image, making a new copy of the imageview,
/// adding the copy to the containr's view ( the nav controller ) and adding an animation that fades the old view
/// and resizes the imageview into the new correctly sized shape.


@interface ARViewInRoomTransition : ARNavigationTransition

@end
