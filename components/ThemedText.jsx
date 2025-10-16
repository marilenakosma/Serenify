import { Text } from 'react-native';
import { Colors } from '../constants/Colors';

export default function ThemedText ({style,title=false,...props}) {
 
    const textColor = title ? Colors.title : Colors.text

  return (
        <Text 
      style={[{ color: textColor }, style]}
      {...props}
    />
  )
}