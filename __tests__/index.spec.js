import pluginTester from 'babel-plugin-tester'
import plugin from '../src'

pluginTester({
  plugin,
  title: 'Package Definition Parser Plugin',
  filename: __filename,
  tests: {
    'transforms the layout statement into a JSON with the intended content': {
      fixture: 'fixtures/simple/layout.jsx',
      outputFixture: 'fixtures/simple/output.js',
    },
  },
})
