import { TextInput } from 'react-native'
import { Colors } from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons';

const ThemedInput = ({style,iconName,...props}) => {
  return (
    <>
    <TextInput
    style={[
       {
        backgroundColor:Colors.uiBackground,
        color:Colors.text,
        padding:20,
        borderRadius:6,
        fontFamily:'Montserrat_400Regular'
       },
       style
    ]}
    {...props}
    />
    </>
  )
}

export default ThemedInput