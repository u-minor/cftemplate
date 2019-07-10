#!/usr/bin/env node
import fs from 'fs'
import Yargs from 'yargs'
import CFTemplate from '../lib/CFTemplate'

const yargs = Yargs.usage('Usage: cftemplate [options] <dir>')
  .demandCommand(1, 'must provide a valid dir')
  .options({
    e: {
      alias: 'entry',
      default: 'index.yml',
      describe: 'entry point file name',
      type: 'string'
    },
    o: {
      alias: 'output',
      describe: 'output file name',
      type: 'string'
    }
  })
  .help('help').alias('help', 'h')
const argv = yargs.argv

;(async () => {
  try {
    const data = await CFTemplate.build({ dir: argv._[0], entry: argv.entry })
    if (argv.o) {
      fs.writeFileSync(argv.o, data)
    } else {
      console.log(data)
    }
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
  process.exit(0)
})()
