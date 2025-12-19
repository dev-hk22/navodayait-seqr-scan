import { Stack } from "expo-router";
import AuthProvider from "@/providers/AuthProvider";
import { PortalHost } from '@rn-primitives/portal';
import UserProvider from "@/providers/UserProvider";
import { ToastProvider } from 'react-native-toast-notifications'
import { KeyboardProvider } from 'react-native-keyboard-controller';

import "@/app/globals.css";
import ToastNotification from "@/components/ToastNotification";
import { Appearance, AppState, StatusBar } from "react-native";
import { useEffect, useState } from "react";
import { getApplicationVersion } from "@/libs/utils";
// ...existing code...

if (__DEV__) {
	require("../../ReactotronConfig");
}

export default function RootLayout() {
	const colorScheme = Appearance.getColorScheme();
	// const [appState, setAppState] = useState(AppState.currentState);

	// useEffect(() => {
	// 	const handleAppStateChange = (nextAppState: any) => {
	// 		console.log('AppState change:', nextAppState); // To monitor state changes
	// 		setAppState(nextAppState);
	// 	};

	// 	const subscription = AppState.addEventListener(
	// 		'change',
	// 		handleAppStateChange,
	// 	);

	// 	return () => {
	// 		subscription.remove();
	// 		// unsubscribe
	// 	};
	// }, []);

	// useEffect(() => {
	// 	if (appState === 'active') {
	// 		getApplicationVersion();
	// 	}
	// }, [appState]);
	return (
		<>
			<StatusBar
				barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
				backgroundColor={colorScheme === "dark" ? "#fff" : "#2c2c2c"}
			/>
			<UserProvider>
				<AuthProvider>
					<KeyboardProvider>
						<ToastProvider
							offsetBottom={40}
							swipeEnabled={true}
							renderToast={(props) => <ToastNotification toastData={props} />}
						>
							<Stack
								screenOptions={{
									headerShown: false
								}}
							>
								<Stack.Screen
									name="(root)"
								/>
								<Stack.Screen
									name="(auth)"
								/>
							</Stack>
						</ToastProvider>
					</KeyboardProvider>
				</AuthProvider>
			</UserProvider >
		</>
		//    <PortalHost />
	);
}
