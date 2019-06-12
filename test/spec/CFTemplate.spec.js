import fs from 'fs'
import yaml from 'js-yaml'
import { expect } from '../helper'

import CFTemplate from '../../src/lib/CFTemplate'

// const lib = sinon.stub()

describe('CFTemplate', () => {
  describe('schema', () => {
    it('should be an js-yaml schema object', () => {
      expect(CFTemplate.schema).to.be.an.instanceOf(yaml.Schema)
    })
  })

  describe('build', () => {
    it('should throw no such file or directory error', () => {
      return expect(CFTemplate.build({ dir: `${__dirname}/../fixture/dummy` })).to.be.rejectedWith(Error, 'ENOENT: no such file or directory')
    })

    it('should throw missing location error', () => {
      return expect(CFTemplate.build({ dir: `${__dirname}/../fixture/tpl2` })).to.be.rejectedWith(Error, 'JSON Pointer points to missing location: .resources.yml')
    })

    it('should throw already exists error', () => {
      return expect(CFTemplate.build({ dir: `${__dirname}/../fixture/tpl3` })).to.be.rejectedWith(Error, '.resources.yml already exists. Can not merge files under resources.')
    })

    it('should return merged YAML', async () => {
      const data = await CFTemplate.build({ dir: `${__dirname}/../fixture/tpl1` })

      expect(data).to.equal(fs.readFileSync(`${__dirname}/../fixture/tpl1_out.yml`, 'utf8').toString())
    })
  })
})
