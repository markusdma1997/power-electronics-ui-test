import logo from './logo.svg';
import './App.css';
import {Amplify, Auth} from 'aws-amplify';
import {AWSIoTProvider} from '@aws-amplify/pubsub';
import awsconfig from './aws-exports';
import "@aws-amplify/ui-react/styles.css";
import {Card, Heading, Image, View, withAuthenticator,} from "@aws-amplify/ui-react";

Amplify.configure(awsconfig);
Amplify.addPluggable(
    new AWSIoTProvider({
        aws_pubsub_region: 'eu-west-1',
        aws_pubsub_endpoint:
            'wss://arvb6j5c7prz6-ats.iot.eu-west-1.amazonaws.com/mqtt'
    })
);

async function signUp() {
    try {
        let username, password, email, phone_number;
        const { user } = await Auth.signUp({
            username,
            password,
            attributes: {
                email,          // optional
                phone_number,   // optional - E.164 number convention
                // other custom attributes
            },
            autoSignIn: { // optional - enables auto sign in after user is confirmed
                enabled: true,
            }
        });
        console.log(user);
    } catch (error) {
        console.log('error signing up:', error);
    }
}

async function getCognitoIdentityId() {
    let cognitoIdentityId = await Auth.currentCredentials().then((info) => {
        return info.identityId;
    });
    console.log(cognitoIdentityId);
}

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
        <button onClick={getCognitoIdentityId}>Get current user cognito identity id</button>
      </View>
  );
}

export default withAuthenticator(App);
