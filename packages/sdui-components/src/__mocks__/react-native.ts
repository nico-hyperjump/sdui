/* eslint-disable @typescript-eslint/no-explicit-any */

/** Minimal react-native mock for unit tests. */
const View = "View";
const Text = "Text";
const Image = "Image";
const TouchableOpacity = "TouchableOpacity";
const ScrollView = "ScrollView";
const TextInput = "TextInput";
const Switch = "Switch";
const FlatList = "FlatList";
const Modal = "Modal";
const ActivityIndicator = "ActivityIndicator";
const Linking = { openURL: () => Promise.resolve() };
const Platform = { OS: "ios" };
const Dimensions = { get: () => ({ width: 375, height: 812 }) };

const Animated = {
  View: "Animated.View",
  Value: class {
    _value: number;
    constructor(v: number) {
      this._value = v;
    }
  },
  timing: () => ({ start: (cb?: () => void) => cb?.() }),
  loop: () => ({ start: () => {}, stop: () => {} }),
  sequence: () => ({ start: (cb?: () => void) => cb?.() }),
};

const StyleSheet = {
  create: <T extends Record<string, any>>(styles: T): T => styles,
};

export {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  FlatList,
  Modal,
  ActivityIndicator,
  Linking,
  Platform,
  Dimensions,
  Animated,
  StyleSheet,
};
