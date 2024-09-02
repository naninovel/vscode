sed -r "s/\"version\": \"(.+\.)0\",/\"version\": \"\1$(date +%y%m%d)\",/" -i "package.json"
