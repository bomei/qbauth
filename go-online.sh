#/usr/bin/zsh

git pull
npm run build
cp -r dist/. /var/www/html
