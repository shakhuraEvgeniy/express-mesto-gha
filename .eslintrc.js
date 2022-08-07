module.exports = {
  "env": {
      "browser": true,
      "commonjs": true,
      "es2021": true,
      "node": true
  },
  "extends": [
    "airbnb-base"
  ],
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": true
      },
      "ecmaVersion": "latest"
  },
  "plugins": [],
  "rules": {
    "eqeqeq": "off",
    "allow": "_id"
  }
}
