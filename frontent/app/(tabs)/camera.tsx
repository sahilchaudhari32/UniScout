import React, { useRef, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const router = useRouter(); const camera = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions(); const [media, setMedia] = useState<string | null>(null);
  const [facing, setFacing] = useState<"front" | "back">("back"); const [flash, setFlash] = useState<"on" | "off">("off"); const [mode, setMode] = useState<"picture" | "video" | "scan">("picture"); const [recording, setRecording] = useState(false); const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  if (!permission) return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  if (!permission.granted) return <SafeAreaView style={styles.center}><Text style={styles.title}>Camera permission needed</Text><Text style={styles.body}>Allow camera access to capture campus photos or videos.</Text><Pressable onPress={requestPermission} style={styles.button}><Text style={styles.buttonText}>Allow camera</Text></Pressable></SafeAreaView>;
  async function capture() {
    if (mode === "video") { if (recording) { camera.current?.stopRecording(); setRecording(false); return; } setRecording(true); const result = await camera.current?.recordAsync(); setRecording(false); if (result?.uri) setMedia(result.uri); return; }
    const result = await camera.current?.takePictureAsync({ quality: 0.8 }); if (result?.uri) setMedia(result.uri);
  }
  async function save() {
    if (!media) return;
    if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
      Alert.alert(
        "Unavailable in Expo Go",
        "Saving captures to the gallery requires an Expo development build."
      );
      return;
    }
    try {
      // Load the native module only in a development or standalone build.
      // Expo Go logs a warning as soon as expo-media-library is imported.
      const MediaLibrary = await import("expo-media-library");
      // This screen only writes a new asset; it does not read the user's library.
      // Requesting write-only access avoids asking for unnecessary full-library access.
      const permission = await MediaLibrary.requestPermissionsAsync(true);
      if (!permission.granted) {
        Alert.alert("Permission denied", "Gallery permission is required to save this capture.");
        return;
      }
      await MediaLibrary.saveToLibraryAsync(media);
      Alert.alert("Saved", "Your capture was saved to the gallery.");
    } catch {
      Alert.alert("Save failed", "Unable to save this capture to the gallery.");
    }
  }
  if (media) return <SafeAreaView style={styles.preview}><Image source={{ uri: media }} style={styles.previewImage} /><View style={styles.actions}><Pressable onPress={() => setMedia(null)} style={styles.button}><Text style={styles.buttonText}>Retake</Text></Pressable><Pressable onPress={save} style={styles.button}><Text style={styles.buttonText}>Save capture</Text></Pressable></View></SafeAreaView>;
  return <View style={styles.camera}><CameraView ref={camera} style={{ flex: 1 }} facing={facing} flash={flash} mode={mode === "video" ? "video" : "picture"} autofocus="on" onTouchEnd={(event) => setFocusPoint({ x: event.nativeEvent.locationX, y: event.nativeEvent.locationY })} />{focusPoint && <View pointerEvents="none" style={[styles.focus, { left: focusPoint.x - 28, top: focusPoint.y - 28 }]} />}<SafeAreaView style={styles.overlay}><View style={styles.top}><Pressable onPress={() => router.back()}><Ionicons name="close" size={30} color="#fff" /></Pressable><Text style={styles.mode}>{mode === "video" ? "VIDEO" : mode === "scan" ? "DOCUMENT SCAN" : "PHOTO"}</Text><Pressable onPress={() => setFlash(flash === "on" ? "off" : "on")}><Ionicons name={flash === "on" ? "flash" : "flash-off"} size={25} color="#fff" /></Pressable></View>{mode === "scan" && <View pointerEvents="none" style={styles.scanFrame}><Text style={styles.scanText}>Align document inside frame</Text></View>}<View style={styles.bottom}><Pressable onPress={() => setMode(mode === "picture" ? "video" : mode === "video" ? "scan" : "picture")}><Ionicons name={mode === "picture" ? "videocam-outline" : mode === "video" ? "scan-outline" : "camera-outline"} size={30} color="#fff" /></Pressable><Pressable onPress={capture} style={[styles.shutter, recording && { backgroundColor: "#d94d57" }]}><View style={recording ? styles.stop : styles.innerShutter} /></Pressable><Pressable onPress={() => setFacing(facing === "back" ? "front" : "back")}><Ionicons name="camera-reverse-outline" size={32} color="#fff" /></Pressable></View></SafeAreaView></View>;
}
const styles: any = { camera:{flex:1,backgroundColor:"#000"},overlay:{...({position:"absolute",top:0,bottom:0,left:0,right:0} as any),justifyContent:"space-between"},top:{padding:20,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},mode:{color:"#fff",fontWeight:"800"},bottom:{padding:30,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},shutter:{width:74,height:74,borderRadius:40,borderWidth:5,borderColor:"#fff",alignItems:"center",justifyContent:"center"},innerShutter:{width:60,height:60,borderRadius:30,backgroundColor:"#fff"},stop:{width:30,height:30,borderRadius:5,backgroundColor:"#fff"},focus:{position:"absolute",width:56,height:56,borderRadius:8,borderWidth:2,borderColor:"#fff"},scanFrame:{position:"absolute",top:"32%",left:"10%",right:"10%",height:230,borderWidth:2,borderColor:"#fff",borderRadius:12,alignItems:"center",justifyContent:"flex-end"},scanText:{color:"#fff",marginBottom:-30},center:{flex:1,justifyContent:"center",alignItems:"center",padding:24},title:{fontSize:22,fontWeight:"800",marginBottom:8},body:{textAlign:"center",marginBottom:20},button:{backgroundColor:"#175c54",padding:15,borderRadius:14,marginHorizontal:5},buttonText:{color:"#fff",fontWeight:"800"},preview:{flex:1,backgroundColor:"#000",justifyContent:"center"},previewImage:{width:"100%",height:"75%",resizeMode:"contain"},actions:{flexDirection:"row",justifyContent:"center",marginTop:20}};
