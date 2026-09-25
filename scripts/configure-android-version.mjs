import { readFileSync, writeFileSync } from "node:fs";

const buildGradlePath = process.argv[2];
if (!buildGradlePath) {
  throw new Error(
    "Usage: node scripts/configure-android-version.mjs <build.gradle>",
  );
}

const versionCode = process.env.PROJECT_BUILD_NUMBER;
if (!versionCode || !/^[1-9]\d*$/.test(versionCode)) {
  throw new Error("PROJECT_BUILD_NUMBER must be a positive integer.");
}

const source = readFileSync(buildGradlePath, "utf8");
const versionCodePattern = /(^\s*versionCode\s+)\d+\s*$/m;
const versionedSource = source.replace(versionCodePattern, `$1${versionCode}`);

if (versionedSource === source) {
  throw new Error("Could not update the generated Android versionCode.");
}

writeFileSync(buildGradlePath, versionedSource);
console.log(`Set Android versionCode to ${versionCode}`);
