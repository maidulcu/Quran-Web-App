#!/bin/bash

# Android Build Script for Al-Quran App
# Usage: ./scripts/build-android.sh [debug|release]

set -e

BUILD_TYPE=${1:-debug}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Auto-detect Java 21
if [ -z "$JAVA_HOME" ]; then
  if [ -d "/opt/homebrew/opt/openjdk@21" ]; then
    export JAVA_HOME=/opt/homebrew/opt/openjdk@21
  elif [ -d "/usr/local/opt/openjdk@21" ]; then
    export JAVA_HOME=/usr/local/opt/openjdk@21
  else
    echo "ERROR: Java 21 not found. Install with: brew install openjdk@21"
    exit 1
  fi
fi

echo "=== Al-Quran Android Build ==="
echo "Java: $($JAVA_HOME/bin/java -version 2>&1 | head -1)"
echo "Build type: $BUILD_TYPE"
echo ""

# Step 1: Build offline data
echo "Step 1: Building offline data..."
cd "$ROOT_DIR"
npm run build:offline-data -- --resume 2>&1 | tail -5

# Step 2: Build mobile export
echo ""
echo "Step 2: Building mobile export..."
npm run build:mobile 2>&1 | tail -5

# Step 3: Sync with Capacitor
echo ""
echo "Step 3: Syncing with Capacitor..."
npx cap sync android

# Step 4: Build Android
echo ""
echo "Step 4: Building Android $BUILD_TYPE..."
cd android

if [ "$BUILD_TYPE" = "release" ]; then
    echo ""
    echo "=== Release Build ==="
    echo "NOTE: For release builds, you need to:"
    echo "1. Generate a keystore: keytool -genkey -v -keystore keystore/release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias quran-app"
    echo "2. Set environment variables:"
    echo "   export KEYSTORE_PASSWORD=your_password"
    echo "   export KEY_ALIAS=quran-app"
    echo "   export KEY_PASSWORD=your_password"
    echo ""
    echo "Building AAB (Android App Bundle) for Play Store..."
    ./gradlew bundleRelease
    echo ""
    echo "AAB location: app/build/outputs/bundle/release/app-release.aab"
else
    echo ""
    echo "=== Debug Build ==="
    ./gradlew clean assembleDebug
    APK_PATH=$(find app/build/outputs -name "*.apk" -type f | head -1)
    APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
    echo ""
    echo "APK built: $APK_PATH ($APK_SIZE)"
    echo ""
    echo "To install on connected device:"
    echo "  adb install $APK_PATH"
    echo ""
    echo "Or transfer app-debug.apk to your phone and install manually."
    echo "IMPORTANT: Uninstall old version first!"
fi

echo ""
echo "=== Build Complete ==="
