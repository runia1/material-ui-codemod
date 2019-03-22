const { changePropName, buildImportIdentifier } = require("./utils");

module.exports = function transformer(fileInfo, api) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);

    // find all the import declarations for material-ui
    root.find(j.ImportDeclaration).forEach(path => {
        const targetModule = "@material-ui/core";

        const entryModule = path.value.source.value;

        // Remove non-Material-UI imports
        if (entryModule !== "material-ui" && entryModule.indexOf("material-ui/") !== 0) {
            return;
        }

        // loop through all the sub modules that are being imported from this module
        path.node.specifiers.forEach(specifier => {
            const localName = specifier.local ? specifier.local.name : null;
            const importedName = specifier.imported ? specifier.imported.name : localName;

            // create a new import declaration
            let importStatement = null;
            switch (importedName) {
                case "withStyles":
                    importStatement = j.importDeclaration(
                        [
                            j.importSpecifier(
                                j.identifier(buildImportIdentifier(importedName, localName))
                            )
                        ],
                        j.literal(`${targetModule}/styles`)
                    );
                    break;
                case "MuiThemeProvider":
                    importStatement = j.importDeclaration(
                        [
                            j.importDefaultSpecifier(
                                j.identifier(buildImportIdentifier(importedName, localName))
                            )
                        ],
                        j.literal(`${targetModule}/styles/${importedName}`)
                    );
                    break;
                case "ModalManager":
                    importStatement = j.importDeclaration(
                        [
                            j.importSpecifier(
                                j.identifier(buildImportIdentifier(importedName, localName))
                            )
                        ],
                        j.literal(`${targetModule}/Modal`)
                    );
                    break;
                default:
                    importStatement = j.importDeclaration(
                        [
                            j.importDefaultSpecifier(
                                j.identifier(buildImportIdentifier(importedName, localName))
                            )
                        ],
                        j.literal(`${targetModule}/${importedName}`)
                    );
            }

            // Add the new import declaration before this one
            j(path).insertBefore(importStatement);
        });

        // Now that we've re-created all the specifiers for this import declaration, remove it
        path.prune();
    });

    // In MUI 3 they changed the prop name from "onRequestClose" to "onClose" for the following components,
    // they all use Modal component under the covers
    changePropName(
        root,
        j,
        ["Dialog", "Drawer", "Menu", "Modal", "Popover", "SwipeableDrawer", "Tooltip"],
        "onRequestClose",
        "onClose"
    );

    // find all the import declarations for material-ui-icons
    root.find(j.ImportDeclaration).forEach(path => {
        const targetModule = "@material-ui/icons";

        const entryModule = path.value.source.value;

        // Remove non-Material-UI imports
        if (
            entryModule !== "material-ui-icons" &&
            entryModule.indexOf("material-ui-icons/") !== 0
        ) {
            return;
        }

        // loop through all the sub modules that are being imported from this module
        path.node.specifiers.forEach(specifier => {
            const localName = specifier.local ? specifier.local.name : null;
            const importedName = specifier.imported ? specifier.imported.name : localName;

            // create a new import declaration
            const importStatement = j.importDeclaration(
                [
                    j.importDefaultSpecifier(
                        j.identifier(buildImportIdentifier(importedName, localName))
                    )
                ],
                j.literal(`${targetModule}/${importedName}`)
            );

            // Add the new import declaration before this one
            j(path).insertBefore(importStatement);
        });

        // Now that we've re-created all the specifiers for this import declaration, remove it
        path.prune();
    });

    // format the new imports with double quotes
    return root.toSource({
        quote: "double",
        trailingComma: false
    });
};
