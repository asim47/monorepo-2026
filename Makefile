android:
	npm -w app/mobile-app run android

ios:
	npm -w app/mobile-app run ios

clean:
	npm -w app/mobile-app run clean

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

lint-fix:
	npm run lint:fix

db-up:
	npm run db:up

db-down:
	npm run db:down

db-migrate:
	npm run db:migrate

db-migrate-deploy:
	npm run db:migrate:deploy

db-migrate-reset:
	npm run db:migrate:reset

db-migrate-new:
	npm run db:migrate:new

db-reset:
	npm run db:reset

db-test:
	npm run db:test