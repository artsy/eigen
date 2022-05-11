// File name is provided

#define itAsyncronouslyRecordsSnapshotsForDevicesWithName(name, ...) _itTestsAsyncronouslyWithDevicesRecordingWithName(self, __LINE__, __FILE__, YES, name, (__VA_ARGS__))
#define itHasAsyncronousSnapshotsForDevicesWithName(name, ...) _itTestsAsyncronouslyWithDevicesRecordingWithName(self, __LINE__, __FILE__, NO, name, (__VA_ARGS__))

#define itRecordsSnapshotsForDevicesWithName(name, ...) _itTestsSyncronouslyWithDevicesRecordingWithName(self, __LINE__, __FILE__, YES, name, (__VA_ARGS__))
#define itHasSnapshotsForDevicesWithName(name, ...) _itTestsSyncronouslyWithDevicesRecordingWithName(self, __LINE__, __FILE__, NO, name, (__VA_ARGS__))

// File name is inferred from test name

#define itAsyncronouslyRecordsSnapshotsForDevices(...) _itTestsAsyncronouslyWithDevicesRecordingWithName(self, __LINE__, __FILE__, YES, nil, (__VA_ARGS__))
#define itHasAsyncronousSnapshotsForDevices(...) _itTestsAsyncronouslyWithDevicesRecordingWithName(self, __LINE__, __FILE__, NO, nil, (__VA_ARGS__))

#define itRecordsSnapshotsForDevices(...) _itTestsSyncronouslyWithDevicesRecordingWithName(self, __LINE__, __FILE__, YES, nil, (__VA_ARGS__))
#define itHasSnapshotsForDevices(...) _itTestsSyncronouslyWithDevicesRecordingWithName(self, __LINE__, __FILE__, NO, nil, (__VA_ARGS__))

/// Usage of this should be limited
void _itTestsAsyncronouslyWithDevicesRecordingWithName(id self, int lineNumber, const char *fileName, BOOL record, NSString *name, id (^block)(void));
void _itTestsSyncronouslyWithDevicesRecordingWithName(id self, int lineNumber, const char *fileName, BOOL record, NSString *name, id (^block)(void));
