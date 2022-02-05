# README

## How to create the project
1. Install with npx
- Command: $ npx create-next-app [project-name] --use-npm
2. Install redux for react + redux toolkit
- Command: $ npm install -S react-redux @reduxjs/toolkit
3. Install tailwind css
- Command: $ npm install -D tailwindcss postcss autoprefixer
- Command: $ npx tailwindcss init
- Edit file "tailwind.config.js" replace attribute "content" with '["./src/**/*.{js,jsx,ts,tsx"}'
4. Install icons
- Command: $ npm install -S @heroicons/react

## Docker
### Development
1. Build
- Command: $ docker build -t sample:dev .
2. Run
- Command: $ docker run -it --rm -v /app/node_modules -p 3005:3000 -e CHOKIDAR_USEPOLLING=true sample:dev
3. Use docker compose
- Command: $ docker-compose up -d --build
- Command: $ docker-compose stop
### Production
1. Build
- Command: $ docker build -f Dockerfile.production -t sample:production .
2. Run
- Command: $ docker run -it --rm -p 3005:3000 sample:production
3. Use docker compose
- Command: $ docker-compose -f docker-compose.production.yml up -d --build
- Command: $ docker-compose stop

### Log Git
Dikarenakan laptop saya tidak bisa untrack file jadi commit-nya kereset, berikut contoh yang sudah pernah di commit
```javascript
git commit -m "chore(init): initialize project" -m "Create new project file"
git commit -m "chore(update): remove unused file" -m "Remove all unused file at template"
git commit -m "feat(api): create function api request" -m "Make own function request api and testing"
git commit -m "docs(update): update readme installation" -m "Update document for readme markdown, to explain the project installation"
git commit -m "refactor(folder): restructured folder source" -m "Manage folder sources, make work easier"
git commit -m "refactor(proxy): make masking or proxy api" -m "Create proxy api from steinhq with api custom library + create a env file"
git commit -m "chore(file): make file helper lib" -m "Create a file helper library support read and write a file"
git commit -m "chore(cache): make cache helper" -m "Create cache api library"
git commit -m "chore(currency): call api currency" -m "Call api currency external library + implemet at list of price"
git commit -m "chore(summary): add summary data" -m "Calculate summary / aggregate of price lists"
git commit -m "refactor(hook): create hook function" -m "Add hook handler for client side"
git commit -m "chore(config): install tailwind css" -m "Installing tailwind css and config"
git commit -m "refactor(currency): cache for currency" -m "Adding cache for currency api"
git commit -m "chore(component): add support component" -m "Adding button, input, and modal component"
git commit -m "feat(dashboard): modified page dashboard" -m "Display summary data to dashboard"
git commit -m "fix(media): fix media queries" -m "Add library media queries to handle client + server side render"
git commit -m "fix(api): fix api cache" -m "Modified cache logic api internal"
git commit -m "fix(api): fix api delete method" -m "Refactor headers when delete request"
git commit -m "chore(config): add redirect rule" -m "Adding redirect rule at public folder"
```