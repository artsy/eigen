#pragma mark -
#pragma mark Context specific macros

#ifdef DEBUG
#define ARLogInfo(frmt, ...) NSLog((@"[INFO] " frmt), ##__VA_ARGS__)
#define ARActionLog(frmt, ...) NSLog((@"[ACTION] " frmt), ##__VA_ARGS__)
#define ARErrorLog(frmt, ...) NSLog((@"[ERROR] " frmt), ##__VA_ARGS__)
#else
#define ARLogInfo(frmt, ...) do {} while(0)
#define ARActionLog(frmt, ...) do {} while(0)
#define ARErrorLog(frmt, ...) do {} while(0)
#endif
