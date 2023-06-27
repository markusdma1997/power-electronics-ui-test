import { useState } from 'react';
import {Button, Card, Collection, Flex, Heading, Text, TextAreaField, TextField} from "@aws-amplify/ui-react";
import * as React from "react";

export default function MQTTSubscriptionTopicList() {
    const [topicList, setTopicList] = useState([
        {
            topicName: 'iot2050/greengrass/command/pause_looping',
            messageList: ['message 1', 'message 2']
        }
    ]);

    function subscribeToTopic(subscribeToTopicName) {
        setTopicList([
            ...topicList,
            {
                topicName: subscribeToTopicName,
                messageList: []
            }
        ]);
    }

    function unsubscribeFromTopic(unsubscribeFromTopicName) {
        setTopicList(topicList.filter(t => t.topicName !== unsubscribeFromTopicName.item));
    }

    const newSubscriptionTopicInputRef = React.useRef(null);
    const newSubscriptionTopicButtonRef = React.useRef(null);
    const newSubscriptionTopicOnClick = React.useCallback(() => {
        newSubscriptionTopicInputRef.current.focus();
        subscribeToTopic(`${newSubscriptionTopicInputRef.current.value}`)
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
                type="grid"
                direction="row"
                gap="20px"
                wrap="wrap">
                {(item, index) => (
                    <Card
                        key={index}
                        borderRadius="medium"
                        maxWidth="20rem"
                        variation="outlined">
                        <Text>
                            {item.topicName}
                        </Text>
                        <Text>
                            {item.messageList}
                        </Text>
                        <Button
                            onClick={() => unsubscribeFromTopic({item})}>
                            Unsubscribe
                        </Button>
                    </Card>
                )}
            </Collection>
            <TextField
                variation="quiet"
                descriptiveText="Enter a new topic for subscription"
                placeholder="iot2050/greengrass/query/file_status"
                label="New topic subscription"
                ref={newSubscriptionTopicInputRef}
                errorMessage="Topic already subscribed"
            />
            <Button
                variation="primary"
                size="small"
                newSubscriptionTopicButtonRef={newSubscriptionTopicButtonRef}>
                // onClick={() => subscribeToTopic(`${newSubscriptionTopicInputRef.current.value}`)}>
                Subscribe
            </Button>
        </Card>
    )
}
