# autoprompt
Web based teleprompter with voice recognition auto-scroll


## Deployment

### Dev (localhost:8080)

``` 
npm i
npm run buildDev
npm start
```
### Production (dockerised - localhost:8081)

```
npm i
npm run buildProd
docker-compose -f lukebaxnet-compose.yml down
docker-compose -f lukebaxnet-compose.yml up --build -d
```