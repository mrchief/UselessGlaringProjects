const plugin = require('..')
const pluginTester = require('babel-plugin-tester')

pluginTester({
  plugin,
  title: 'Package Definition Parser Plugin',
  filename: __filename,
  tests: {
    'transforms the layout statement into a JSON with the intended content': {
      fixture: 'fixtures/simple/layout.js',
      outputFixture: 'fixtures/simple/output.json',
    },
  },
})
