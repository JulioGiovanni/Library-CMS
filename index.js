import app from './src/serverConfig.js';

function main() {
  app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
  });
}

main();
