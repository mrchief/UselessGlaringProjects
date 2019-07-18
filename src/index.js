import jsx from '@babel/plugin-syntax-jsx'
import * as t from 'babel-types'

const isExtension = (openingElement, path) => path.scope.hasBinding(openingElement.name.name)

const generateAttrObject = nodes => {
  const arr = nodes.map(node => {
    const name = t.StringLiteral(node.name.name)
    // eslint-disable-next-line no-nested-ternary
    const value = !node.value
      ? t.BooleanLiteral(true)
      : /JSXExpressionContainer/i.test(node.value.type)
      ? node.value.expression
      : node.value

    return t.ObjectProperty(name, value)
  })

  return [t.ObjectExpression(arr)]
}

function buildAttributeObject(attrs, file) {
  const expressions = []
  const spreads = []

  while (attrs.length) {
    const attr = attrs.shift()

    if (/^JSXSpreadAttribute$/i.test(attr.type)) spreads.push(attr.argument)
    else expressions.push(attr)
  }

  let attrObject = expressions.length ? generateAttrObject(expressions) : null

  if (spreads.length) {
    const extension = attrObject ? spreads.concat(attrObject) : spreads

    if (extension.length > 1) extension.unshift(t.ObjectExpression([]))

    attrObject = t.callExpression(file.addHelper('extends'), extension)
  } else {
    // eslint-disable-next-line prefer-destructuring
    attrObject = attrObject[0]
  }

  return attrObject
}

const generateElement = (path, state) => {
  const { file } = state

  // make grand-canyon related tweaks here like calling attributes as options and so on
  const opts = {
    root: 'presentation',
    type: 'name',
    attributes: 'options',
    children: 'children',
    ...state.opts,
  }

  const { node } = path

  if (!/JSXElement/.test(node.type)) return node.expression ? node.expression : t.StringLiteral(node.value)

  const { openingElement } = node
  const children = path.get('children')
  const { attributes: openingAttributes } = openingElement
  const Extends = isExtension(openingElement, path)

  const type = t.StringLiteral(openingElement.name.name)
  const attributes = openingAttributes.length ? buildAttributeObject(openingAttributes, file) : t.NullLiteral()
  const mappedChildren = children.length
    ? t.ArrayExpression(children.map(child => generateElement(child, state)))
    : t.ArrayExpression([])

  const layoutExpression = t.ObjectExpression([
    t.ObjectProperty(t.StringLiteral(opts.type), Extends ? t.NullLiteral() : type),
    t.ObjectProperty(t.StringLiteral(opts.attributes), attributes),
    t.ObjectProperty(t.StringLiteral(opts.children), mappedChildren),
  ])
  return t.objectExpression([t.ObjectProperty(t.StringLiteral(opts.root), layoutExpression)])
}

const layoutVisitor = {
  JSXElement(path, state) {
    path.parentPath.replaceWith(generateElement(path, state))
  },
}

export default function parser() {
  return {
    name: 'packageDefinitionParser',
    inherits: jsx,
    visitor: {
      ExportNamedDeclaration(path) {
        if (path.node.declaration.declarations[0].init.body.type === 'JSXElement') path.traverse(layoutVisitor, {})
      },
    },
  }
}
