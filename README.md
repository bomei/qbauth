# qbauth

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

if you use zsh and have installed `nodejs`, `nginx`, `git` and all of them got default basic config, you can just use
```bash
./go-online.sh
```
to build and mv the built file to /var/www/html to make this vue website start.

Also, use `python3.6.3` to run the `auth-server.py` to start the backend program, and a mongodb listening 27017 port is required.
