# MDR — local Android development
#
# Common flows:
#   make setup      verify the toolchain and install Android SDK packages
#   make emulator   boot the configured AVD
#   make android    build and install a debug build
#   make apk        build an installable release APK into dist/
#   make start      start Metro only (after the first native build)

SHELL := /bin/zsh

ANDROID_HOME ?= $(HOME)/Library/Android/sdk
JAVA_HOME ?= $(shell /usr/libexec/java_home -v 17 2>/dev/null || echo /usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home)
AVD ?= Medium_Phone_API_37.0
APP_ID ?= com.tach.mdr

BUN ?= bun
BUNX ?= bunx
EXPO := $(BUNX) expo
ADB := $(ANDROID_HOME)/platform-tools/adb
EMULATOR := $(ANDROID_HOME)/emulator/emulator
SDKMANAGER := $(ANDROID_HOME)/cmdline-tools/latest/bin/sdkmanager

# Keep Gradle and the Android tools on PATH for every recipe.
export ANDROID_HOME
export JAVA_HOME
export PATH := $(JAVA_HOME)/bin:$(ANDROID_HOME)/platform-tools:$(ANDROID_HOME)/emulator:$(PATH)

.DEFAULT_GOAL := help
.PHONY: help setup sdk check emulator devices install android android-device start launch \
        release apk install-apk prebuild lint typecheck doctor clean

help: ## Show this help
	@echo "MDR — local Android development"
	@echo ""
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z0-9_-]+:.*## / {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "Environment: AVD=$(AVD)  ANDROID_HOME=$(ANDROID_HOME)"

setup: check sdk ## Verify the toolchain and install required SDK packages
	@echo "Android setup complete."

check: ## Verify JDK, Bun, adb and sdkmanager
	@test -x "$(JAVA_HOME)/bin/java" || { \
		echo "JDK 17 not found. Install it with: brew install --cask zulu@17"; exit 1; }
	@echo "Java: $$("$(JAVA_HOME)/bin/java" -version 2>&1 | head -1)"
	@command -v $(BUNX) >/dev/null || { echo "bunx not found. Install Bun: https://bun.sh"; exit 1; }
	@echo "Bun: $$($(BUNX) --version)"
	@test -x "$(ADB)" || { echo "adb not found at $(ADB)"; exit 1; }
	@test -x "$(SDKMANAGER)" || { echo "sdkmanager not found at $(SDKMANAGER)"; exit 1; }
	@echo "adb: $$("$(ADB)" version | head -1)"

sdk: ## Install the Android SDK packages this project needs
	@yes | "$(SDKMANAGER)" --sdk_root="$(ANDROID_HOME)" --licenses >/dev/null 2>&1 || true
	@"$(SDKMANAGER)" --sdk_root="$(ANDROID_HOME)" \
		"platforms;android-36" \
		"platforms;android-37.0" \
		"build-tools;37.0.0" \
		"ndk;27.1.12297006" \
		"cmake;3.30.5"

emulator: ## Boot the configured AVD and wait until Android is ready
	@if "$(ADB)" get-state >/dev/null 2>&1; then \
		echo "A device is already connected."; \
	else \
		echo "Starting $(AVD)..."; \
		nohup "$(EMULATOR)" -avd "$(AVD)" -no-boot-anim -no-audio \
			> /tmp/mdr-emulator.log 2>&1 & \
		"$(ADB)" wait-for-device; \
		echo "Waiting for Android to finish booting..."; \
		while [ "$$("$(ADB)" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" != "1" ]; do sleep 2; done; \
		echo "Emulator ready."; \
	fi

devices: ## List connected Android devices
	@"$(ADB)" devices -l

install: ## Install JavaScript dependencies
	$(BUN) install

android: ## Build and install a debug build, then start Metro
	$(EXPO) run:android

android-device: ## Build and install a debug build on a selected device
	$(EXPO) run:android --device

start: ## Start Metro only (no native rebuild)
	$(EXPO) start

launch: ## Launch the installed debug app on the connected device
	@"$(ADB)" shell monkey -p $(APP_ID) -c android.intent.category.LAUNCHER 1 >/dev/null
	@echo "Launched $(APP_ID)"

release: ## Build a release build and install it on the connected device
	$(EXPO) run:android --variant release --no-bundler

android/gradlew:
	$(EXPO) prebuild --platform android --no-install

apk: android/gradlew ## Build an installable release APK into dist/
	cd android && ./gradlew assembleRelease
	@mkdir -p dist
	@cp android/app/build/outputs/apk/release/app-release.apk dist/mdr-release.apk
	@echo "APK: $(CURDIR)/dist/mdr-release.apk"

install-apk: apk ## Install the built release APK on the connected device
	@"$(ADB)" install -r dist/mdr-release.apk

prebuild: ## Regenerate android/ from app.json (destructive)
	$(EXPO) prebuild --platform android --clean --no-install

lint: ## Run ESLint
	$(EXPO) lint

typecheck: ## Run the TypeScript compiler
	$(BUNX) tsc --noEmit

doctor: ## Diagnose Expo project and dependency issues
	$(EXPO) doctor

clean: ## Remove build artifacts
	rm -rf dist
	@if [ -x android/gradlew ]; then cd android && ./gradlew clean; fi
