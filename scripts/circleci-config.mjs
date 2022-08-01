#!/usr/bin/env node

// @ts-check

import yaml from "js-yaml"
import fs from "fs"

const config = {
  version: 2.1,

  jobs: {
    job2: {
      docker: {
        image: ["cimg/base:2021.04"],
      },
      steps: { run: ["echo dynamic config!"] },
    },
  },

  workflows: {
    workflow2: {
      jobs: ["job2"],
    },
  },
}

const output =
  "# This file is auto-generated!\n" +
  "# Please edit `scripts/circleci-config.mjs`.\n\n" +
  yaml.dump(config, { indent: 2, lineWidth: 200 })

fs.writeFileSync("main.yml", output)
