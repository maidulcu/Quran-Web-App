#!/bin/bash

# Android Build Script for Al-Quran App
# Usage: ./scripts/build-android.sh [debug|release]

set -e

BUILD_TYPE=${1:-debug}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Al-Quran Android Build ==="
echo "Build type: $BUILD_TYPE"
echo ""

# Step 1: Build offline data
echo "Step 1: Building offline data..."
cd "$ROOT_DIR"
npm run build:offline-data

# Step 2: Build mobile export
echo ""
echo "Step 2: Building mobile export..."
npm run build:mobile

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
    ./gradlew assembleDebug
    echo ""
    echo "APK location: app/build/outputs/apk/debug/app-debug.apk"
fi

echo ""
echo "=== Build Complete ==="
