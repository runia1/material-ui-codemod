module.exports = function transformer(fileInfo, api) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);

    const targetModule = "@material-ui/core";

    // find all the import declarations
    root.find(j.ImportDeclaration).forEach(path => {
        const entryModule = path.value.source.value;

        // Remove non-Material-UI imports
        if (entryModule !== "material-ui" && entryModule.indexOf("material-ui/") !== 0) {
            return;
        }

        // loop through all the sub modules that are being imported from this module
        path.node.specifiers.forEach(specifier => {
            const localName = specifier.local.name;
            const importedName = specifier.imported.name;

            // create a new import declaration
            let importStatement = null;
            switch (importedName) {
                case "withStyles":
                    importStatement = j.importDeclaration(
                        [j.importSpecifier(j.identifier(importedName))],
                        j.literal(`${targetModule}/styles`)
                    );
                    break;
                case "MuiThemeProvider":
                    importStatement = j.importDeclaration(
                        [j.importDefaultSpecifier(j.identifier(localName))],
                        j.literal(`${targetModule}/styles/${importedName}`)
                    );
                    break;
                case "ModalManager":
                    importStatement = j.importDeclaration(
                        [j.importSpecifier(j.identifier(importedName))],
                        j.literal(`${targetModule}/Modal`)
                    );
                    break;
                default:
                    importStatement = j.importDeclaration(
                        [j.importDefaultSpecifier(j.identifier(localName))],
                        j.literal(`${targetModule}/${importedName}`)
                    );
            }

            // Add the new import declaration before this one
            j(path).insertBefore(importStatement);
        });

        // Now that we've re-created all the specifiers for this import declaration, remove it
        path.prune();
    });

    // format the new imports with double quotes
    const x = root.toSource({
        quote: "double",
        trailingComma: false
    });

    return x;
};
