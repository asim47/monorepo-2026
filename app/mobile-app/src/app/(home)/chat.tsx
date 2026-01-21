import ChatComponent from "@/components/chat"
import { Colors } from "@/constants/theme"
import { SafeAreaView } from "react-native-safe-area-context"


export default function Chat() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <ChatComponent />
    </SafeAreaView>
  )
}