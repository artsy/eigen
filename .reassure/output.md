# Performance Comparison Report

- **Current**: gkartalis/reassure-spike (ed16d327fb9eaa22b5645e1e149b5ef4c18b2f7c) - 2025-12-04 14:03:27Z
- **Baseline**: gkartalis/reassure-spike (ed16d327fb9eaa22b5645e1e149b5ef4c18b2f7c) - 2025-12-04 13:59:42Z

### Significant Changes To Duration

_There are no entries_

### Meaningless Changes To Duration

<details>
<summary>Show entries</summary>

| Name                                                              | Type   | Duration                         | Count |
| ----------------------------------------------------------------- | ------ | -------------------------------- | ----- |
| HomeView Performance Tests HomeView initial mount performance     | render | 0.1 ms → 0.1 ms (-0.0 ms, ±0.0%) | 1 → 1 |
| HomeView Performance Tests HomeView re\-render after state update | render | 6.6 ms → 6.8 ms (+0.2 ms, +3.0%) | 3 → 3 |
| HomeView Performance Tests HomeView with many sections            | render | 0.1 ms → 0.1 ms (+0.0 ms, +4.0%) | 1 → 1 |
| HomeView Performance Tests HomeView with minimal sections         | render | 0.1 ms → 0.1 ms (-0.0 ms, -1.3%) | 1 → 1 |

</details>

<details>
<summary>Show details</summary>

| Name                                                              | Type   | Duration                                                                                                                                                                                                                                                                                                                        | Count                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HomeView Performance Tests HomeView initial mount performance     | render | **Baseline**<br/>Mean: 0.1 ms<br/>Stdev: 0.0 ms (16.7%)<br/>Runs: 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1<br/>Warmup runs: 255.4<br/>Removed outliers: 0.3<br/><br/>**Current**<br/>Mean: 0.1 ms<br/>Stdev: 0.0 ms (13.5%)<br/>Runs: 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1<br/>Warmup runs: 10.0<br/>Removed outliers: (none)     | **Baseline**<br/>Mean: 1<br/>Stdev: 0 (0.0%)<br/>Runs: 1 1 1 1 1 1 1 1 1 1<br/>Render issues:<br/><br/>**Current**<br/>Mean: 1<br/>Stdev: 0 (0.0%)<br/>Runs: 1 1 1 1 1 1 1 1 1 1<br/>Render issues:                                                               |
| HomeView Performance Tests HomeView re\-render after state update | render | **Baseline**<br/>Mean: 6.6 ms<br/>Stdev: 0.6 ms (9.8%)<br/>Runs: 6.2 6.0 7.0 6.9 6.3 5.9 6.4 6.8 8.1 6.7<br/>Warmup runs: 6.9<br/>Removed outliers: (none)<br/><br/>**Current**<br/>Mean: 6.8 ms<br/>Stdev: 0.6 ms (8.1%)<br/>Runs: 7.8 7.3 7.2 6.9 7.3 6.5 6.6 6.4 6.2 6.1<br/>Warmup runs: 7.2<br/>Removed outliers: (none)   | **Baseline**<br/>Mean: 3<br/>Stdev: 0 (0.0%)<br/>Runs: 3 3 3 3 3 3 3 3 3 3<br/>Render issues:<br/>- Redundant updates: 1 (2)<br/><br/>**Current**<br/>Mean: 3<br/>Stdev: 0 (0.0%)<br/>Runs: 3 3 3 3 3 3 3 3 3 3<br/>Render issues:<br/>- Redundant updates: 1 (2) |
| HomeView Performance Tests HomeView with many sections            | render | **Baseline**<br/>Mean: 0.1 ms<br/>Stdev: 0.0 ms (12.9%)<br/>Runs: 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1<br/>Warmup runs: 0.2<br/>Removed outliers: (none)<br/><br/>**Current**<br/>Mean: 0.1 ms<br/>Stdev: 0.0 ms (21.2%)<br/>Runs: 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1<br/>Warmup runs: 0.2<br/>Removed outliers: (none) | **Baseline**<br/>Mean: 1<br/>Stdev: 0 (0.0%)<br/>Runs: 1 1 1 1 1 1 1 1 1 1<br/>Render issues:<br/><br/>**Current**<br/>Mean: 1<br/>Stdev: 0 (0.0%)<br/>Runs: 1 1 1 1 1 1 1 1 1 1<br/>Render issues:                                                               |
| HomeView Performance Tests HomeView with minimal sections         | render | **Baseline**<br/>Mean: 0.1 ms<br/>Stdev: 0.0 ms (10.8%)<br/>Runs: 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1<br/>Warmup runs: 0.2<br/>Removed outliers: (none)<br/><br/>**Current**<br/>Mean: 0.1 ms<br/>Stdev: 0.0 ms (10.5%)<br/>Runs: 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1<br/>Warmup runs: 0.2<br/>Removed outliers: (none) | **Baseline**<br/>Mean: 1<br/>Stdev: 0 (0.0%)<br/>Runs: 1 1 1 1 1 1 1 1 1 1<br/>Render issues:<br/><br/>**Current**<br/>Mean: 1<br/>Stdev: 0 (0.0%)<br/>Runs: 1 1 1 1 1 1 1 1 1 1<br/>Render issues:                                                               |

</details>

### Render Count Changes

_There are no entries_

### Render Issues

| Name                                                              | Initial Updates | Redundant Updates |
| ----------------------------------------------------------------- | --------------- | ----------------- |
| HomeView Performance Tests HomeView re\-render after state update | -               | 1 (2) 🔴          |

### Added Entries

_There are no entries_

### Removed Entries

_There are no entries_
