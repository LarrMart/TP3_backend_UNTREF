require('dotenv').config();
const { routerGets } = require("./routes/routes.get.js");
const utils = require("./utilities/Response.js");
const express = require("express");
const PORT    = process.env.SERVER_PORT || 3000;
const app     = express();

app.use(express.json());
app.use(routerGets);

app.all("*", (req, res) => {
	let ret = utils.responses("noMatches");
	ret.info += " La ruta solicitada no existe.";
	res.status(404).json(ret);
});

app.listen(PORT, () => console.log(`Server online on port ${PORT}.`));