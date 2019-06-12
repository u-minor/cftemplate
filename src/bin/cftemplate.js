#!/usr/bin/env node
import Yargs from 'yargs'
import CFTemplate from '../lib/CFTemplate'

const yargs = Yargs.usage('Usage: cftemplate [options] <dir>')
  .demand(1, 'must provide a valid dir')
  .help('help').alias('help', 'h')
const argv = yargs.argv

;(async () => {
  try {
    const data = await CFTemplate.build({ dir: argv._[0] })
    console.log(data)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
  process.exit(0)
})()
