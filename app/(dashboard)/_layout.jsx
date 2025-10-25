import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';

const _layout = () => {
  return (
    <Tabs
    screenOptions={{ headerShown:false,
        tabBarStyle: {
         backgroundColor:Colors.tabGroupBackground,
         paddingTop:10,
         height:90
        },
        tabBarActiveTintColor:"black",
        tabBarInactiveTintColor:Colors.primary

    }}>
      <Tabs.Screen name="index"
      options={{ title:"Home",
        tabBarIcon: ({focused}) => (
            <Ionicons
            size={24}
            name={focused ? "home" : "home-outline"}
            //color={focused ? }
            />
        )
      }}
      />

      <Tabs.Screen name="quests"
      options={{ title:"Quests",
        tabBarIcon: ({focused}) => (
            <Ionicons
            size={24}
            name={focused ? "book" : "book-outline"}
            //color={focused ? }
            />
        )
      }}
      />

      <Tabs.Screen name="activities"
      options={{ title:"Activities",
        tabBarIcon: ({focused}) => (
            <Ionicons
            size={24}
            name={focused ? "create" : "create-outline"}
            //color={focused ? }
            />
        )
      }}
      />

      <Tabs.Screen name="statistics"
      options={{ title:"Statistics",
        tabBarIcon: ({focused}) => (
            <Ionicons
            size={24}
            name={focused ? "stats-chart" : "stats-chart-outline"}
            //color={focused ? }
            />
        )
      }}
      />

      <Tabs.Screen name="profile"
      options={{ title:"Profile",
        tabBarIcon: ({focused}) => (
            <Ionicons
            size={24}
            name={focused ? "person" : "person-outline"}
            //color={focused ? }
            />
        )
      }}
      />
        
    </Tabs>

  )
}

export default _layout