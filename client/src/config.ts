// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'nelmx3c451'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`
// export const apiEndpoint = `http://localhost:3003/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-hkcdhb4r.us.auth0.com',            // Auth0 domain
  clientId: 'EOKtA3hpFiphYQiuPEmx8vkjmG38uhtI',          // Auth0 client id
  callbackUrl: 'http://192.168.15.17:3000/callback'
}
