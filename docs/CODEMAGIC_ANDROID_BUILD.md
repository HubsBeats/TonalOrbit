# Build Tonal Orbit for Android with Codemagic

**Author:** Manus AI

**Repository:** `HubsBeats/TonalOrbit`

**Expo application:** `artifacts/music-theory`

**Android package ID:** `com.tonalorbit.app`

## What is already configured

The repository now contains a root-level `codemagic.yaml` with two Android workflows:

| Workflow shown in Codemagic | Output | Intended use |
| --- | --- | --- |
| **Tonal Orbit - Test APK** | Standalone APK signed with Expo's generated test key | Install on your own Android device and test the app |
| **Tonal Orbit - Signed APK and AAB** | Production-signed APK and Android App Bundle (AAB) | Direct distribution and Google Play submission |

Codemagic requires `codemagic.yaml` to be committed at the repository root. After it detects the file, you can choose a branch and workflow from **Start new build**.[1]

The workflow deliberately uses `mac_mini_m2`, not the `linux_x2` value from the original suggestion. Codemagic's current personal plan includes **500 free macOS M2 build minutes each month**, while Linux build machines require billing to be enabled.[2] Android apps can be built on the macOS M2 machine.

The supplied Replit commands also needed two corrections for this project. First, an older Corepack installation can reject pnpm because of a package-signing-key mismatch, so the workflow installs pnpm through npm. Second, Expo 54 no longer supports `--non-interactive`; this workflow uses `CI=1` and `--no-install` instead.

The Android configuration also blocks camera, location, microphone, external-storage, and overlay permissions that were inherited from unused template modules. Tonal Orbit's core features only need local audio playback, haptic feedback, and ordinary app storage.

## Two practical build options

| Approach | Tradeoffs | Cost | Setup complexity |
| --- | --- | --- | --- |
| **Codemagic with the committed YAML** | The build is transparent and controlled by your GitHub repository. Production signing requires a one-time keystore setup. | The personal plan currently includes 500 free macOS M2 minutes per month.[2] | Moderate for the first signed build; easy afterward |
| **Expo EAS Build** | Expo manages more of the native-build and credential process, but the build is configured through Expo's service rather than the Codemagic workflow you already started. | Subject to Expo's current EAS plan and quota | Usually simpler for an Expo-only app |

The rest of this guide follows the **Codemagic** option because your repository and Codemagic account are already connected.

## Part 1: Get the repository update onto `master`

Codemagic reads the workflow from GitHub, not from your computer. The branch you build must therefore contain `codemagic.yaml` at the top level of the repository.

1. Open the pull request supplied with this guide.
2. Review the changed files, then merge the pull request into `master`.
3. Return to Codemagic and open the **TonalOrbit** application.

The update also fixes seven existing Expo 54 TypeScript errors. These involved the audio mode name, the FileSystem legacy API, and unsupported SVG text properties. Fixing them before the first APK build reduces the chance of installing an app whose audio controls fail at runtime.

## Part 2: Build the first standalone test APK

This path does **not** require you to create or upload a keystore.

1. In Codemagic, open **Applications**, then select **TonalOrbit**.
2. Click **Start new build**.
3. Select the `master` branch.
4. Select the workflow named **Tonal Orbit - Test APK**.
5. Click **Start new build** in the build dialog.
6. Wait for the build steps to finish. The first build may take longer because Codemagic must download pnpm, workspace packages, Gradle dependencies, and Android components.

The workflow performs these operations automatically:

1. Installs pnpm `10.26.1`.
2. Installs the complete pnpm workspace from the lockfile.
3. Runs the Expo app's TypeScript check.
4. Generates `artifacts/music-theory/android` with Expo Prebuild.
5. Sets Android's numeric `versionCode` from Codemagic's project-wide build number.
6. Writes the Android SDK path into `local.properties`.
7. Runs Gradle's `assembleRelease` task.
8. Collects the resulting `.apk` as a Codemagic artifact.

Although this is a **release-mode** APK, the first workflow intentionally uses Expo's generated test key. Release mode is used so that the JavaScript bundle is included in the APK and the installed app does not depend on a Metro development server. This file is suitable for private testing, but it is not the production identity you should keep for public distribution.

### Download the APK

When the build succeeds, open the build result page and locate **Artifacts**. Download the APK listed there. The expected generated filename is:

```text
app-release.apk
```

Codemagic displays APK files that match the workflow's `artifacts` path on the build page.[3]

### Install the APK on your Android phone

1. Download the APK directly on the phone, or transfer it from your computer using USB, Google Drive, or another private method.
2. Open the APK from the phone's **Files** or **Downloads** app.
3. If Android blocks the installation, open the permission prompt and allow **Install unknown apps** for the app you used to open the file, such as Chrome or Files.
4. Return to the APK and select **Install**.
5. Open **Tonal Orbit** and test the circle, scales, chords, theme, and audio controls.

If Android reports that the app cannot be installed over an existing copy, uninstall the older Tonal Orbit test build first. Android will not update an installed app when the old and new APKs use different signing keys.

## Part 3: Create a permanent release keystore

Do this before distributing the APK broadly or uploading an AAB to Google Play. Android requires installable APKs to be signed, and future updates must maintain a valid signing identity.[4]

> **Important:** Keep the keystore file and its passwords permanently. Do not commit the keystore to GitHub. Codemagic does not allow you to download an uploaded keystore later, and losing the signing key can prevent reliable updates outside Google Play.[5]

### Generate the keystore on Windows

Install a Java Development Kit if the `keytool` command is unavailable. Then open **PowerShell** in a private folder and run:

```powershell
keytool -genkeypair -v -storetype JKS `
  -keystore tonal-orbit-release.jks `
  -alias tonal-orbit `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000
```

`keytool` will ask for:

1. A keystore password.
2. Your name or certificate name.
3. Organization and location details.
4. A key password. You may use the same password as the keystore password, but record both fields.

Store the following items in a password manager and a second secure backup location:

```text
File: tonal-orbit-release.jks
Keystore password: the password you entered
Key alias: tonal-orbit
Key password: the key password you entered
```

## Part 4: Upload the keystore to Codemagic

1. In Codemagic, open your **Team settings** or personal account settings.
2. Open **codemagic.yaml settings**.
3. Open **Code signing identities**.
4. Select the **Android keystores** tab.
5. Upload `tonal-orbit-release.jks`.
6. Enter the keystore password.
7. Enter the key alias: `tonal-orbit`.
8. Enter the key password.
9. Set the **Reference name** to exactly:

```text
tonal_orbit_keystore
```

10. Click **Add keystore**.

The reference must match `codemagic.yaml`. Codemagic then exposes the protected file and values to the build as `CM_KEYSTORE_PATH`, `CM_KEYSTORE_PASSWORD`, `CM_KEY_ALIAS`, and `CM_KEY_PASSWORD`.[5]

## Part 5: Build the signed APK and Play Store AAB

1. Return to the **TonalOrbit** application in Codemagic.
2. Click **Start new build**.
3. Select the `master` branch.
4. Select **Tonal Orbit - Signed APK and AAB**.
5. Start the build.
6. When the build succeeds, open **Artifacts**.

Download the format that matches your purpose:

| Artifact | Use it for |
| --- | --- |
| `app-release.apk` | Direct installation, private distribution, or testing outside Google Play |
| `app-release.aab` | A new release in Google Play Console |
| `mapping.txt` | Diagnosing minified production crash reports if minification is enabled later |

Android's official guidance recommends the Android App Bundle for Google Play. The bundle is signed with your upload key, while Play App Signing handles the APKs delivered to users.[4]

## Part 6: Verify identity and version details before Play Store release

The current application identity is:

```text
Display name: Tonal Orbit
Version name: 1.0.0
Android package ID: com.tonalorbit.app
Local fallback version code: 1
```

Confirm that `com.tonalorbit.app` is the permanent package ID you want **before the first Google Play release**. The store treats a different package ID as a different application.

Codemagic automatically replaces the generated Android `versionCode` with its positive, project-wide `PROJECT_BUILD_NUMBER` before Gradle runs. Codemagic increments this number across workflows for the project, so later signed builds receive a larger code without a manual Gradle edit.[7] The value `1` in `artifacts/music-theory/app.json` remains the fallback for local builds.

You should still update the user-visible Expo `version` in `artifacts/music-theory/app.json` when a release meaningfully changes, for example from `1.0.0` to `1.0.1`. Google Play checks the numeric `versionCode` for upload ordering, while users normally see the version name.

## Optional: Start builds automatically after a push

The supplied workflows are manual by default. This avoids consuming build minutes whenever you push a small source change. If you later want every push to `master` to start a test build, add this section to the `android-test-apk` workflow in `codemagic.yaml`:

```yaml
triggering:
  events:
    - push
  branch_patterns:
    - pattern: master
      include: true
      source: true
  cancel_previous_builds: true
```

Then open the Codemagic app settings and create the repository webhook when prompted. Codemagic requires a webhook for automatic YAML-triggered builds.[1]

## Troubleshooting

### Codemagic does not show either Tonal Orbit workflow

Confirm that the pull request was merged into the branch selected in **Start new build**. The selected branch must contain `/codemagic.yaml`; Codemagic only detects that exact filename at the repository root.[1]

### `linux_x2` is unavailable

Use the supplied `mac_mini_m2` configuration. The personal plan's included minutes apply to macOS M2, while Linux machines require billing to be enabled.[2]

### Corepack reports `Cannot find matching keyid`

Do not replace the supplied pnpm installation step with `corepack prepare`. The committed workflow uses:

```sh
npm install --global pnpm@10.26.1
```

This avoids the Corepack signing-key mismatch seen during validation.

### Expo asks `Install the updated dependencies?`

Use the committed package files and workflow together. The app's Expo runtime dependencies have been placed where Expo 54 expects them, and the workflow runs Prebuild with `CI=1` and `--no-install`.

### `SDK location not found`

Confirm that the **Set the Android SDK location** step ran before Gradle. It must write:

```sh
echo "sdk.dir=$ANDROID_SDK_ROOT" > artifacts/music-theory/android/local.properties
```

### The signed workflow cannot find a keystore

Confirm that the reference in **Code signing identities > Android keystores** is exactly `tonal_orbit_keystore`. This is not the filename or alias; it is Codemagic's reference-name field.

### The APK installs but audio does not play

Make sure the build contains the Expo 54 compatibility fixes from the same pull request as the Codemagic workflow. The app previously imported legacy FileSystem functions from the new API entry point, which Expo documents as a runtime error; it must import them from `expo-file-system/legacy`.[6]

### The build exceeds the free allowance

Manual builds help conserve the included monthly minutes. Avoid enabling push triggers until you want every `master` update to create an APK. Codemagic's pricing and allowances can change, so check the current pricing page before relying on a particular ongoing quota.[2]

## References

[1]: https://docs.codemagic.io/yaml-basic-configuration/yaml-getting-started/ "Using codemagic.yaml"
[2]: https://codemagic.io/pricing/ "Codemagic pricing"
[3]: https://docs.codemagic.io/yaml-distributing/app-preview/ "Previewing apps in the browser"
[4]: https://developer.android.com/studio/publish/app-signing "Sign your app"
[5]: https://docs.codemagic.io/code-signing-yaml/signing-android/ "Signing Android apps with codemagic.yaml"
[6]: https://docs.expo.dev/versions/latest/sdk/filesystem/ "Expo FileSystem"
[7]: https://docs.codemagic.io/yaml-basic-configuration/environment-variables/ "Built-in environment variables in codemagic.yaml"
