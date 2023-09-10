import {Text} from 'react-native';
import Container from '../components/Container';
import Section from '../components/Section';
import Input from '../components/Input';
import Subheading from '../components/Subheading';
import Paragraph from '../components/Paragraph';
import {useState} from 'react';
import Heading from '../components/Heading';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CreateWorkout = () => {
  const [title, setTitle] = useState('');
  return (
    <Container style={{marginTop: '-7.5%'}}>
      <Section
        style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
        <Paragraph style={{fontWeight: '600', marginBottom: 5}}>
          Workout Title
        </Paragraph>
        <Input
          placeholder="Enter workout title"
          value={title}
          onChangeText={e => {
            setTitle(e);
          }}
        />
      </Section>
      <Section
        style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          <Button title="Add Exercise" type="with_icon" icon={<Icon name={"plus"} size={20} color={"#000"} style={{marginRight: 5}} />} />
      </Section>
    </Container>
  );
};

export default CreateWorkout;
