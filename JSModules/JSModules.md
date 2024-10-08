A precise comparison of CommonJS, AMD, and ES Modules (ESM):

| **Feature**                    | **CommonJS**                                    | **AMD (Asynchronous Module Definition)** | **ES Modules (ESM)**                                                           |
| ------------------------------ | ----------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------ |
| **Syntax**                     | `module.exports`, `require`                     | `define`, `require`                      | `import`, `export`                                                             |
| **Loading**                    | Synchronous                                     | Asynchronous                             | Asynchronous (static by default)                                               |
| **Use Case**                   | Server-side (Node.js)                           | Browser (with async loading)             | Both browser and server (modern)                                               |
| **Module Format**              | File-based modules                              | Predefined module wrapper                | File-based modules                                                             |
| **Export**                     | `module.exports = {...}` or `exports.foo = ...` | Return value from `define`               | Named exports (`export {}`) or default (`export default`)                      |
| **Import**                     | `const x = require('module')`                   | `require(['module'], function(x) {...})` | `import { x } from 'module';` or `import x from 'module';`                     |
| **Dependency Resolution**      | Immediate (synchronous)                         | Async via callback                       | Static analysis (at compile-time)                                              |
| **Native Support in Browsers** | No (requires bundlers like Webpack)             | No (requires a script loader)            | Yes (native browser support)                                                   |
| **Bundler Required**           | Yes (for browsers)                              | Yes (typically RequireJS)                | No (for supported browsers)                                                    |
| **Execution Order**            | Determined by `require` calls                   | Depends on async callback                | Top-down, per dependency graph                                                 |
| **Community Usage**            | Node.js ecosystem                               | Legacy browser environments              | Modern JavaScript (ES6+)                                                       |
| **Advantages**                 | Simple, widely used in Node.js                  | Handles async loading well               | Native support, better static analysis, tree shaking, and module encapsulation |
| **Disadvantages**              | Not ideal for browsers                          | Complex, less intuitive                  | Only supported in ES6+ environments                                            |

This table highlights the main differences between these module systems used in JavaScript for handling dependencies and structuring code.
