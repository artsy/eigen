import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { PlaceholderBox, PlaceholderRaggedText, ProvidePlaceholderContext } from "../placeholders"

describe(PlaceholderBox, () => {
  it(`requires a placeholder context`, async () => {
    expect(() => {
      renderWithWrappers(<PlaceholderBox width={400} />)
    }).toThrowErrorMatchingInlineSnapshot(`
      "Error: You're using a Placeholder outside of a PlaceholderContext
          at PlaceholderBox (/Users/cn/Sites/artsy/eigen/src/lib/utils/placeholders.tsx:39:11)
          at renderWithHooks (/Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/cjs/react-test-renderer.development.js:6156:18)
          at mountIndeterminateComponent (/Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/cjs/react-test-renderer.development.js:8690:13)
          at beginWork$1 (/Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/cjs/react-test-renderer.development.js:10052:16)
          at performUnitOfWork (/Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/cjs/react-test-renderer.development.js:14694:12)
          at workLoopSync (/Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/cjs/react-test-renderer.development.js:14667:22)
          at performSyncWorkOnRoot (/Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/cjs/react-test-renderer.development.js:14366:11)
          at /Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/cjs/react-test-renderer.development.js:2063:24
          at unstable_runWithPriority (/Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/node_modules/scheduler/cjs/scheduler.development.js:818:12)
          at runWithPriority (/Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/cjs/react-test-renderer.development.js:2013:10)
          at flushSyncCallbackQueueImpl (/Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/cjs/react-test-renderer.development.js:2058:7)
          at flushSyncCallbackQueue (/Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/cjs/react-test-renderer.development.js:2046:3)
          at scheduleUpdateOnFiber (/Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/cjs/react-test-renderer.development.js:13805:9)
          at updateContainer (/Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/cjs/react-test-renderer.development.js:17014:3)
          at Object.create (/Users/cn/Sites/artsy/eigen/node_modules/react-test-renderer/cjs/react-test-renderer.development.js:17754:5)
          at create (/Users/cn/Sites/artsy/eigen/src/lib/tests/renderWithWrappers.tsx:16:49)
          at /Users/cn/Sites/artsy/eigen/src/lib/utils/__tests__/placeholders-tests.tsx:8:7
          at _toThrowErrorMatchingSnapshot (/Users/cn/Sites/artsy/eigen/node_modules/jest-snapshot/build/index.js:570:7)
          at Object.toThrowErrorMatchingInlineSnapshot (/Users/cn/Sites/artsy/eigen/node_modules/jest-snapshot/build/index.js:504:10)
          at __EXTERNAL_MATCHER_TRAP__ (/Users/cn/Sites/artsy/eigen/node_modules/expect/build/index.js:380:30)
          at Object.throwingMatcher [as toThrowErrorMatchingInlineSnapshot] (/Users/cn/Sites/artsy/eigen/node_modules/expect/build/index.js:381:15)
          at toThrowErrorMatchingInlineSnapshot (/Users/cn/Sites/artsy/eigen/src/lib/utils/__tests__/placeholders-tests.tsx:9:8)
          at tryCatch (/Users/cn/Sites/artsy/eigen/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:45:40)
          at Generator.invoke [as _invoke] (/Users/cn/Sites/artsy/eigen/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:274:22)
          at Generator.prototype.<computed> [as next] (/Users/cn/Sites/artsy/eigen/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:97:21)
          at tryCatch (/Users/cn/Sites/artsy/eigen/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:45:40)
          at invoke (/Users/cn/Sites/artsy/eigen/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:135:20)
          at /Users/cn/Sites/artsy/eigen/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:170:11
          at new Promise (/Users/cn/Sites/artsy/eigen/node_modules/react-tracking/node_modules/core-js/modules/es.promise.js:232:7)
          at callInvokeWithMethodAndArg (/Users/cn/Sites/artsy/eigen/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:169:16)
          at AsyncIterator.enqueue (/Users/cn/Sites/artsy/eigen/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:192:13)
          at AsyncIterator.prototype.<computed> [as next] (/Users/cn/Sites/artsy/eigen/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:97:21)
          at Object.<anonymous>.exports.async (/Users/cn/Sites/artsy/eigen/node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js:219:14)
          at Object._callee (/Users/cn/Sites/artsy/eigen/src/lib/utils/__tests__/placeholders-tests.tsx:6:40)
          at Object.asyncJestTest (/Users/cn/Sites/artsy/eigen/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:100:37)
          at /Users/cn/Sites/artsy/eigen/node_modules/jest-jasmine2/build/queueRunner.js:45:12
          at new Promise (<anonymous>)
          at mapper (/Users/cn/Sites/artsy/eigen/node_modules/jest-jasmine2/build/queueRunner.js:28:19)
          at /Users/cn/Sites/artsy/eigen/node_modules/jest-jasmine2/build/queueRunner.js:75:41
          at processTicksAndRejections (internal/process/task_queues.js:94:5)"
    `)

    renderWithWrappers(
      <ProvidePlaceholderContext>
        <PlaceholderBox width={400} />
      </ProvidePlaceholderContext>
    )
  })
})

describe(PlaceholderRaggedText, () => {
  it(`creates the right number of placeholders matching the given number of lines`, () => {
    const tree = renderWithWrappers(
      <ProvidePlaceholderContext>
        <PlaceholderRaggedText numLines={4} />
      </ProvidePlaceholderContext>
    )

    expect(tree.root.findAllByType(PlaceholderBox)).toHaveLength(4)
  })
})
