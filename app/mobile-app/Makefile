start:
	npm run start
ios:
	npx expo run:ios --device
android:
	npx expo run:android

prepare:
	npm i --force

prepare-ios:
	sudo rm -r node_modules && sudo rm -r ./ios/Pods && sudo rm -r ./ios/Podfile.lock && make prepare

build-bundle:
	./android/gradlew app:bundleRelease

build-apk:
	./android/gradlew assembleRelease


.PHONY: start ios android prepare prepare-ios