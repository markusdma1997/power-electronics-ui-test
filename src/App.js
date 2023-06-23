import logo from './logo.svg';
import './App.css';
import { Amplify, Auth, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import awsconfig from './aws-exports';
import awsExports from "./aws-exports";

import config from './aws-exports';
import "@aws-amplify/ui-react/styles.css";
import {
    withAuthenticator,
    Button,
    Heading,
    Image,
    View,
    Card, Text,
} from "@aws-amplify/ui-react";

Amplify.configure(awsconfig);
Amplify.addPluggable(
    new AWSIoTProvider({
        aws_pubsub_region: 'eu-west-1',
        aws_pubsub_endpoint:
            'wss://arvb6j5c7prz6-ats.iot.eu-west-1.amazonaws.com/mqtt'
    })
);

function App({ signOut, user }) {
  return (
      <View className="App">
        <Card>
          <Image alt="logo" src={logo} height="10%" width="10%"/>
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
        <button onClick={signOut}>Sign out</button>
      </View>
  );
}

export default withAuthenticator(App);
