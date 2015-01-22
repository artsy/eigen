#define itAsyncronouslyRecordsSnapshotsForDevices(name, ...) _itTestsAsyncronouslyWithDevicesRecording(self, __LINE__, __FILE__, YES, name, (__VA_ARGS__))
#define itHasAsyncronousSnapshotsForDevices(name, ...) _itTestsAsyncronouslyWithDevicesRecording(self, __LINE__, __FILE__, NO, name, (__VA_ARGS__))

#define itRecordsSnapshotsForDevices(name, ...) _itTestsSyncronouslyWithDevicesRecording(self, __LINE__, __FILE__, YES, name, (__VA_ARGS__))
#define itHasSnapshotsForDevices(name, ...) _itTestsSyncronouslyWithDevicesRecording(self, __LINE__, __FILE__, NO, name, (__VA_ARGS__))

/// Usage of this should be limited
void _itTestsAsyncronouslyWithDevicesRecording(id self, int lineNumber, const char *fileName, BOOL record, NSString *name, id (^block)());

void _itTestsSyncronouslyWithDevicesRecording(id self, int lineNumber, const char *fileName, BOOL record, NSString *name, id (^block)());
