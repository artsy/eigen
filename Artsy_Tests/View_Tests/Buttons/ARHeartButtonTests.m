#import "ARHeartButton.h"

SpecBegin(ARHeartButton);

__block ARHeartButton *_button = nil;

beforeEach(^{
    _button = [[ARHeartButton alloc] init];
    CGFloat buttonSize = [ARCircularActionButton buttonSize];
    _button.frame = CGRectMake(buttonSize / 2, 0, buttonSize, buttonSize);
});

it(@"defaults to disabled", ^{
    expect(_button).will.haveValidSnapshotNamed(@"unhearted");
    expect(_button.enabled).to.beFalsy();
});

describe(@"not hearted", ^{
    beforeEach(^{
        _button.hearted = NO;
    });
    
    it(@"becomes enabled when not hearted", ^{
        expect(_button).will.haveValidSnapshotNamed(@"unhearted");
        expect(_button.enabled).to.beTruthy();
    });

    it(@"doesn't toggle", ^{
        _button.hearted = NO;
        expect(_button).will.haveValidSnapshotNamed(@"unhearted");
        expect(_button.enabled).to.beTruthy();
    });
    
    it(@"toggles", ^{
        _button.hearted = YES;
        expect(_button).will.haveValidSnapshotNamed(@"hearted");
        _button.hearted = NO;
        expect(_button).will.haveValidSnapshotNamed(@"unhearted");
        _button.hearted = YES;
        expect(_button).will.haveValidSnapshotNamed(@"hearted");
        expect(_button.enabled).to.beTruthy();
    });
});

describe(@"hearted", ^{
    beforeEach(^{
        _button.hearted = YES;
    });
    
    it(@"becomes enabled when hearted", ^{
        expect(_button).will.haveValidSnapshotNamed(@"hearted");
        expect(_button.enabled).to.beTruthy();
    });

    it(@"doesn't toggle", ^{
        _button.hearted = YES;
        expect(_button).will.haveValidSnapshotNamed(@"hearted");
        expect(_button.enabled).to.beTruthy();
    });

    it(@"toggles", ^{
        _button.hearted = NO;
        expect(_button).will.haveValidSnapshotNamed(@"unhearted");
        _button.hearted = YES;
        expect(_button).will.haveValidSnapshotNamed(@"hearted");
        expect(_button.enabled).to.beTruthy();
    });
});


SpecEnd;
