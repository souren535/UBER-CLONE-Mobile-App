const { getDefaultConfig } = require("expo/metro-config");

// NativeWind v2 does not require a Metro wrapper; Babel plugin is sufficient.
module.exports = getDefaultConfig(__dirname);