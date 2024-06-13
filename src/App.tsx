import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Image, Dimensions } from 'react-native';

import HomeScreen from './HomeScreen';
import FinderScreen from './FinderScreen';
import OrderScreen from './OrderScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAX_ICON_SIZE = 30;

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Finder':
                iconName = 'glass';
                break;
              case 'Order':
                iconName = 'cart';
                break;
              case 'Profile':
                iconName = 'profile';
                break;
              default:
                iconName = 'bagel';
                break;
            }

            return (
              <TabIcon iconName={iconName} routeName={route.name}/>
            );
          },
          tabBarStyle: {
            justifyContent: 'center',
            position: 'absolute',
            left: 0,
            paddingHorizontal: 10,
            backgroundColor: '#213A6B',
            flexDirection: 'row',
            height: Dimensions.get('window').height * 0.08,
          },
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="Finder" component={FinderScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="Order" component={OrderScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const TabIcon: React.FC<{ iconName: any; routeName: string }> = ({ iconName, routeName }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(routeName as never);
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress} style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Image source={{uri:iconName}} style={{ 
        width: MAX_ICON_SIZE,
        height: MAX_ICON_SIZE,
        resizeMode: 'contain', }} />
    </TouchableOpacity>
  );
};

export default App;