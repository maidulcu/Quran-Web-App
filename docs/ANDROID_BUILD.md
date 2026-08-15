# Android Build & Google Play Submission Guide

## Prerequisites

- Android Studio installed
- Java JDK 21+
- Keystore for signing (see below)

## Quick Start (Debug Build)

```bash
./scripts/build-android.sh debug
```

This will:
1. Build offline data
2. Build mobile export
3. Sync with Capacitor
4. Generate debug APK

## Release Build for Play Store

### 1. Generate Keystore

```bash
cd android/app/keystore
keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias quran-app
```

### 2. Set Environment Variables

```bash
export KEYSTORE_PASSWORD=your_password
export KEY_ALIAS=quran-app
export KEY_PASSWORD=your_password
```

### 3. Build Release AAB

```bash
./scripts/build-android.sh release
```

This generates: `android/app/build/outputs/bundle/release/app-release.aab`

## Google Play Console Submission

### App Listing Requirements

1. **App Name**: Al-Quran
2. **Package Name**: com.dynamicweblab.quran
3. **Category**: Books & Reference
4. **Content Rating**: Everyone
5. **Target Audience**: All ages

### Store Listing

- **Title**: Al-Quran - Read & Listen
- **Short Description**: Read and listen to the Holy Quran with Arabic text, English translation, and audio recitations.
- **Full Description**: 
  Al-Quran is a beautiful, offline-first Quran reader that lets you read and listen to the Holy Quran anywhere, anytime.

  Features:
  • All 114 Surahs with Arabic text and English translation
  • High-quality audio recitations by Mishary Rashid Alafasy
  • Tajweed color guidance for proper pronunciation
  • Multiple translations (Sahih, Yusuf Ali, Asad, Pickthall, Hilali)
  • Tafsir support (Jalalayn, Ibn Kathir, and more)
  • Word-by-word translation
  • Personal bookmarks and notes
  • Reading progress tracking
  • Mushaf page view with multiple themes
  • Dark mode for comfortable reading
  • Offline access - works without internet

  Developed by Dynamic Web Lab (https://dynamicweblab.com)

### Screenshots Required

- Phone: At least 2 screenshots (minimum 320px, maximum 3840px)
- 7-inch tablet: Optional but recommended
- 10-inch tablet: Optional but recommended

### Graphics Required

- **App Icon**: 512x512px PNG (already configured)
- **Feature Graphic**: 1024x500px PNG
- **TV Banner**: 1280x720px (if targeting Android TV)

### Content Rating

Complete the IARC questionnaire - this app is suitable for all ages.

### Privacy Policy

You need a privacy policy URL. Example template:

```
https://yourdomain.com/privacy-policy
```

### Data Safety

Declare what data your app collects:
- None (offline app, no data collection)

## Build Artifacts

| Build Type | Output | Use Case |
|------------|--------|----------|
| Debug | `app-debug.apk` | Testing on devices |
| Release | `app-release.aab` | Play Store submission |

## Version Management

Update version in `android/app/build.gradle`:
- `versionCode`: Increment for each release (1, 2, 3...)
- `versionName`: Semantic version (1.0.0, 1.0.1, 1.1.0...)

## Troubleshooting

### Build fails with "Could not resolve dependencies"
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### Icons not updating
1. Clean build: `cd android && ./gradlew clean`
2. Rebuild: `./scripts/build-android.sh debug`

### Signing errors
Ensure environment variables are set:
```bash
echo $KEYSTORE_PASSWORD
echo $KEY_ALIAS
echo $KEY_PASSWORD
```
