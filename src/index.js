module.exports = function parser({ types: t }) {
  return {
    name: 'packageDefinitionParser',
    visitor: {
      ExportNamedDeclaration: {
        enter(path) {
          console.log(path)
        },
      },
    },
  }
}
