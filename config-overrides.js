const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
  addBundleVisualizer
} = require('customize-cra');
const path = require('path');

module.exports = override(addDecoratorsLegacy(), disableEsLint(), config =>
  process.env.BUNDLE_VISUALIZE == 1 ? addBundleVisualizer()(config) : config
);
