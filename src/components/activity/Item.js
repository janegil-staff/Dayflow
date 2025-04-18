import { Animated, PanResponder, StyleSheet } from "react-native";
import { useRef } from "react";

import { FlowText } from "../overrides/Text";
import { FlowHighlightView } from "../overrides/HighlightView";
import { FlowRow } from "../overrides/Row";
import { COLORS } from "../../variables/styles";
import { LoadingDots } from "../overrides/LoadingDots";

const TRESHOLD = 60;
const TAP_DELAY = 350;

export const ActivityItem = ({ title, id, onActivityChange, isActive }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (event, gestureState) => {
        const currentX = gestureState.dx;

        if (currentX > TRESHOLD) {
          onActivityChange({ id, state: true });
        }

        if (currentX < -TRESHOLD) {
          onActivityChange({ id, state: false });
        }

        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(event, gestureState);
      },

      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const itemBackground = isActive
    ? { backgroundColor: COLORS.semiDarkGray }
    : { backgroundColor: COLORS.darkGray };
  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        touchAction: "none",
        userSelect: "none",
        transform: [{ translateX: pan.x }],
      }}
    >
      <FlowHighlightView style={{ ...styles.itemContainer, ...itemBackground }}>
        <FlowRow style={styles.row}>
          <FlowText>{title}</FlowText>
          {isActive ? (
            <LoadingDots />
          ) : (
            <FlowText style={styles.time}>00:00:00</FlowText>
          )}
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
