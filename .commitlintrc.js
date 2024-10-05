const { types } = require("conventional-commit-types");
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", Object.keys(types)],
    "header-max-length": [2, "always", 1000],
    "body-max-line-length": [2, "always", 1000],
    "footer-max-line-length": [2, "always", 1000],
  },
};
