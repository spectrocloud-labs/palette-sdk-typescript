module.exports = {
  palette: {
    input: './openapi/openapi.yaml',
    output: {
      target: './generated/client.ts',
      client: 'axios',
      schemas: './generated/schemas',
    },
  },
};
