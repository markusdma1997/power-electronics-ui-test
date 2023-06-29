import { useState } from 'react';
import {
    Button,
    Card,
    Collection,
    Flex,
    Heading,
    ScrollView,
    TextField
} from "@aws-amplify/ui-react";
import * as React from "react";
import {PubSub} from "aws-amplify";

export default function MQTTSubscriptionTopicList() {
    const [topicList, setTopicList] = useState([
        {
            topicName: 'iot2050/greengrass/command/pause_looping',
            messageList: ['message 1: this is a long message to test the text wrap layout', 'message 2']
        }
    ]);

    const [mqttSubscriptionError, setMQTTSubscriptionError] = React.useState({
        mqttSubscriptionHasError: false,
        mqttSubscriptionErrorMessage: ''
    });

    async function validateAndInitiateMQTTSubscription(subscribeToTopicName) {
        // Initialize mqtt subscription topic error state
        setMQTTSubscriptionError({
            mqttSubscriptionHasError: false,
            mqttSubscriptionErrorMessage: ''
        });
        let topicIsValid = true;

        // Iterate through existing mqtt topic lists and check for validation
        topicList.forEach((topic, index) => {
            if (topic.topicName === subscribeToTopicName) {
                setMQTTSubscriptionError({
                    mqttSubscriptionHasError: true,
                    mqttSubscriptionErrorMessage: 'Topic ' + topic.topicName + ' has already been subscribed'
                })
                topicIsValid = false;
            }
        })

        if (topicIsValid) {
            subscribeToTopic(subscribeToTopicName);
        }

        // Subscribe to new topic name
        /*
        PubSub.subscribe(subscribeToTopicName).subscribe({
            next: data => {
                console.log('Message received ', data);
                setTopicList(topicList.map());
            },
            error: error => {
                console.error(error);
                setMQTTSubscriptionError({
                    mqttSubscriptionHasError: true,
                    mqttSubscriptionErrorMessage: error.toString()
                });
            },
            complete: () => console.log('topic unsubscribed')
        });

         */
    }

    function subscribeToTopic(subscribeToTopicName) {
        setTopicList([
            ...topicList,
            {
                topicName: subscribeToTopicName,
                messageList: []
            }
        ]);
        /*
        PubSub.subscribe(subscribeToTopicName).subscribe({
            next: data => console.log('Received subscription request', data),
            error: error => console.error(error),
            complete: () => console.log('Done')
        })
        */
    }

    function unsubscribeFromTopic(unsubscribeFromTopicName) {
        setTopicList(topicList.filter(t => t.topicName !== unsubscribeFromTopicName.item.topicName));
    }

    const newSubscriptionTopicInputRef = React.useRef(null);
    const newSubscriptionTopicButtonRef = React.useRef(null);
    const newSubscriptionTopicOnClick = React.useCallback(() => {
        newSubscriptionTopicInputRef.current.focus();
        subscribeToTopic(`${newSubscriptionTopicInputRef.current.value}`);
        console.log(topicList);
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
        <Card>
            <Heading level={4}>MQTT Dashboard</Heading>
            <Collection
                items={topicList}
                type="list"
                direction="row"
                templateColumns="1fr 1fr 1fr"
                gap="20px"
                alignItems="flex-start"
                wrap="wrap">
                {(item, index) => (
                    <Flex
                        wrap="wrap">
                        <Card
                            key={index}
                            borderRadius="medium"
                            width="24rem"
                            wrap="wrap"
                            variation="outlined">
                            <Heading level={6} overflow="scroll">
                                {item.topicName}
                            </Heading>
                            <ScrollView width="100%" height="200px">
                                {item.messageList.map(message => <p>{message}</p>)}
                            </ScrollView>
                            <Button
                                onClick={() => unsubscribeFromTopic({item})}>
                                Unsubscribe
                            </Button>
                        </Card>
                    </Flex>
                )}
            </Collection>
            <Card>
                <Flex
                    justifyContent="center"
                >
                    <TextField
                        variation="quiet"
                        descriptiveText="Enter a new topic for subscription"
                        label="New topic subscription"
                        alignItems="center"
                        ref={newSubscriptionTopicInputRef}
                        hasError={mqttSubscriptionError.mqttSubscriptionHasError}
                        errorMessage={mqttSubscriptionError.mqttSubscriptionErrorMessage}
                    />
                    <Button
                        variation="primary"
                        type="submit"
                        height="3rem"
                        alignSelf="flex-end"
                        // ref={newSubscriptionTopicButtonRef}
                        onClick={() => validateAndInitiateMQTTSubscription(`${newSubscriptionTopicInputRef.current.value}`)}>
                        Subscribe
                    </Button>
                </Flex>
            </Card>
        </Card>
    )
}
