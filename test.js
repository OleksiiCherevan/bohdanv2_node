const fs = require('fs')

fs.writeFileSync("Procfile", "web: node index.js", "utf-8")