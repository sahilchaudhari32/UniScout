import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../../src/auth";
import { useTheme } from "../../src/theme";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Login() {
  const { signIn } = useAuth(); const { colors } = useTheme(); const router = useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(){
    if (!email.trim() || !password) { setError("Enter your email and password."); return; }
    setError("");setBusy(true);try{await signIn(email.trim(),password);router.replace("/(tabs)");}catch(e){setError(e instanceof Error?e.message:"Unable to sign in");}finally{setBusy(false);}
  }
  const field=(placeholder:string,value:string,setter:(v:string)=>void,secure=false)=><TextInput placeholder={placeholder} secureTextEntry={secure} autoCapitalize="none" value={value} onChangeText={setter} style={{borderWidth:1,borderColor:colors.border,backgroundColor:colors.surface,borderRadius:14,padding:15,marginBottom:12,color:colors.text}}/>;
  return <SafeAreaView style={{flex:1,backgroundColor:colors.background,padding:24,justifyContent:"center"}}><Text style={{fontSize:32,fontWeight:"800",color:colors.text}}>Welcome back</Text><Text style={{color:colors.muted,marginTop:8,marginBottom:24}}>Sign in to continue exploring.</Text>{error?<Text style={{color:colors.danger,marginBottom:12}}>{error}</Text>:null}{field("Email",email,setEmail)}{field("Password",password,setPassword,true)}<Pressable disabled={busy} onPress={submit} style={{backgroundColor:colors.primary,borderRadius:14,padding:16,alignItems:"center"}}>{busy?<ActivityIndicator color="#fff"/>:<Text style={{color:"#fff",fontWeight:"800"}}>Sign in</Text>}</Pressable><View style={{flexDirection:"row",justifyContent:"center",marginTop:20}}><Text style={{color:colors.muted}}>New here? </Text><Link href={"/(auth)/register" as any} style={{color:colors.primary,fontWeight:"800"}}>Create account</Link></View></SafeAreaView>;
}
