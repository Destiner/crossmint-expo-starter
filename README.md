# Crossmint Expo Starter

## Installation

```sh
pnpm i
```

## Setup

1. Set up Crossmint API.

In the Crossmint console, create a new client-side key. Set "Mobile" as the app type, enter your application identitier, and enable Wallet API scopes. Also, enable JWT auth.

2. Configure Privy or Dynamic to use an embedded wallet as a signer.

   ```json
    "extra": {
      "privyAppId": "<privy-app-id>",
      "privyClientId": "<privy-client-id>",
      "dynamicEnvironmentId": "<dynamic-environment-id>"
    }
   ```

> [!TIP]
> You can also try this demo by providing a valid Crossmint JWT in the `.env`:
> `EXPO_PUBLIC_CROSSMINT_JWT=YOUR_JWT`

3. Configure your application identifier in `app.json`. This should match the bundle identifier for your app in the app store.

   ```json
    "ios": {
      "bundleIdentifier": "com.example.myapp"
    },
    "android": {
      "package": "com.example.myapp"
    }
   ```

4. Set up **JWT authentication** in the Crossmint console.

Select "3P Auth providers", then choose Privy or Dynamic, and enter app details.

## Run the app

```sh
# web
pnpm run web

# ios
pnpm run ios

# android
pnpm run android
```

## Troubleshooting

1. Invalid JWT

Most likely, the **JWT authentication** in the Crossmint console is not properly set up. Make sure it matches the provider you're using for auth.

In case that doesn't help, try logging out of your account in the demo app, and logging in again.

2. Unable to make a transaction

Make sure you're using a **staging** Crossmint API key.

3. Missing config

Make sure at least `crossmintAppId` is presented in `app.json`.
