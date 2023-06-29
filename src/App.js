import * as React from 'react';
import logo from './logo.svg';
import './App.css';
import {Amplify, Auth} from 'aws-amplify';
import {AWSIoTProvider} from '@aws-amplify/pubsub';
import awsconfig from './aws-exports';
import "@aws-amplify/ui-react/styles.css";
import {
    Card, Heading, Image, View, withAuthenticator, Button, Flex
} from "@aws-amplify/ui-react";

import GrafanaDashboardPanel from "./grafana";
import AWSTimestreamManagementPanel from "./timestream";
import MQTTSubscriptionTopicList from "./topics";

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
    console.log('AWS cognito identity ID for current user is ' + cognitoIdentityId);
    alert('AWS cognito identity ID for current user is ' + cognitoIdentityId);
}

const App = function ({ signOut, user }) {
  return (
      <headers>
          <frame-options policy="SAMEORIGIN"/>
          <View className="App">
              <Card>
                  <Image alt="logo" src={logo} height="10%" width="10%"/>
                  <Heading level={1}>Power Electronics IoT2050 Dashboard</Heading>
              </Card>
              <GrafanaDashboardPanel/>
              <AWSTimestreamManagementPanel/>
              <MQTTSubscriptionTopicList/>
              <Flex>
                  <Button
                      onClick={getCognitoIdentityId}
                      alignSelf="flex-end">
                      Retrieve AWS cognito identity ID
                  </Button>
                  <Button
                      onClick={signOut}
                      alignSelf="flex-end">
                      Sign out
                  </Button>
              </Flex>
          </View>
      </headers>
  );
}

export default withAuthenticator(App);
