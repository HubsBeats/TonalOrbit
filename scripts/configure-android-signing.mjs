import { readFileSync, writeFileSync } from "node:fs";

const requiredVariables = [
  "CM_KEYSTORE_PATH",
  "CM_KEYSTORE_PASSWORD",
  "CM_KEY_ALIAS",
  "CM_KEY_PASSWORD",
];

const missingVariables = requiredVariables.filter((name) => !process.env[name]);
if (missingVariables.length > 0) {
  throw new Error(
    `Missing Codemagic signing variables: ${missingVariables.join(", ")}`,
  );
}

const buildGradlePath = process.argv[2];
if (!buildGradlePath) {
  throw new Error(
    "Usage: node scripts/configure-android-signing.mjs <build.gradle>",
  );
}

let source = readFileSync(buildGradlePath, "utf8");

const signingConfigsPattern =
  /    signingConfigs \{\n        debug \{[\s\S]*?\n        \}\n    \}/;
const signingConfigsMatch = source.match(signingConfigsPattern);
if (!signingConfigsMatch) {
  throw new Error(
    "Could not find Expo's generated Android signingConfigs block.",
  );
}

const releaseSigningConfig = `
        release {
            storeFile file(System.getenv("CM_KEYSTORE_PATH"))
            storePassword System.getenv("CM_KEYSTORE_PASSWORD")
            keyAlias System.getenv("CM_KEY_ALIAS")
            keyPassword System.getenv("CM_KEY_PASSWORD")
        }`;

const expandedSigningConfigs = signingConfigsMatch[0].replace(
  /\n    \}$/,
  `${releaseSigningConfig}\n    }`,
);
source = source.replace(signingConfigsPattern, expandedSigningConfigs);

const buildTypesStart = source.indexOf("    buildTypes {");
if (buildTypesStart === -1) {
  throw new Error("Could not find Expo's generated Android buildTypes block.");
}

const beforeBuildTypes = source.slice(0, buildTypesStart);
const buildTypesAndAfter = source.slice(buildTypesStart);
const releaseBuildTypePattern =
  /(        release \{[\s\S]*?\n            )signingConfig signingConfigs\.debug/;
const signedBuildTypes = buildTypesAndAfter.replace(
  releaseBuildTypePattern,
  "$1signingConfig signingConfigs.release",
);

if (signedBuildTypes === buildTypesAndAfter) {
  throw new Error(
    "Could not change the release build to use the release keystore.",
  );
}

const signedSource = beforeBuildTypes + signedBuildTypes;
writeFileSync(buildGradlePath, signedSource);
console.log(`Configured release signing in ${buildGradlePath}`);
