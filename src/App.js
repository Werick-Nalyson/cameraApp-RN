import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

export default function App() {
  const [typeCamera, setTypeCamera] = useState(RNCamera.Constants.Type.front);
  const [openModal, setOpenModal] = useState(false);

  function takePicture() {
    setOpenModal(true);
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <RNCamera
        style={styles.preview}
        type={typeCamera}
        flashMode={RNCamera.Constants.FlashMode.auto}
        androidCameraPermissionOptions={{
          title: 'Permissão para usar a câmera',
          message: 'Nós precisamos usar sua câmera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancelar',
        }}>
        {({camera, status, recordAndroidPermissonStatus}) => {
          if (status !== 'READY') {
            return <View />;
          }
          return (
            <View style={styles.footerCamera}>
              <TouchableOpacity
                style={styles.capture}
                onPress={() => takePicture()}>
                <Text>Tirar foto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.capture}>
                <Text>Album</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>

      <Modal animationType="slide" transparent={false} visible={openModal}>
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => setOpenModal(false)}>
            <Text>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFF',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  footerCamera: {
    width: 200,
    marginBottom: 35,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  capture: {
    flex: 0,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
});
