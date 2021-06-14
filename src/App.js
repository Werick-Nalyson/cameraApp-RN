import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import {RNCamera} from 'react-native-camera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default function App() {
  const [typeCamera, setTypeCamera] = useState(RNCamera.Constants.Type.front);
  const [openModal, setOpenModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  async function takePicture(camera) {
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);

    setCapturedPhoto(data.uri);
    setOpenModal(true);

    savePicture(data.uri);
  }

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  async function savePicture(data) {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    CameraRoll.save(data, 'photo')
      .then(res => {
        console.log('SALVO COM SUCESSO ', res);
      })
      .catch(err => {
        console.log('ERRO AO SALVAR ', err);
      });
  }

  async function openAlbum() {
    const options = {
      title: 'Selecione uma foto',
      chooseFromLibraryButtonTitle: 'Buscar foto no album',
      noData: true,
      mediaType: 'photo',
    };

    await launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Image Picker cancelado...');
      } else if (response.error) {
        console.log('Gerou algum erro' + response.error);
      } else {
        setCapturedPhoto(response.assets[0].uri);
        setOpenModal(true);
      }
    });
  }

  function toggleType() {
    const types = {
      front: RNCamera.Constants.Type.front,
      back: RNCamera.Constants.Type.back,
    };
    setTypeCamera(typeCamera === types.back ? types.front : types.back);
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
                onPress={() => takePicture(camera)}>
                <Text>Tirar foto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openAlbum()}
                style={styles.capture}>
                <Text>Album</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>

      <View style={styles.switchType}>
        <TouchableOpacity onPress={toggleType}>
          <Text>Trocar</Text>
        </TouchableOpacity>
      </View>

      {capturedPhoto && (
        <Modal animationType="slide" transparent={false} visible={openModal}>
          <View style={styles.modal}>
            <TouchableOpacity onPress={() => setOpenModal(false)}>
              <Text>Fechar</Text>
            </TouchableOpacity>

            <Image
              resizeMode="contain"
              style={styles.photo}
              source={{uri: capturedPhoto}}
            />
          </View>
        </Modal>
      )}
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
  photo: {
    width: 350,
    height: 450,
    borderRadius: 15,
  },
  switchType: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    height: 40,
    position: 'absolute',
    right: 20,
    top: 40,
  },
});
