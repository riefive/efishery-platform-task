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