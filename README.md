# UK Race Alarm 👋

This is an Expo project that provides alarms for UK & Irish horse races. Set alarms for all races or toggle them individually to receive a two-minute warning before the race is off.

## Live Demo

The web version of this application is deployed on GitHub Pages. You can try it out here:

[**https://tonykennah.github.io/UKRaceAlarm/**](https://tonykennah.github.io/UKRaceAlarm/)

<img width="400" height="300" alt="image" src="https://github.com/user-attachments/assets/85044d30-8531-431a-a3a0-b5dd32a6b013" />

<img width="400" height="300" alt="image" src="https://github.com/user-attachments/assets/50d1fb7c-1cca-4b3f-9118-3f2efa195959" />

## Features

- **Daily Race List**: View all of today's UK & Irish horse races in a clean, easy-to-read list.
- **Bulk Alarm Control**: Start or stop alarms for all upcoming races with a single large, accessible button.
- **Individual Alarms**: Tap the status indicator on any race to toggle its alarm on or off, giving you granular control.
- **Two-Minute Warnings**: Receive a push notification two minutes before each selected race is due to start.
- **Configurable Alarm Melody**: Choose your preferred alarm sound from a selection of melodies on the About page.
- **Live Countdown**: See a real-time countdown timer for each race that has an active alarm.
- **Auto-Updating List**: Finished races are automatically removed from the list to keep the view focused on what's next.

## Tech Stack

The project is built with React Native using the Expo framework. The language used is TypeScript. Key libraries include:
- `@fortawesome/react-native-fontawesome` for icons
- `@react-native-async-storage/async-storage` for storage
- `@react-navigation/bottom-tabs` for navigation
- `expo-notifications` for push notifications
- `expo-router` for file-based routing

## Project Structure

The project is structured as follows:
- `app/`: Contains the screens and routing logic, using file-based routing with `expo-router`.
- `assets/`: Contains static assets like images and fonts.
- `components/`: Contains reusable React components.
- `data/`: Contains static data, such as the `races.json` file.
- `services/`: Contains business logic, such as notification and event services.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Important to create deploy and predeploy in app.json

   ```bash
   npm install --save-dev gh-pages
   ```

   ```bash
   npm run deploy
   ```


In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Available Scripts

- `npm install`: Install dependencies
- `npx expo start`: Start the development server
- `npm run android`: Start the app on an Android emulator
- `npm run ios`: Start the app on an iOS simulator
- `npm run web`: Start the app in a web browser
- `npm run lint`: Lint the code using ESLint

## Deployment

This project is configured for deployment to GitHub Pages.

1.  Build the static web output:
    ```bash
    npx expo export:web
    ```

2.  The output will be generated in the `dist` directory. This directory can be deployed to any static site hosting service. For deploying to GitHub Pages, you can use a package like `gh-pages` to easily push the contents of the `dist` folder to the `gh-pages` branch of your repository.


## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
