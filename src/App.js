import * as React from 'react';
import logo from './logo.svg';
import './App.css';
import {Amplify, Auth, PubSub} from 'aws-amplify';
import {AWSIoTProvider} from '@aws-amplify/pubsub';
import awsconfig from './aws-exports';
import "@aws-amplify/ui-react/styles.css";
import {
    Card,
    Heading,
    Image,
    View,
    Text,
    withAuthenticator,
    Collection,
    TextField,
    Flex,
    Button,
} from "@aws-amplify/ui-react";

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

async function pubsubCreateSubscription(topic) {
    PubSub.subscribe(topic).subscribe({
        next: data => console.log('Message received ', data),
        error: error => console.log(error),
        complete: () => console.log('Subscription done')
    });
}

let subscribedTopics = [];

const App = function ({ signOut, user }) {
  const newSubscriptionTopicInputRef = React.useRef(null);
  const newSubscriptionTopicButtonRef = React.useRef(null);

  const newSubscriptionTopicOnClick = React.useCallback(() => {
      newSubscriptionTopicInputRef.current.focus();
      subscribedTopics.push({
          topic: `${newSubscriptionTopicInputRef.current.value}`
      })
  }, [])

  React.useEffect(() => {
      const newSubscriptionTopicButtonRefCurrent = newSubscriptionTopicButtonRef.current;
      if (newSubscriptionTopicButtonRef && newSubscriptionTopicButtonRefCurrent) {
          newSubscriptionTopicButtonRefCurrent.addEventListener('click', newSubscriptionTopicOnClick, false);
          return () => {
              newSubscriptionTopicButtonRefCurrent.removeEventListener('click', newSubscriptionTopicOnClick, false);
          };
      }
  }, [onclick]);

  return (
      <headers>
          <frame-options policy="SAMEORIGIN"/>
          <View className="App">
              <Card>
                  <Image alt="logo" src={logo} height="10%" width="10%"/>
                  <Heading level={1}>Power Electronics IoT2050 Dashboard</Heading>
              </Card>
              <Card>
                  <Heading level={4}>Triangular Wave from RTBox simulation</Heading>
                  <iframe
                      title="IoT2050 UDP"
                      src="http://localhost:3000/d-solo/e9c0307e-2873-4cc4-9a74-1347e5bee177/powerelectronics?orgId=1&refresh=5s&from=1687517021785&to=1687517321786&panelId=2"
                      width="450"
                      height="200"
                      frameBorder="0">
                  </iframe>
              </Card>
              <Card>
                  <Heading level={4}>MQTT Dashboard</Heading>
                  <Collection
                      items={subscribedTopics}
                      type="list"
                      direction="row"
                      gap="20px"
                      wrap="nowrap">
                      {(item, index) => (
                          <Card
                              key={index}
                              borderRadius="medium"
                              maxWidth="20rem"
                              variation="outlined">
                              <Text>
                                  item.topic
                              </Text>
                          </Card>
                      )}
                  </Collection>
                  <Flex>
                      <TextField
                          variation="quiet"
                          descriptiveText="Enter a new topic for subscription"
                          placeholder="iot2050/greengrass/query/file_status"
                          label="New topic subscription"
                          ref={newSubscriptionTopicInputRef}
                          errorMessage="Topic already subscribed"
                      />
                      <Button
                          newSubscriptionTopicButtonRef={newSubscriptionTopicButtonRef}>
                          Subscribe
                      </Button>
                  </Flex>
              </Card>
              <Button onClick={signOut}>Sign out</Button>
          </View>
      </headers>
  );
}

export default withAuthenticator(App);
