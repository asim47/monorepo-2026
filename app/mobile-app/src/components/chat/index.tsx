import DeleteIcon from "@/assets/icons/DeleteIcon";
import NoConversationIcon from "@/assets/icons/NoConversationIcon";
import SearchIcon from "@/assets/icons/SearchIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { createRef, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  Extrapolate,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RightActions = ({
  progress,
  onDelete,
}: {
  progress: SharedValue<number>;
  onDelete: () => void;
}) => {
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [0.9, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  }, [progress]);

  return (
    <View style={styles.rightActionsWrap}>
      <Animated.View style={[styles.deleteBtn, rStyle]}>
        <Pressable
          hitSlop={10}
          onPress={onDelete}
          style={({ pressed }) => [
            styles.deleteBtnInner,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          <DeleteIcon width={24} height={24} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const ChatComponent = () => {
  const _primary = useThemeColor("primary");
  const text = useThemeColor("text");
  const subtitle = useThemeColor("subtitleText");

  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const bottomPadding = useMemo(
    () => Math.max(16, tabBarHeight + insets.bottom + 16),
    [tabBarHeight, insets.bottom]
  );

  const conversations = useMemo(
    () => [
      {
        id: "c1",
        name: "John Doe",
        preview: "To keep your account authentic",
        unreadCount: 0,
        avatar: { uri: "https://i.pravatar.cc/120?img=12" },
      },
      {
        id: "c2",
        name: "John Doe",
        preview: "To keep your account",
        unreadCount: 2,
        avatar: { uri: "https://i.pravatar.cc/120?img=12" },
      },
      {
        id: "c3",
        name: "John Doe",
        preview: "To keep your account authentic",
        unreadCount: 2,
        avatar: { uri: "https://i.pravatar.cc/120?img=12" },
      },
      {
        id: "c4",
        name: "John Doe",
        preview: "To keep your account authentic",
        unreadCount: 2,
        avatar: { uri: "https://i.pravatar.cc/120?img=12" },
      },
    ],
    []
  );

  const swipeRefs = useRef<
    Record<string, React.RefObject<SwipeableMethods | null>>
  >({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [swipeId, setSwipeId] = useState<string | null>(null);
  const [_pressedId, _setPressedId] = useState<string | null>(null);

  const getSwipeRef = (id: string) => {
    if (!swipeRefs.current[id]) {
      swipeRefs.current[id] = createRef<SwipeableMethods>();
    }
    return swipeRefs.current[id];
  };

  const closeIfOpen = (id: string) => {
    swipeRefs.current[id]?.current?.close();
  };

  const renderRightActions = (id: string) => {
    const RightActionsComponent = (progress: SharedValue<number>) => (
      <RightActions
        progress={progress}
        onDelete={() => {
          // TODO: wire delete
          closeIfOpen(id);
        }}
      />
    );
    RightActionsComponent.displayName = 'RightActionsComponent';
    return RightActionsComponent;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <View style={styles.headerSide} />
        <Text style={[styles.headerTitle, { color: text }]}>Messages</Text>
        <Pressable
          hitSlop={10}
          style={({ pressed }) => [
            styles.headerIconBtn,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => {}}
        >
          <SearchIcon width={20} height={20} />
        </Pressable>
      </View>

      <Text style={[styles.sectionTitle, { color: text }]}>
        Recent conversations
      </Text>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomPadding + 30 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.noConversationContainer}>
            <NoConversationIcon width={117} height={95} />
            <Text style={[styles.noConversationText, { color: text }]}>No conversations yet</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <ReanimatedSwipeable
            ref={getSwipeRef(item.id)}
            friction={2}
            rightThreshold={40}
            overshootRight={false}
            renderRightActions={renderRightActions(item.id)}
            onSwipeableWillOpen={() => {
              // Ensure only one row is open at a time
              if (openId && openId !== item.id) closeIfOpen(openId);
              setOpenId(item.id);
            }}
            onSwipeableOpenStartDrag={() => {
              // Highlight immediately when user starts dragging (prevents flicker)
              if (openId && openId !== item.id) closeIfOpen(openId);
              setSwipeId(item.id);
            }}
            onSwipeableClose={() => {
              if (openId === item.id) setOpenId(null);
              if (swipeId === item.id) setSwipeId(null);
            }}
          >
            <Pressable
              style={({ pressed }) => [
                styles.row,
                (openId === item.id ||
                  swipeId === item.id ||
                  pressedId === item.id ||
                  pressed) &&
                  styles.rowSwiped,
              ]}
              onPress={() => {}}
             
            >
              <View style={styles.avatarWrap}>
                <Image source={item.avatar} style={styles.avatar} />
                <View style={styles.onlineDot} />
              </View>

              <View style={styles.rowBody}>
                <Text style={[styles.name, { color: text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text
                  style={[styles.preview, { color: subtitle }]}
                  numberOfLines={1}
                >
                  {item.preview}
                </Text>
              </View>

              {openId !== item.id && item.unreadCount > 0 ? (
                <View style={styles.unreadPill}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              ) : null}
            </Pressable>
          </ReanimatedSwipeable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default ChatComponent;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 16,

  },
  headerSide: { width: 40, height: 40 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Roboto_700Bold",
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  rowSwiped: {
    backgroundColor: "#E8F6F0",
  },
  avatarWrap: {
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#2DB784",
    borderRadius: 999,
    padding: 2,
    position: "relative",
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#eee" },
  onlineDot: {
    position: "absolute",
    right: 0,
    bottom: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22C55E",
    borderWidth: 1,
    borderColor: "#fff",
  },
  rowBody: { flex: 1, gap: 2 },
  name: { fontSize: 14, fontWeight: "700" },
  preview: { fontSize: 12 },
  unreadPill: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: "#F5B942",
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#B8B8B8",
    marginLeft: 70,
    marginRight: 16,
  },
  rightActionsWrap: {
    width: 78,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2DB784",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 10,
  },
  deleteBtnInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  fab: {
    position: "absolute",
    right: 16,
    top: 140,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 10,
  },
  noConversationContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  noConversationText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
});