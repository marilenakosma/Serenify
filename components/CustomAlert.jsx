import { StyleSheet, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ThemedText from './ThemedText';
import { useTranslation } from '../constants/translations';

export function CustomAlert({ 
  type = 'info', // 'info', 'success', 'error', 'warning'
  title = 'Info message',
  message = 'You just should know this',
  showCancel = false,
  onConfirm,
  onClose
}) {
  // Color schemes based on type
  const colors = {
    info: {
      wave: '#4777ff3a',
      iconBg: '#4777ff48',
      icon: '#124fff',
      title: '#124fff',
      text: '#555',
    },
    success: {
      wave: '#47ff7733',
      iconBg: '#47ff7748',
      icon: '#12ff44',
      title: '#12ff44',
      text: '#555',
    },
    error: {
      wave: '#ff474733',
      iconBg: '#ff474748',
      icon: '#ff1212',
      title: '#ff1212',
      text: '#555',
    },
    warning: {
      wave: '#ffd74733',
      iconBg: '#ffd74748',
      icon: '#ff9912',
      title: '#ff9912',
      text: '#555',
    },
  };

  const currentColors = colors[type] || colors.info;
  const { t } = useTranslation();

  // Icons based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={currentColors.icon}
            width={17}
            height={17}
          >
            <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </Svg>
        );
      case 'error':
        return (
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={currentColors.icon}
            width={17}
            height={17}
          >
            <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </Svg>
        );
      case 'warning':
        return (
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={currentColors.icon}
            width={17}
            height={17}
          >
            <Path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </Svg>
        );
      default: // info
        return (
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={currentColors.icon}
            width={17}
            height={17}
          >
            <Path d="M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z" />
            <Path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z" />
          </Svg>
        );
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Svg
            style={styles.wave}
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
              fill={currentColors.wave}
              fillOpacity={1}
            />
          </Svg>
          
          <View style={[styles.iconContainer, { backgroundColor: currentColors.iconBg }]}>
            {getIcon()}
          </View>
          
          <View style={styles.contentContainer}>
            <View style={styles.messageTextContainer}>
              <ThemedText title={true} style={[styles.messageText, { color: currentColors.title }]}>
                {title}
              </ThemedText>
              <ThemedText style={[styles.subText, { color: currentColors.text }]}>
                {message}
              </ThemedText>
            </View>

            {showCancel && onConfirm && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                  <ThemedText style={styles.cancelText}>{t('common.cancel')}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    onConfirm();
                  }} 
                  style={[styles.confirmButton, { backgroundColor: currentColors.icon }]}
                >
                  <ThemedText style={styles.confirmText}>{t('common.confirm')}</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {!showCancel && onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15 15"
                fill={currentColors.text}
                width={18}
                height={18}
              >
                <Path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                />
              </Svg>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 330,
    minHeight: 120,
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  wave: {
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
    left: -31,
    top: 32,
    width: 80,
  },
  iconContainer: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17.5,
    marginLeft: 8,
    marginTop: 5,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  messageTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 17,
    //fontWeight: '700',
  },
  subText: {
    fontSize: 14,
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  closeButton: {
    padding: 5,
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
