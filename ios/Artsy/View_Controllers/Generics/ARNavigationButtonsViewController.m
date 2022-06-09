#import "ARNavigationButtonsViewController.h"
#import "ARNavigationButton.h"

#import <ORStackView/ORStackView.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

NSString *const ARNavigationButtonClassKey = @"ARNavigationButtonClassKey";
NSString *const ARNavigationButtonHandlerKey = @"ARNavigationButtonHandlerKey";
NSString *const ARNavigationButtonPropertiesKey = @"ARNavigationButtonPropertiesKey";


@interface ARNavigationButtonsViewController ()

@property (nonatomic, strong) ORStackView *view;
@property (nonatomic, strong) NSMapTable *handlersByButton;

@end


@implementation ARNavigationButtonsViewController

@dynamic view;

- (id)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _handlersByButton = [NSMapTable strongToStrongObjectsMapTable];
    _buttonDescriptions = [[NSArray alloc] init];

    return self;
}

- (id)initWithButtonDescriptions:(NSArray *)descriptions
{
    self = [self init];
    if (!self) {
        return nil;
    }

    self.buttonDescriptions = descriptions;

    return self;
}

- (void)loadView
{
    self.view = [[ORStackView alloc] init];
    self.view.bottomMarginHeight = 0;
}

- (void)tappedItem:(ARNavigationButton *)sender
{
    ARNavigationButtonHandler handler = [self.handlersByButton objectForKey:sender];
    handler(sender);
}

- (CGSize)preferredContentSize
{
    CGFloat height = 0;
    for (UIButton *button in self.navigationButtons) {
        height += button.intrinsicContentSize.height;
    }

    return (CGSize){
        .width = CGRectGetWidth(self.parentViewController.view.bounds),
        .height = height};
}

#pragma mark - Properties

- (void)setButtonDescriptions:(NSArray *)buttonDescriptions
{
    // Remove old buttons
    for (UIButton *button in self.navigationButtons) {
        [self.handlersByButton removeObjectForKey:button];
        [self.view removeSubview:button];
    }
    _buttonDescriptions = [NSArray array];
    [self addButtonDescriptions:[buttonDescriptions copy]];
}

- (void)addButtonDescriptions:(NSArray *)buttonDescriptions
{
    [self addButtonDescriptions:buttonDescriptions unique:NO];
}

- (void)addButtonDescriptions:(NSArray *)buttonDescriptions unique:(BOOL)unique
{
    for (NSDictionary *newButtonDescription in buttonDescriptions) {
        if (unique && [_buttonDescriptions detect:^BOOL(id buttonDescription) {
            return [buttonDescription[ARNavigationButtonPropertiesKey] isEqualToDictionary:newButtonDescription[ARNavigationButtonPropertiesKey]];
            }]) {
            continue;
        }

        UIButton *button = [self buttonWithDictionary:newButtonDescription];

        ARNavigationButtonHandler handler = newButtonDescription[ARNavigationButtonHandlerKey];
        if (handler) {
            [self.handlersByButton setObject:handler forKey:button];
            [button addTarget:self action:@selector(tappedItem:) forControlEvents:UIControlEventTouchUpInside];
        }

        [self.view addSubview:button withTopMargin:@"-1" sideMargin:@"0"];
        _buttonDescriptions = [_buttonDescriptions arrayByAddingObject:newButtonDescription];
    }
}

- (NSArray *)navigationButtons
{
    return [self.view.subviews select:^BOOL(UIView *subview) {
        return [subview isKindOfClass:[UIButton class]];
    }];
}

#pragma mark - ARNavigationButtonsViewController

- (UIButton *)buttonWithDictionary:(NSDictionary *)dictionary
{
    Class class = dictionary[ARNavigationButtonClassKey] ?: ARNavigationButton.class;

    NSParameterAssert([class isSubclassOfClass:UIButton.class]);

    UIButton *button = [[class alloc] init];

    NSDictionary *propertiesByKeyPath = dictionary[ARNavigationButtonPropertiesKey];
    [propertiesByKeyPath enumerateKeysAndObjectsUsingBlock:^(NSString *keypath, id value, BOOL *stop) {
        if (value == NSNull.null) {
            value = nil;
        }

        [button setValue:value forKeyPath:keypath];
    }];

    return button;
}

@end
