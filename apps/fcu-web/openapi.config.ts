const { generateService } = require('@umijs/openapi');

generateService({
  schemaPath: 'http://dev.multiway-cloud.com:25001/swagger/v1/swagger.json',
  serversPath: './servers',
});
