#ifndef ARMacros_h
#define ARMacros_h

#define ar_keypath(anObject, aKeyPath) ((void)(NO && ((void)anObject.aKeyPath, NO)), @ #aKeyPath)

#endif /* ARMacros_h */
