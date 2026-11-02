import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';

import { useColors } from '@/components/Themed';

const SPRING = { damping: 18, stiffness: 180, mass: 0.8 };
const PILL_MARGIN = 6;

type TabItemProps = {
  index: number;
  label: string;
  position: SharedValue<number>;
  renderIcon: (color: string) => React.ReactNode;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({ index, label, position, renderIcon, focused, onPress, onLongPress }: TabItemProps) {
  const colors = useColors();

  const activeIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(position.value, [index - 1, index, index + 1], [0, 1, 0], 'clamp'),
  }));
  const inactiveIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(position.value, [index - 1, index, index + 1], [1, 0, 1], 'clamp'),
  }));
  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(position.value, [index - 1, index, index + 1], [1, 1.08, 1], 'clamp'),
      },
    ],
  }));
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      position.value,
      [index - 1, index, index + 1],
      [colors.tabIconDefault, colors.onTint, colors.tabIconDefault],
    ),
  }));

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      style={styles.item}
    >
      <Animated.View style={[styles.itemContent, contentStyle]}>
        {/* Dois ícones sobrepostos (cinza e branco) que trocam de opacidade */}
        <View style={styles.iconBox}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.center, inactiveIconStyle]}>
            {renderIcon(colors.tabIconDefault)}
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, styles.center, activeIconStyle]}>
            {renderIcon(colors.onTint)}
          </Animated.View>
        </View>
        <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

export default function AnimatedTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
}: BottomTabBarProps) {
  const colors = useColors();
  const tabCount = state.routes.length;

  const position = useSharedValue(state.index);
  const tabWidth = useSharedValue(0);

  useEffect(() => {
    position.value = withSpring(state.index, SPRING);
  }, [state.index, position]);

  function handleLayout(event: LayoutChangeEvent) {
    tabWidth.value = event.nativeEvent.layout.width / tabCount;
  }

  const pillStyle = useAnimatedStyle(() => ({
    opacity: tabWidth.value > 0 ? 1 : 0,
    width: Math.max(tabWidth.value - PILL_MARGIN * 2, 0),
    transform: [{ translateX: position.value * tabWidth.value + PILL_MARGIN }],
  }));

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View style={styles.row} onLayout={handleLayout}>
        <Animated.View style={[styles.pill, { backgroundColor: colors.tint }, pillStyle]} />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = index === state.index;
          const label = options.title ?? route.name;

          const onPress = () => {
            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigateToTab(route.key);
            }
          };

          const onLongPress = () => {
            emitter.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <TabItem
              key={route.key}
              index={index}
              label={label}
              position={position}
              focused={focused}
              onPress={onPress}
              onLongPress={onLongPress}
              renderIcon={(color) => options.tabBarIcon?.({ focused, color, size: 22 })}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    height: 56,
    marginHorizontal: 8,
  },
  pill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 18,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    alignItems: 'center',
    gap: 2,
  },
  iconBox: {
    width: 26,
    height: 26,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});