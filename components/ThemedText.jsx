import { Text } from 'react-native';
import { Colors } from '../constants/Colors';

export default function ThemedText ({style,title=false,...props}) {
 
    const textColor = title ? Colors.title : Colors.text
    const fontFamily = title ? 'MontserratZ-SemiBold' : 'MontserratZ-Regular';

  return (
        <Text 
      style={[{ color: textColor,
        fontFamily:fontFamily
       }, style]}
      {...props}
    />
  )
}