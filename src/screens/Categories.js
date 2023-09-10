import {useNavigation} from '@react-navigation/native';
import {FlatList, View} from 'react-native';
import CategoryCardHorizontal from '../components/CategoryCardHorizontal';
import Container from '../components/Container';
import Section from '../components/Section';

const Categories = () => {
  const navigation = useNavigation();

  // const renderItem = ({item, index}) => {
  //   return (
  //     <CategoryCardHorizontal
  //       key={index}
  //       title={item.title}
  //       desc={item.desc}
  //       icon={item.icon}
  //       onPress={() => navigation.navigate('Home', {category: item})}
  //     />
  //   );
  // };
  return (
    <Container style={{paddingTop: 20, paddingBottom: 60}}>
      <Section>
        {/* <FlatList data={categories} renderItem={renderItem} /> */}
      </Section>
    </Container>
  );
};

export default Categories;
