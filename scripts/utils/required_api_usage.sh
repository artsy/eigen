#!/bin/bash

# Check if at least one argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <category>"
    echo "Categories: timestamp, nsuserdefaults, diskspace, uptime"
    exit 1
fi

CATEGORY=$1

# Get the full path to the script
SCRIPT_PATH="$(realpath "$0")"

# Extract the directory path up to "eigen"
SEARCH_DIR=$(dirname "$SCRIPT_PATH") # This gets you to the utils directory
SEARCH_DIR=$(dirname "$SEARCH_DIR") # This moves up to scripts
SEARCH_DIR=$(dirname "$SEARCH_DIR") # This moves up to eigen, the desired directory

# Define Swift search strings for each category
SWIFT_TIMESTAMP_SEARCH_STRINGS=(
"modificationDate"
"fileModificationDate"
"contentModificationDateKey"
"creationDateKey"
)

SWIFT_NSUSERDEFAULTS_SEARCH_STRINGS=(
"UserDefaults"
)

SWIFT_SYSTEM_UPTIME_SEARCH_STRINGS=(
"systemUptime"
"mach_absolute_time("
)

SWIFT_DISKSPACE_SEARCH_STRINGS=(
"volumeAvailableCapacityKey"
"volumeAvailableCapacityForImportantUsageKey"
"volumeAvailableCapacityForOpportunisticUsageKey"
"volumeTotalCapacityKey"
"systemFreeSize"
"systemSize"
"statfs("
"statvfs("
"fstatfs("
"fstatvfs("
"getattrlist("
"fgetattrlist("
"getattrlistat("
)

# Define Objective-C search strings for each category
OBJC_TIMESTAMP_SEARCH_STRINGS=(
"NSFileCreationDate"
"NSFileModificationDate"
"NSURLContentModificationDateKey"
"NSURLCreationDateKey"
"getattrlist("
"getattrlistbulk("
"fgetattrlist("
"fstat("
"fstatat("
"lstat("
"getattrlistat("
)

OBJC_NSUSERDEFAULTS_SEARCH_STRINGS=(
"NSUserDefaults"
)

OBJC_SYSTEM_UPTIME_SEARCH_STRINGS=(
"systemUptime"
"mach_absolute_time"
)

OBJC_DISKSPACE_SEARCH_STRINGS=(
"NSURLVolumeAvailableCapacityKey"
"NSURLVolumeAvailableCapacityForImportantUsageKey"
"NSURLVolumeAvailableCapacityForOpportunisticUsageKey"
"NSURLVolumeTotalCapacityKey"
"NSFileSystemFreeSize"
"NSFileSystemSize"
"statfs"
"statvfs"
"fstatfs"
"fstatvfs"
"getattrlist"
"fgetattrlist"
"getattrlistat"
)

# Function to perform search
search_api_usage() {
    local search_strings_name=$1[@]
    local search_strings=("${!search_strings_name}")
    local include_pattern=$2
    for search_string in "${search_strings[@]}"; do
        echo "Searching for $search_string..."
        ggrep -R --color=always --include=$include_pattern \
        --exclude-dir=build \
        --exclude-dir=.vendor \
        "$search_string" "$SEARCH_DIR"
    done
}

echo "Starting search for $CATEGORY API strings in $SEARCH_DIR"

# Perform searches based on the category and file type

case $CATEGORY in
    timestamp)
        search_api_usage SWIFT_TIMESTAMP_SEARCH_STRINGS "*.swift"
        search_api_usage OBJC_TIMESTAMP_SEARCH_STRINGS "*.m"
        search_api_usage OBJC_TIMESTAMP_SEARCH_STRINGS "*.mm"
        search_api_usage OBJC_TIMESTAMP_SEARCH_STRINGS "*.h"
        search_api_usage OBJC_TIMESTAMP_SEARCH_STRINGS "*.c"
        search_api_usage OBJC_TIMESTAMP_SEARCH_STRINGS "*.cpp"
        ;;
    nsuserdefaults)
        search_api_usage SWIFT_NSUSERDEFAULTS_SEARCH_STRINGS "*.swift"
        search_api_usage OBJC_NSUSERDEFAULTS_SEARCH_STRINGS "*.m"
        search_api_usage OBJC_NSUSERDEFAULTS_SEARCH_STRINGS "*.mm"
        search_api_usage OBJC_NSUSERDEFAULTS_SEARCH_STRINGS "*.h"
        search_api_usage OBJC_NSUSERDEFAULTS_SEARCH_STRINGS "*.c"
        search_api_usage OBJC_NSUSERDEFAULTS_SEARCH_STRINGS "*.cpp"
        ;;
    diskspace)
        search_api_usage SWIFT_DISKSPACE_SEARCH_STRINGS "*.swift"
        search_api_usage OBJC_DISKSPACE_SEARCH_STRINGS "*.m"
        search_api_usage OBJC_DISKSPACE_SEARCH_STRINGS "*.mm"
        search_api_usage OBJC_DISKSPACE_SEARCH_STRINGS "*.h"
        search_api_usage OBJC_DISKSPACE_SEARCH_STRINGS "*.c"
        search_api_usage OBJC_DISKSPACE_SEARCH_STRINGS "*.cpp"
        ;;
    uptime)
        search_api_usage SWIFT_SYSTEM_UPTIME_SEARCH_STRINGS "*.swift"
        search_api_usage OBJC_SYSTEM_UPTIME_SEARCH_STRINGS "*.m"
        search_api_usage OBJC_SYSTEM_UPTIME_SEARCH_STRINGS "*.mm"
        search_api_usage OBJC_SYSTEM_UPTIME_SEARCH_STRINGS "*.h"
        search_api_usage OBJC_SYSTEM_UPTIME_SEARCH_STRINGS "*.c"
        search_api_usage OBJC_SYSTEM_UPTIME_SEARCH_STRINGS "*.cpp"
        ;;
    *)
        echo "Invalid category: $CATEGORY"
        echo "Valid categories are: timestamp, nsuserdefaults, diskspace, uptime"
        exit 2
        ;;
esac

echo "Search complete."
