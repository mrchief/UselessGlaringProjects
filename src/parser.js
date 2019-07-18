/* eslint-disable prefer-destructuring */
const parseExpression = container => {
  const { expression } = container
  let value
  if (expression.type === 'ObjectExpression') {
    value = expression.properties.reduce((prev, cur) => {
      prev[cur.key.name] = cur.value.value
      return prev
    }, {})
  } else if (expression.type === 'ArrayExpression') {
    value = expression.elements.map(el => el.value)
  } else {
    value = expression.value
  }

  return value
}

const parseAttribute = attribute => {
  const name = attribute.name.name

  let value
  if (attribute.value) {
    switch (attribute.value.type) {
      case 'StringLiteral':
        value = attribute.value.value
        break
      case 'JSXExpressionContainer':
        value = parseExpression(attribute.value)
        break
      default:
        value = `Unknown Type: ${attribute.value.type}`
    }
  } else {
    // it's a boolean with value true
    value = true
  }
  return { name, value }
}

const parseAttributes = attributes => {
  const { $ref, content, ...options } = attributes.reduce((opts, attribute) => {
    const { name, value } = parseAttribute(attribute)
    opts[name] = value
    return opts
  }, {})

  return { $ref, content, options }
}

export const reduceAstNode = (oldNode, currentNode, idMap) => {
  let element = {}
  if (currentNode.type === 'JSXElement') {
    const { name } = currentNode.openingElement.name

    element = {
      id: idMap && idMap[name] ? idMap[name] : name,
      name,
      children: [],
      ...parseAttributes(currentNode.openingElement.attributes),
    }

    oldNode.push(element)
  }
  if ('children' in currentNode) {
    currentNode.children.forEach(node =>
      oldNode.length > 0 ? reduceAstNode(element.children, node, idMap) : reduceAstNode(oldNode, node, idMap)
    )
  }
  return oldNode
}
