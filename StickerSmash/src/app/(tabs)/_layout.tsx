import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffd33d',
                headerStyle: { backgroundColor: '#25292e' },
                headerTintColor: '#fff',
                tabBarStyle: {
                    display: 'none',
                },
                tabBarInactiveTintColor: '#a0a0a0',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color as string} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: 'About',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color as string} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="podrobnosti"
                options={{
                    title: 'Podrobnosti',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'search' : 'search-outline'} color={color as string} size={24}/>
                    ),
                }}
            />
        </Tabs>
    );
}
