import React, { useState, useRef, FC } from "react";
import { View, Image, Modal, Button, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";

export interface IPictureDataProps {
  picture: string;
}

interface CustomCameraProps {
  data: IPictureDataProps[];
  isVisible: boolean;
  setIsVisible: Function;
}

export const CustomCamera: FC<CustomCameraProps> = ({
  data,
  isVisible,
  setIsVisible,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  if (currentIndex >= data.length) return null;

  const takePicture = async () => {
    setCameraReady(false);
    if (cameraRef.current) {
      try {
        const options = { quality: 1, skipProcessing: true };
        const photo = await cameraRef.current.takePictureAsync(options);
        setPreview(photo?.uri || null);
      } catch (error) {
        console.error("Error in capturing or converting image:", error);
      }
    }
  };

  const savePicture = async () => {
    if (preview) {
      data[currentIndex].picture = preview;
    }
    setPreview(null);
    setCurrentIndex(currentIndex + 1);
  };

  const onCameraReady = () => {
    setCameraReady(true);
  };

  return (
    <Modal visible={isVisible} transparent={false}>
      <View>
        {preview ? (
          <>
            <View style={styles.camera}>
              <Image source={{ uri: preview }} />
            </View>
            <View>
              <Button title="Retake" onPress={() => setPreview(null)} />
              <Button title="Next" onPress={savePicture} />
            </View>
          </>
        ) : (
          <>
            <CameraView
              style={styles.camera}
              ref={cameraRef}
              onCameraReady={onCameraReady}
            >
              <View>
                <Button title="Exit" onPress={() => setIsVisible(false)} />
              </View>
            </CameraView>
            <View>
              <Button
                title="Capture"
                onPress={takePicture}
                disabled={!isCameraReady}
              />
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  camera: {
    width: 300,
    height: 300,
  },
});
