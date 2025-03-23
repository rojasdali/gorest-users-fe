export const environment = {
  production: true,
  apiUrl: import.meta.env['NG_APP_API_URL'] || process.env['API_URL'],
  apiToken: import.meta.env['NG_APP_API_TOKEN'] || process.env['API_TOKEN'],
};
