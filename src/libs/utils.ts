import { clsx, type ClassValue } from 'clsx';
import { Alert, Linking, Platform } from 'react-native';
import { twMerge } from 'tailwind-merge';
import * as Application from 'expo-application';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
};

// export function parseOtherData(data: string) {
//     const keys = [
//         "Candidate Name",
//         "Enrollment No",
//         "Course",
//         "Framework At",
//         "Can Work As",
//         "To Work Under",
//         "Valid Upto",
//         "Batch No",
//     ];
//     const values = data.split("|").map(s => s.trim());
//     const result: Record<string, string> = {};
//     keys.forEach((key, idx) => {
//         result[key] = values[idx] || "";
//     });
//     return result;
// }

// export function parseOtherData(data: string) {
//   // Define keys for each type
//   const keyMap: Record<string, string[]> = {
//     Bronze: [
//       "Candidate Name",
//       "Enrollment No",
//       "Course",
//       "Framework At",
//       "Can Work As",
//       "To Work Under",
//       "Valid Upto",
//       "Batch No",
//     ],
//     Silver: [
//       "Candidate Name",
//       "Enrollment No",
//       "Course",
//       "Framework At",
//       "Can Work As",
//       "To Work Under",
//       "Valid Upto",
//       "Batch No",
//       // Add or change keys for Silver if needed
//     ],
//     // Add more types if needed
//   };

//   // Split and trim all values
//   const values = data.split("|").map(s => s.trim());

//   // The first value is the type (e.g., Bronze, Silver)
//   const type = values[0];
//   const keys = keyMap[type] || keyMap["Bronze"]; // fallback to Bronze keys

//   // Remove the type from values
//   const fieldValues = values.slice(1);

//   // Map keys to values
//   const result: Record<string, string> = { Type: type };
//   keys.forEach((key, idx) => {
//     result[key] = fieldValues[idx] || "";
//   });

//   return result;
// }

export function parseKeysAndValues(data: string) {
    const values = data.split('|').map(value => value.trim())
    const templateId = values[0]
    const isValidTemplete = ["1", "2", "4", "5", "6", "7", "8", "9", "10"].includes(templateId)
    // console.log(isValidTemplete, "isValidTemplete");

    // console.log(templateId, "templateId");
    if (!isValidTemplete) {
        Alert.alert(
            "Invalid QR Code Detected",               // Title
            "Kindly scan the correct QR code.", // Message
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: true }
        );
        return
    }  
    const mainKeys = {
        Name: values[1] || "",
        Enrollment_No: values[2] || "",
        Has_completed_the_prescried_training: values[3] || "",
        As_per_our_Competency_Framework_at: values[4] || "",
    }

    let extraKeys = {}
    const isIncluded = ["1", "2", "4", "5", "8", "9", "10"].includes(templateId)
    if (isIncluded) {
        extraKeys = {
            Can_work_as: values[5] || "",
            To_work_under: values[6] || "",
            Valid_up_to: values[7] || "",
            Batch_Number: values[8] || "",
        }
    } else if (templateId == '7') {
        extraKeys = {
            Can_work_as: values[5] || "",
            To_work_under: values[6] || "",
            Valid_up_to: values[7] || "",
            Division_Name: values[8] || "",
            Batch_Number: values[9] || "",
        }
    } else if (templateId === "6") {
        extraKeys = {
            On: values[5] || "",
            Batch_Number: values[6] || "",
        };
    }
    return { ...mainKeys, ...extraKeys }
}




const IOS_APP_ID = process.env.EXPO_PUBLIC_IOS_APP_ID;
const ANDROID_PACKAGE = process.env.EXPO_PUBLIC_ANDROID_PACKAGE;

const IOS_STORE_URL = `https://apps.apple.com/app/id${IOS_APP_ID}`;
const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;


export const isUpdateRequired = (current:string, latest: string) => {
	const [currentMajor, currentMinor] = current.split('.').map(Number);
	const [latestMajor, latestMinor] = latest.split('.').map(Number);

	return (
		currentMajor < latestMajor ||
		(currentMajor === latestMajor && currentMinor < latestMinor)
	);
};


	export const getLatestAndroidVersion = async (): Promise<string | null> => {
		try {
			const response = await fetch(
				`https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}&hl=en&gl=US`
			);
			const text = await response.text();
			const match = text.match(/\[\[\["([0-9.]+)"\]\]/);
			return match?.[1] ?? null;
		} catch {
			return null;
		}
	};


    export	const getLatestIOSVersion = async (): Promise<string | null> => {
		try {
			const res = await fetch(
				`https://itunes.apple.com/lookup?id=${IOS_APP_ID}&country=IN`
			);
			const json = await res.json();
			return json?.results?.[0]?.version ?? null;
		} catch {
			return null;
		}
	};

    export const getApplicationVersion = async () => {
            try {
                const latestVersion =
                    Platform.OS === 'ios'
                        ? await getLatestIOSVersion()
                        : await getLatestAndroidVersion();
    
                const currentVersion = Application.nativeApplicationVersion;
    
                if (
                    isUpdateRequired(currentVersion, latestVersion)
                ) {
                    Alert.alert(
                        'Update Required',
                        'A new version of the app is available. Please update to continue using the app.',
                        [
                            {
                                text: 'Update Now',
                                onPress: () => {
                                    const url =
                                        Platform.OS === 'ios'
                                            ? IOS_STORE_URL
                                            : ANDROID_STORE_URL;
    
                                    Linking.openURL(url);
    
                                    // // Reset flag so alert can show again
                                    // setTimeout(() => {
                                    // 	isAlertVisible.current = false;
                                    // }, 1000);
                                },
                            },
                        ],
                        { cancelable: false }
                    );
                }
            } catch (error) {
                console.error('Version check failed:', error);
            }
        };