## Setup & Run

```
npm install -g jscodeshift
npm install @mrunia/material-ui-codemod

jscodeshift -t <codemod-script> <path>
```

- Use the -d option for a dry-run and use -p to print the output for comparison


## Included Scripts

- #### imports.js
 
    - Updates import statements `from "material-ui"` to from `"@materilal-ui/core"`
    - Updates import statements `from "material-ui-icons"` to from `"@materilal-ui/icons"`
    - Updates prop names for components which used to use `onRequestClose` to `onClose`
        
        - For Example: Popover, Menu, Modal, Dialog, Drawer, etc,.

