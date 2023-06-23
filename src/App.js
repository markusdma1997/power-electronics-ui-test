import logo from './logo.svg';
import './App.css';
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";

Amplify.configure(config);


function App() {
  return (
      <View className="App">
        <Card>
          <Image alt="logo" src={logo} />
          <Heading level={1}>Power Electronics IoT2050 Dashboard</Heading>
        </Card>
        <Card>
          <iframe
              title="IoT2050 UDP"
              src="http://localhost:3000/d-solo/e9c0307e-2873-4cc4-9a74-1347e5bee177/powerelectronics?orgId=1&refresh=5s&from=1687517021785&to=1687517321786&panelId=2"
              width="450"
              height="200"
              frameBorder="0">
          </iframe>
        </Card>
      </View>
  );
}

export default App;
