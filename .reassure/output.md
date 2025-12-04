# Performance Comparison Report

- **Current**: gkartalis/reassure-spike (3a06e8e3a0c24307072a6d984a009b792abe3dc8) - 2025-12-04 14:09:04Z
- **Baseline**: gkartalis/reassure-spike (ed16d327fb9eaa22b5645e1e149b5ef4c18b2f7c) - 2025-12-04 14:04:25Z

### Significant Changes To Duration

<details open>
<summary>Show entries</summary>

| Name                                                      | Type   | Duration                             | Count |
| --------------------------------------------------------- | ------ | ------------------------------------ | ----- |
| HomeView Performance Tests HomeView with minimal sections | render | 0.1 ms → 0.1 ms (-0.0 ms, -10.2%) 🟢 | 1 → 1 |

</details>

<details>
<summary>Show details</summary>

| Name                                                      | Type   | Duration                                                                                                                                                                                                                                                                                                                      | Count                                                                                                                                                                                               |
| --------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HomeView Performance Tests HomeView with minimal sections | render | **Baseline**<br/>Mean: 0.1 ms<br/>Stdev: 0.0 ms (7.6%)<br/>Runs: 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1<br/>Warmup runs: 0.2<br/>Removed outliers: (none)<br/><br/>**Current**<br/>Mean: 0.1 ms<br/>Stdev: 0.0 ms (9.4%)<br/>Runs: 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1<br/>Warmup runs: 0.2<br/>Removed outliers: (none) | **Baseline**<br/>Mean: 1<br/>Stdev: 0 (0.0%)<br/>Runs: 1 1 1 1 1 1 1 1 1 1<br/>Render issues:<br/><br/>**Current**<br/>Mean: 1<br/>Stdev: 0 (0.0%)<br/>Runs: 1 1 1 1 1 1 1 1 1 1<br/>Render issues: |

</details>

### Meaningless Changes To Duration

<details>
<summary>Show entries</summary>

| Name                                                              | Type   | Duration                          | Count |
| ----------------------------------------------------------------- | ------ | --------------------------------- | ----- |
| HomeView Performance Tests HomeView initial mount performance     | render | 0.1 ms → 0.1 ms (-0.0 ms, -13.3%) | 1 → 1 |
| HomeView Performance Tests HomeView re\-render after state update | render | 6.1 ms → 6.0 ms (-0.1 ms, -2.3%)  | 3 → 3 |
| HomeView Performance Tests HomeView with many sections            | render | 0.1 ms → 0.1 ms (-0.0 ms, -9.1%)  | 1 → 1 |

</details>

<details>
<summary>Show details</summary>

| Name                                                              | Type   | Duration                                                                                                                                                                                                                                                                                                                         | Count                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HomeView Performance Tests HomeView initial mount performance     | render | **Baseline**<br/>Mean: 0.1 ms<br/>Stdev: 0.0 ms (18.9%)<br/>Runs: 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1<br/>Warmup runs: 10.3<br/>Removed outliers: (none)<br/><br/>**Current**<br/>Mean: 0.1 ms<br/>Stdev: 0.0 ms (12.2%)<br/>Runs: 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1<br/>Warmup runs: 9.7<br/>Removed outliers: (none) | **Baseline**<br/>Mean: 1<br/>Stdev: 0 (0.0%)<br/>Runs: 1 1 1 1 1 1 1 1 1 1<br/>Render issues:<br/><br/>**Current**<br/>Mean: 1<br/>Stdev: 0 (0.0%)<br/>Runs: 1 1 1 1 1 1 1 1 1 1<br/>Render issues:                                                               |
| HomeView Performance Tests HomeView re\-render after state update | render | **Baseline**<br/>Mean: 6.1 ms<br/>Stdev: 0.4 ms (6.9%)<br/>Runs: 6.0 6.6 6.1 6.1 5.9 7.0 5.8 5.7 5.8 5.8<br/>Warmup runs: 6.8<br/>Removed outliers: (none)<br/><br/>**Current**<br/>Mean: 6.0 ms<br/>Stdev: 0.4 ms (6.5%)<br/>Runs: 6.3 6.1 6.3 6.6 5.8 5.5 6.2 5.6 5.6 5.5<br/>Warmup runs: 7.2<br/>Removed outliers: (none)    | **Baseline**<br/>Mean: 3<br/>Stdev: 0 (0.0%)<br/>Runs: 3 3 3 3 3 3 3 3 3 3<br/>Render issues:<br/>- Redundant updates: 1 (2)<br/><br/>**Current**<br/>Mean: 3<br/>Stdev: 0 (0.0%)<br/>Runs: 3 3 3 3 3 3 3 3 3 3<br/>Render issues:<br/>- Redundant updates: 1 (2) |
| HomeView Performance Tests HomeView with many sections            | render | **Baseline**<br/>Mean: 0.1 ms<br/>Stdev: 0.0 ms (13.5%)<br/>Runs: 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1 0.1<br/>Warmup runs: 0.2<br/>Removed outliers: (none)<br/><br/>**Current**<br/>Mean: 0.1 ms<br/>Stdev: 0.0 ms (8.2%)<br/>Runs: 0.1 0.1 0.1 0.0 0.1 0.1 0.1 0.1 0.1 0.1<br/>Warmup runs: 0.2<br/>Removed outliers: (none)   | **Baseline**<br/>Mean: 1<br/>Stdev: 0 (0.0%)<br/>Runs: 1 1 1 1 1 1 1 1 1 1<br/>Render issues:<br/><br/>**Current**<br/>Mean: 1<br/>Stdev: 0 (0.0%)<br/>Runs: 1 1 1 1 1 1 1 1 1 1<br/>Render issues:                                                               |

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
