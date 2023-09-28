const path = require('path');

const capitalize = str => 
	str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();

const strToAccentRegex = str => {
	return str.replaceAll(/[aá]/g, "[aá]")
			  .replaceAll(/[eé]/g, "[eé]")
			  .replaceAll(/[ií]/g, "[ií]")
			  .replaceAll(/[oó]/g, "[oó]")
			  .replaceAll(/[uú]/g, "[uú]")
}

const arraysAreEquals = (a, b) =>
  a.length === b.length && a.every((element, index) => element === b[index]);

const getProjectRoot = () => path.join(__dirname, "..", "..");

const getAbsolutePath = relativePath => 
	path.join(getProjectRoot(), relativePath);
	
module.exports = {
	capitalize, 
	strToAccentRegex,
	getAbsolutePath,
	getProjectRoot
};

