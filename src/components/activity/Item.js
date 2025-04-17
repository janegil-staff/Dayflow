import { Animated, PanResponder, StyleSheet } from "react-native";
import { useRef } from "react";

import { FlowText } from "../overrides/Text";
import { FlowHighlightView } from "../overrides/HighlightView";
import { FlowRow } from "../overrides/Row";
import { COLORS } from "../../variables/styles";

export const ActivityItem = ({ title }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        touchAction: "none",
        userSelect: "none",
        transform: [{ translateX: pan.x }],
      }}
    >
      <FlowHighlightView style={styles.itemContainer}>
        <FlowRow style={styles.row}>
          <FlowText>{title}</FlowText>
          <FlowText style={styles.time}>00:00:00</FlowText>
        </FlowRow>
      </FlowHighlightView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 6,
    paddingVertical: 19,
  },
  row: {
    justifyContent: "space-between",
  },
  time: {
    color: COLORS.brightGreen,
  },
});
