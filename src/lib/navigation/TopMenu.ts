/// rename this file, or move it with the bottomtabtype.ts?

import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"

export const moduleForTab = (tab: BottomTabType) => {
  const tabToModuleMap = { home: "Home", search: "Search", inbox: "Inbox", sell: "Sales", profile: "MyProfile" }
  return tabToModuleMap[tab]
}

/// need to do a pop on tab tap. like if im in profile and go to about, tapping profile tab again should pop to main.

//// check if we need the "afterBootstrap" here or if david already did this (// we need to wait for the view to load before we push a deep link VC on startup)

/// what about these?
// - (UIViewController *)childViewControllerForStatusBarHidden
// {
//     return self.rootNavigationController;
// }

// - (UIViewController *)childViewControllerForStatusBarStyle
// {
//     return self.rootNavigationController;
// }

// - (BOOL)shouldAutorotate
// {
//     return [self.rootNavigationController shouldAutorotate];
// }

// - (UIInterfaceOrientationMask)supportedInterfaceOrientations
// {
//     return self.rootNavigationController.supportedInterfaceOrientations ?: ([UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskPortrait);
// }

// - (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation
// {
// return self.rootNavigationController.preferredInterfaceOrientationForPresentation ?: UIInterfaceOrientationPortrait;
// }

////// TODO set this up in RN
//    [ORKeyboardReactingApplication registerForCallbackOnKeyDown:ORDeleteKey:^{
//        [ARTopMenuViewController.sharedController.rootNavigationController popViewControllerAnimated:YES];
//    }];

/////// rageShakeNotificationRecieved
