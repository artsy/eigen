#import "ARSimpleShowFeedViewController+Konami.h"
#import <ARASCIISwizzle/UIFont+ASCII.h>
#import <ARASCIISwizzle/UIImageView+ASCII.h>
#import "ARTile+ASCII.h"
#import "ARKonamiKeyboardView.h"

static ARKonamiKeyboardView *konamiKeyboardView;


@implementation ARSimpleShowFeedViewController (Konami)

- (void)konami:(DRKonamiGestureRecognizer *)recognizer
{
    if ([recognizer konamiState] == DRKonamiGestureStateRecognized) {
        UIFont.ascii = !UIFont.ascii;
        UIImageView.ascii = !UIImageView.ascii;
        ARTile.ascii = !ARTile.ascii;

        [self.tableView reloadData];
    }
}

- (void)registerKonamiCode
{
    DRKonamiGestureRecognizer *konamiGestureRecognizer = [[DRKonamiGestureRecognizer alloc] initWithTarget:self action:@selector(konami:)];
    konamiKeyboardView = [[ARKonamiKeyboardView alloc] initWithKonamiGestureRecognizer:konamiGestureRecognizer];
    [konamiGestureRecognizer setKonamiDelegate:(id)self];
    [konamiGestureRecognizer setRequiresABEnterToUnlock:YES];
    [self.view addGestureRecognizer:konamiGestureRecognizer];
}

#pragma mark -
#pragma mark DRKonamiGestureProtocol

- (void)DRKonamiGestureRecognizerNeedsABEnterSequence:(DRKonamiGestureRecognizer *)gesture
{
    [self.view addSubview:konamiKeyboardView];
    [konamiKeyboardView becomeFirstResponder];
}

- (void)DRKonamiGestureRecognizer:(DRKonamiGestureRecognizer *)gesture didFinishNeedingABEnterSequenceWithError:(BOOL)error
{
    [konamiKeyboardView resignFirstResponder];
    [konamiKeyboardView removeFromSuperview];
}

@end
