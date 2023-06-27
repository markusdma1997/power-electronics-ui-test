import { useState } from 'react';
import {Button, Card, Collection, Flex, Heading, Text, TextField} from "@aws-amplify/ui-react";
import * as React from "react";

export default function MQTTSubscriptionTopicList() {
    const [topicList, setTopicList] = useState(['iot2050/greengrass/command/pause_looping']);

    function subscribeToTopic(topicName) {
        setTopicList([
            ...topicList,
            topicName
        ]);
        console.log(topicList);
    }

    function unsubscribeFromTopic(topicName) {
        setTopicList(topicList.filter(t => {
            console.log(t);
            console.log(typeof t);
            console.log(topicName);
            console.log(typeof topicName);
            console.log(t !== topicName);
            return t.toString() !== topicName.toString();
        }));
        console.log(topicList);
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
                            {item}
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
                // newSubscriptionTopicButtonRef={newSubscriptionTopicButtonRef}>
                onClick={() => subscribeToTopic(`${newSubscriptionTopicInputRef.current.value}`)}>
                Subscribe
            </Button>
        </Card>
    )
}
