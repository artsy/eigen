#import "ARAnimatedTickView.h"


@interface ARTickViewFrontLayer : CAShapeLayer
@end

SpecBegin(ARAnimatedTickView);

describe(@"initWithSelection", ^{
    it(@"inits with selected", ^{
        ARAnimatedTickView *tickView = [[ARAnimatedTickView alloc] initWithSelection:YES];
        expect(tickView).to.haveValidSnapshotNamed(@"selected");
    });

    it(@"inits with deselected", ^{
        ARAnimatedTickView *tickView = [[ARAnimatedTickView alloc] initWithSelection:NO];
        expect(tickView).to.haveValidSnapshotNamed(@"deselected");
    });
});

describe(@"set selected", ^{
    it(@"changes deselected to selected", ^{
        ARAnimatedTickView *tickView = [[ARAnimatedTickView alloc] initWithSelection:NO];
        [tickView setSelected:YES animated:NO];
        expect(tickView).to.haveValidSnapshotNamed(@"selected");
    });

    it(@"changes selected to deselected", ^{
        ARAnimatedTickView *tickView = [[ARAnimatedTickView alloc] initWithSelection:YES];
        [tickView setSelected:NO animated:NO];
        expect(tickView).to.haveValidSnapshotNamed(@"deselected");
    });
});

describe(@"ARTickViewFrontLayer layer", ^{
    it(@"returns an instance of ARTickViewFrontlayer", ^{
        ARTickViewFrontLayer *frontLayer = [ARTickViewFrontLayer layer];
        expect(frontLayer).to.beKindOf([ARTickViewFrontLayer class]);
    });
});

SpecEnd;
