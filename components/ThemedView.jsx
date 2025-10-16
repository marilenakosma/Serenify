import { View } from 'react-native';
import { Colors } from '../constants/Colors';

export default function ThemedView ({style,...props}) {

  return (
    <View style={[{
        backgroundColor:Colors.background},style,]}
    {...props}/>    
  )
}