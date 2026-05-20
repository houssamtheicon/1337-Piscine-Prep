const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname, {
  extensions: ['html'],
  index: ['index.html']
}));

app.listen(PORT, () => {
  console.log(`1337 Piscine Prep running at http://localhost:${PORT}`);
});
