import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useTranslation } from '../../constants/translations';

const _layout = () => {
  const { t } = useTranslation();
  return (
    <Tabs
    screenOptions={{ headerShown:false,
        tabBarStyle: {
         backgroundColor:Colors.tabGroupBackground,
         paddingTop:10,
         height:90
        },
        tabBarLabelStyle: {
         fontFamily: 'MontserratZ-SemiBold', 
         fontSize: 10,
        },
        tabBarActiveTintColor:"black",
        tabBarInactiveTintColor:Colors.primary

    }}>
      <Tabs.Screen name="index"
      options={{ title:t('tabs.home'),
        tabBarIcon: ({focused}) => (
            <Ionicons
            size={24}
            name={focused ? "home" : "home-outline"}
            //color={focused ? }
            />
        )
      }}
      />

      <Tabs.Screen name="habits"
      options={{ title:t('tabs.habits'),
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
      options={{ title:t('tabs.activities'),
        tabBarIcon: ({focused}) => (
            <Ionicons
            size={24}
            name={focused ? "create" : "create-outline"}
            //color={focused ? }
            />
        )
      }}
      />

      <Tabs.Screen name="profile"
      options={{ title:t('tabs.profile'),
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

/*       <Tabs.Screen name="statistics"
      options={{ title:t('tabs.statistics'),
        tabBarIcon: ({focused}) => (
            <Ionicons
            size={24}
            name={focused ? "stats-chart" : "stats-chart-outline"}
            //color={focused ? }
            />
        )
      }}
      />*/