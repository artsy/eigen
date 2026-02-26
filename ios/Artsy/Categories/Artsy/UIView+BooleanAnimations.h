//  UIView+BooleanAnimations.m
//  Credit to AshFurrow: https://github.com/ashfurrow/UIView-BooleanAnimations/blob/master/README.md

#import <UIKit/UIKit.h>

@interface UIView (BooleanDependantAnimation)

/// Optionally runs animations based on a bool, performs block right away if not true
+ (void)animateIf:(BOOL)shouldAnimate duration:(NSTimeInterval)duration :(void (^)(void))animations;

/// Optionally runs animations based on a bool, performs animation + completion right away if not true
+ (void)animateIf:(BOOL)shouldAnimate duration:(NSTimeInterval)duration :(void (^)(void))animations completion:(void (^)(BOOL finished))completion;

/// Only animates if shouldAnimate is true, otherwise will perform block synchronously with options
+ (void)animateIf:(BOOL)shouldAnimate duration:(NSTimeInterval)duration options:(UIViewAnimationOptions)options :(void (^)(void))animations;

/// Only animates with delay and options if shouldAnimate is true, otherwise will perform block synchronously and perform completion in the same manner
+ (void)animateIf:(BOOL)shouldAnimate duration:(NSTimeInterval)duration delay:(NSTimeInterval)delay options:(UIViewAnimationOptions)options :(void (^)(void))animations completion:(void (^)(BOOL finished))completion;

/// Optionally runs spring based animations based on a bool, performs animation right away if not true
+ (void)animateSpringIf:(BOOL)shouldAnimate duration:(NSTimeInterval)duration delay:(NSTimeInterval)delay damping:(CGFloat)damping velocity:(CGFloat)velocity :(void (^)(void))animations;

/// Optionally runs spring based animations based on a bool, performs animation + completion right away if not true
+ (void)animateSpringIf:(BOOL)shouldAnimate duration:(NSTimeInterval)duration delay:(NSTimeInterval)delay damping:(CGFloat)damping velocity:(CGFloat)velocity :(void (^)(void))animations completion:(void (^)(BOOL finished))completion;

@end
