import { BettererReporter } from "@betterer/betterer"
import chalk from "chalk"

const createCleanReporter = (): BettererReporter => ({
  runEnd: (runSummary) => {
    if (runSummary.delta === null) return

    if (runSummary.delta.diff === 0) {
      console.log(chalk.gray("Nothing to see here."))
      return
    }
    if (runSummary.delta.diff < 0) {
      console.log(chalk.green("Unwanted things have been removed. Nice!"))
      console.log(`Test: "${chalk.bold(runSummary.name)}"`)
      return
    }
    if (runSummary.delta.diff > 0) {
      console.log(chalk.red("Unwanted things have been added!"))
      console.log(`Test: "${chalk.bold(runSummary.name)}"`)

      if (runSummary.diff === null) return
      if (runSummary.diff.diff === null) return
      if (runSummary.diff.logs === null) return

      const diffs = runSummary.diff.diff as any
      Object.keys(diffs).forEach((path) => {
        if (diffs[path] === null) return
        if (diffs[path].new === null) return

        console.log("in", path)

        const text = runSummary.diff!.logs[2].code!.fileText.split("\n")
        diffs[path].new.forEach((newDetails) => {
          const errorLine = newDetails[0]
          const bufferLines = 2
          text
            .slice(errorLine - bufferLines, errorLine + bufferLines + 1)
            .forEach((line, index) => {
              console.log(
                `  ${index === bufferLines ? chalk.red(">") : " "} ${chalk.gray(
                  `${index + errorLine - 1} |`
                )} ${line}`
              )
              if (index === bufferLines) {
                console.log(
                  `    ${chalk.gray(
                    `${index + errorLine - 1}`
                      .split("")
                      .map((_) => " ")
                      .join("") + " |"
                  )} ${" ".repeat(newDetails[1])}${chalk.bold.red(
                    "^".repeat(newDetails[2]) + " " + newDetails[3]
                  )}`
                )
              }
            })
        })
      })
      return
    }
  },
})

export const reporter: BettererReporter = createCleanReporter()
