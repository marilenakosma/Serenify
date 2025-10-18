import { TextInput } from 'react-native'
import { Colors } from '../constants/Colors'

const ThemedInput = ({style,...props}) => {
  return (
    <TextInput
    style={[
       {
        backgroundColor:Colors.uiBackground,
        color:Colors.text,
        padding:20,
        borderRadius:6
       },
       style
    ]}
    {...props}
    />
  )
}

export default ThemedInput