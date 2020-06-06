const express = require('express')
const path = require('path');
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname + '/vuejs')));
app.use(express.static(path.join(__dirname + '/node_modules/html5-qrcode/minified')));

app.get('/vuejs', (req, res) => {
	return res.sendFile(path.join(__dirname + '/vuejs/index.html'));;
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))