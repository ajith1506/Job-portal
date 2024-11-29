const DataURIParser = require("datauri/parser");

const path = require("path");

const getDataUri = (file) => {
  if (!file) throw new Error("File is required for data URI conversion");
  const parser = new DataURIParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

module.exports = getDataUri;
