const changeComponentName = (root, j, componentName, componentNewName) => {
    root.find(j.JSXElement).forEach(path => {
        const identifier = path.value.openingElement.name.name;

        if (identifier !== componentName) {
            return;
        }

        path.value.openingElement.name.name = componentNewName;
        // if it's not a selfClosing element we'll need to rename the closing element too
        if (!path.value.openingElement.selfClosing) {
            path.value.closingElement.name.name = componentNewName;
        }
    });
};

const changePropName = (root, j, componentName, propName, newPropName) => {
    root.find(j.JSXElement).forEach(path => {
        const identifier = path.value.openingElement.name.name;

        if (Array.isArray(componentName)) {
            if (!componentName.includes(identifier)) {
                return;
            }
        } else if (identifier !== componentName) {
            return;
        }

        path.value.openingElement.attributes.forEach(attribute => {
            if (attribute.name.name !== propName) {
                return;
            }

            attribute.name.name = newPropName;
        });
    });
};

const changeCallExpression = (root, j, identifierName, conversionCallback) => {
    root.find(j.CallExpression).forEach(path => {
        const identifier = path.value.callee.name;

        if (Array.isArray(identifierName)) {
            if (!identifierName.includes(identifier)) {
                return;
            }
        } else if (identifier !== identifierName) {
            return;
        }

        conversionCallback(path, identifier);
    });
};

const buildImportIdentifier = (importedName, localName) => {
    return localName && localName !== importedName
        ? `${importedName} as ${localName}`
        : importedName;
};

module.exports = {
    changeComponentName,
    changePropName,
    changeCallExpression,
    buildImportIdentifier
};
