import { View, Text, TouchableOpacity, Image } from "react-native";
import Theme from "../styles/theme";
import Paragraph from "./Paragraph";
import { useDarkMode } from "react-native-dynamic";
import { DarkColors, LightColors } from "../styles/colors";

const WorkoutCard = props => {
  const isDarkMode = useDarkMode();
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
      <View>
        <Image
          style={{
            height: 160,
            width: 240,
            borderRadius: 8,
            marginBottom: 6,
            marginRight: 16
          }}
          source={{ uri: props.image }}
        />
        <Paragraph style={{ fontWeight: "600", marginBottom: 3, maxWidth: 240 }} numberOfLines={1}>
          {props.title}
        </Paragraph>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: isDarkMode ? DarkColors.primary : LightColors.primary,
              fontWeight: "500",
              marginRight: 8
            }}
          >
            {props.category}
          </Text>
          <View
            style={{
              width: 4,
              height: 4,
              backgroundColor: isDarkMode
                ? DarkColors.primary
                : LightColors.primary,
              marginRight: 8,
              borderRadius: 4
            }}
          />
          <Text
            style={{
              color: isDarkMode ? DarkColors.text : LightColors.text,
              fontSize: 12
            }}
          >
            {props.duration} min
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WorkoutCard;
