import { useEffect, useState } from "react";
import { Image, ScrollView, View, Text } from "react-native";
import { useDarkMode } from "react-native-dynamic";
import CategoryIcon from "../components/CategoryIcon";
import Container from "../components/Container";
import IconButton from "../components/IconButton";
import Paragraph from "../components/Paragraph";
import Section from "../components/Section";
import Subheading from "../components/Subheading";
import { DarkColors, LightColors } from "../styles/colors";
import Theme from "../styles/theme";
import firestore from "@react-native-firebase/firestore";

const WorkoutDetails = ({ navigation, route }) => {
  const isDarkMode = useDarkMode();
  const { data } = route.params;
  const [moves, setMoves] = useState([]);

  useEffect(() => {
    firestore()
      .collection("Workouts")
      .doc(data.id)
      .collection("Moves")
      .get()
      .then(response => {
        response.docs.map(doc => {
          const id = doc.id;
          const data = {
            id: id,
            ...doc.data()
          };
          setMoves(prev => [...prev, data]);
        });
      });
  }, []);

  const startWorkout = () => {
    navigation.navigate("StartTraining", { data: moves, thumbnail: data.image, id: data.id });
  };

  if (data) {
    return (
      <Container>
        <View style={{ marginTop: -40 }}>
          <Image
            source={{ uri: data.image }}
            style={{ height: 210, resizeMode: "cover", width: "100%" }}
          />
          <IconButton
            name="play"
            size={24}
            style={{
              backgroundColor: isDarkMode
                ? DarkColors.primary
                : LightColors.primary,
              position: "absolute",
              right: 20,
              bottom: 20
            }}
            color={"#FFFFFF"}
            onPress={startWorkout}
          />
        </View>
        <ScrollView
          style={[
            Theme.shadow,
            {
              backgroundColor: isDarkMode
                ? DarkColors.background
                : LightColors.background,
              paddingTop: 20,
              marginTop: -10,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              marginBottom: 80
            }
          ]}
        >
          <Section>
            <Subheading>
              {data.title}
            </Subheading>
          </Section>
          <Section>
            <Paragraph>
              {data.description}
            </Paragraph>
          </Section>
          <Section
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <CategoryIcon
              icon="🕐"
              style={{ width: "30%" }}
              title={`${data.duration} min`}
            />
            <CategoryIcon
              icon="🏋️"
              style={{ width: "30%" }}
              title={data.categories[0]}
            />
            <CategoryIcon
              icon="⚡️"
              style={{ width: "30%" }}
              title={data.level}
            />
          </Section>
          <Section>
            <Subheading>Exercises</Subheading>
          </Section>
          <Section
            style={{
              flexDirection: "column",
              backgroundColor: isDarkMode
                ? DarkColors.stroke
                : LightColors.white,
              borderRadius: 8
            }}
          >
            {moves.map((item, id) => {
              return (
                <View
                  key={id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomWidth: item.lastItem ? 0 : 1,
                    borderColor: isDarkMode
                      ? DarkColors.background
                      : LightColors.white,
                    width: "100%",
                    padding: 10,
                    paddingVertical: 10
                  }}
                >
                  <View style={{ flex: 0.15, marginRight: 5 }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: isDarkMode
                          ? DarkColors.background
                          : LightColors.background,
                        borderWidth: 1,
                        borderColor: isDarkMode
                          ? DarkColors.stroke
                          : LightColors.white
                      }}
                    >
                      <Text
                        style={{
                          color: isDarkMode ? DarkColors.text : LightColors.text
                        }}
                      >
                        {id + 1}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.85 }}>
                    <Paragraph style={{ fontWeight: "600" }}>
                      {item.title}
                    </Paragraph>
                    <Text
                      style={{
                        fontSize: 12,
                        color: isDarkMode ? DarkColors.text : LightColors.text
                      }}
                      numberOfLines={1}
                    >
                      {item.desc}
                    </Text>
                  </View>
                </View>
              );
            })}
          </Section>
        </ScrollView>
      </Container>
    );
  } else {
    navigation.navigate("Home");
  }
};

export default WorkoutDetails;
