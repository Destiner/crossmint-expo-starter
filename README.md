# Crossmint Expo Starter

## Setup

1. Install dependencies

   ```sh
   pnpm i
   ```

2. Configure Privy or Dynamic to use an embedded wallet as a signer.

   ```json
   ...
    "extra": {
      "privyAppId": "<privy-app-id>",
      "privyClientId": "<privy-client-id>",
      "dynamicEnvironmentId": "<dynamic-environment-id>"
    }
   ...
   ```

3. Configure your application identifier in `app.json`. This should match the bundle identifier for your app in the app store.

   ```json
   ...
    "ios": {
      "bundleIdentifier": "com.example.myapp"
    },
    "android": {
      "package": "com.example.myapp"
    }
   ...
   ```

## Run the app

```sh
# web
pnpm run web

# ios
pnpm run ios

# android
pnpm run android
```
