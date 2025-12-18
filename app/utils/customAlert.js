import Alert from '@blazejkustra/react-native-alert';

export const showAlert = (title, message, buttons = [], options = {}) => {
  Alert.alert(title, message, buttons, {
    containerStyle: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: '#fff',
    minWidth: 300,
  },
  
  // Overlay
  overlayStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  
  // Title
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  
  // Message
  messageStyle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Buttons
  buttonStyle: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
  },
  
  buttonTextStyle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Cancel button
  cancelButtonStyle: {
    backgroundColor: '#E0E0E0',
  },
  
  cancelButtonTextStyle: {
    color: '#666',
  },
    ...options,
  });
};

export const showSuccessAlert = (title, message, onConfirm) => {
  showAlert(
    `✅ ${title}`,
    message,
    [
      {
        text: 'OK',
        onPress: onConfirm,
        style: 'default',
      },
    ],
    {
      titleStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'center',
      },
    }
  );
};

export const showErrorAlert = (title, message) => {
  showAlert(
    `❌ ${title}`,
    message,
    [{ text: 'OK', style: 'cancel' }],
    {
      titleStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6B6B',
        textAlign: 'center',
      },
    }
  );
};

export const showPointsAlert = (points) => {
  showAlert(
    '🎉 Points Earned!',
    `You earned ${points} points!`,
    [{ text: 'Awesome!', style: 'default' }],
    {
      titleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFD700',
        textAlign: 'center',
      },
      messageStyle: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
      },
    }
  );
};

export const showConfirmAlert = (title, message, onConfirm, onCancel) => {
  showAlert(
    title,
    message,
    [
      {
        text: 'Cancel',
        onPress: onCancel,
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: onConfirm,
        style: 'destructive',
      },
    ]
  );
};

export default function customAlert() {
  return (
    <>
     
    </>
  );
}
