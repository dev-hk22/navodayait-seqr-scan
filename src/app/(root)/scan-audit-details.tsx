import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Separator } from '@/components/ui/separator'
import formatDateTime from '@/utils/formatDateTime'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

type Props = {}

const ScanAuditDetails = ({ }: Props) => {

    const { scanned_results } = useLocalSearchParams<{
        scanned_results: string
        qr_data: string
    }>()

    const scannedResults = scanned_results
        ? (JSON.parse(scanned_results) as IAuditScanDetails)
        : null

    if (!scannedResults) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text className="text-gray-600">No scan details available.</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Audit Details</CardTitle>
                    </CardHeader>
                    <CardContent className='gap-4'>
                        <View className='flex-row items-center justify-between'>
                            <Text className='text-base font-medium text-gray-700'>Barcode</Text>
                            <Text className='text-base text-gray-900'>{scannedResults.key}</Text>
                        </View>

                        <Separator className='my-2' />

                        <View className='flex-row items-center justify-between'>
                            <Text className='text-base font-medium text-gray-700'>User Printed</Text>
                            <Text className='text-base text-gray-900'>{scannedResults.userPrinted || '—'}</Text>
                        </View>

                        <Separator className='my-2' />

                        <View className='flex-row items-center justify-between'>
                            <Text className='text-base font-medium text-gray-700'>Printed Date</Text>
                            <Text className='text-base text-gray-900'>
                                {scannedResults.printingDateTime ? formatDateTime(scannedResults.printingDateTime) : '—'}
                            </Text>
                        </View>

                        <Separator className='my-2' />

                        <View className='flex-row items-center justify-between'>
                            <Text className='text-base font-medium text-gray-700'>Printer Used</Text>
                            <Text className='text-base text-gray-900'>{scannedResults.printerUsed || '—'}</Text>
                        </View>

                        <Separator className='my-2' />

                        <View className='flex-row items-center justify-between'>
                            <Text className='text-base font-medium text-gray-700'>Print Count</Text>
                            <Text className='text-base text-gray-900'>{scannedResults.printCount ?? '—'}</Text>
                        </View>

                        <Separator className='my-2' />

                        <View className='flex-row items-center justify-between'>
                            <Text className='text-base font-medium text-gray-700'>Status</Text>
                            <View className={`px-3 py-1 rounded-full ${scannedResults.scan_result === 1 ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Text className={`${scannedResults.scan_result === 1 ? 'text-green-800' : 'text-red-800'} font-medium`}>
                                    {scannedResults.scan_result === 1 ? 'Active' : 'Inactive'}
                                </Text>
                            </View>
                        </View>
                    </CardContent>
                </Card>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ScanAuditDetails