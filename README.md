<img align="left" style="margin-right:40px; margin-bottom:80px;" width="180" height="80" src="./docs/a-logo-docs.png" alt="ADAAS Logo">

# a-server SDK

| LTS | Latest | npm               |
|---------------|----------|---------------------------|
| v1.0.0      |   v1.0.1    |     [@adaas/a-server](https://npm.com)    |


##  Install SDK

```bash

cd /your/project/location
npm i @adaas/a-server

```


Define your controller with overwritten method 

```typescript
  class Test extends A_EXPRESS_EntityController {
  
   
}
```


Create a new Express app and assign new routes 

```typescript
const app = express();

app.use(A_EXPRESS_Routes([Test]));

const port = 3000;

(async () => {
    const server = createServer(app);
    
    await server.listen(
        port,
        () => console.info(`Server running on port ${port}`)
    );
})();
```

