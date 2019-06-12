import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { resolveRefs } from 'json-refs'

const CFTemplate = {
  schema: (() => {
    const CfnTag = params => {
      const key = params.fn || `Fn::${params.name}`
      return new yaml.Type(`!${params.name}`, {
        kind: params.kind,
        construct: data => ({ [key]: data }),
        predicate: obj => Object.prototype.toString.call(obj) === '[object Object]' && Object.keys(obj).length === 1 && Object.keys(obj)[0] === key,
        represent: obj => obj[key]
      })
    }

    const tags = [
      { name: 'And', kind: 'sequence' },
      { name: 'Base64', kind: 'scalar' },
      { name: 'Equals', kind: 'sequence' },
      { name: 'FindInMap', kind: 'sequence' },
      { name: 'GetAtt', kind: 'sequence' },
      { name: 'GetAtt', kind: 'scalar' },
      { name: 'GetAZs', kind: 'scalar' },
      { name: 'If', kind: 'sequence' },
      { name: 'ImportValue', kind: 'scalar' },
      { name: 'Join', kind: 'sequence' },
      { name: 'Not', kind: 'sequence' },
      { name: 'Or', kind: 'sequence' },
      { name: 'Ref', kind: 'scalar', fn: 'Ref' },
      { name: 'Select', kind: 'sequence' },
      { name: 'Split', kind: 'sequence' },
      { name: 'Sub', kind: 'sequence' },
      { name: 'Sub', kind: 'scalar' }
    ].map(obj => CfnTag(obj))

    return yaml.Schema.create(tags)
  })(),

  build: async params => {
    const tmpfiles = []
    const indexYaml = params.index || `${params.dir}/index.yml`
    const root = yaml.safeLoad(fs.readFileSync(indexYaml, 'utf8').toString(), { schema: CFTemplate.schema })
    const options = {
      filter: ['relative'],
      loaderOptions: {
        processContent: (res, cb) => cb(null, yaml.safeLoad(res.text, { schema: CFTemplate.schema }))
      },
      refPreProcessor: (ref, paths) => {
        if (!ref.$ref.startsWith('.')) {
          return ref
        }

        const dirname = path.parse(ref.$ref.substr(1)).name
        if (!fs.existsSync(`${params.dir}/${dirname}`)) {
          return ref
        }

        if (fs.existsSync(`${params.dir}/.${dirname}.yml`)) {
          throw new Error(`.${dirname}.yml already exists. Can not merge files under ${dirname}.`)
        }

        const mergedData = fs.readdirSync(`${params.dir}/${dirname}`).map(file =>
          fs.readFileSync(`${params.dir}/${dirname}/${file}`, 'utf8')
        ).join('\n')
        fs.writeFileSync(`${params.dir}/.${dirname}.yml`, mergedData)
        ref.$ref = `.${dirname}.yml`
        tmpfiles.push(`${params.dir}/.${dirname}.yml`)

        return ref
      },
      location: indexYaml
    }

    try {
      const result = await resolveRefs(root, options)
      const errors = Object.keys(result.refs).map(key => {
        const data = result.refs[key]

        if (data.missing) {
          return data.error
        }

        return ''
      }).filter(data => data)

      if (errors.length) {
        throw new Error(errors.join('\n'))
      }

      const data = yaml.safeDump(result.resolved, { schema: CFTemplate.schema })
      return data.replace(/!<(.+?)>/g, '$1')
    } finally {
      tmpfiles.forEach(file => fs.unlinkSync(file))
    }
  }
}

export default CFTemplate
