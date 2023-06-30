import {Button, Card, Collection, Flex, Heading, ScrollView, Text, TextField} from "@aws-amplify/ui-react";
import * as React from "react";
import { useState } from "react";
import { Amplify, API } from 'aws-amplify';
import awsconfig from './aws-exports';

import { TimestreamQueryClient, QueryCommand } from "@aws-sdk/client-timestream-query";
import { TimestreamWriteClient, ListDatabasesCommand, ListTablesCommand } from "@aws-sdk/client-timestream-write";
// import { defaultProvider } from "@aws-sdk/credential-provider-node";
// import { getDefaultRoleAssumerWithWebIdentity } from "@aws-sdk/client-sts";

//const credentialProvider = defaultProvider({
//    roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity()
// });

// const writeClient = new TimestreamWriteClient({
//    region: "eu-west-1",
//    credentialDefaultProvider: credentialProvider
    // credentialDefaultProvider: 'eu-west-1_brHJt8g9C'
//});

export default function AWSTimestreamManagementPanel() {
    Amplify.configure(awsconfig);

    const [timestreamDatabaseList, setTimestreamDatabaseList] = useState([
        {
            databaseName: '',
            tableList: []
        }
    ]);

    const apiName = 'powerelectronicsuitest-timestream-management-API'
    const path = 'https://ki6univp1i.execute-api.eu-west-1.amazonaws.com/default/powerelectronicsuitest-timestream-management'
    const myInit = {
        headers: {},
        response: true
    }

    async function refreshTimestreamDatabaseList() {
        API.get(apiName, path, myInit)
            .then((response) => {
                console.log(response);
            })
            .catch(((error) => {
                console.log(error.response);
            }))
    }

    /*
    async function refreshTimestreamDatabaseList() {
        const listDatabaseParams = {
            MaxResults: 50
        };
        const listDatabasesCommand = new ListDatabasesCommand(listDatabaseParams);
        try {
            const databaseData = await writeClient.send(listDatabasesCommand);
            for (const database of databaseData.Databases) {
                const listTableParams = {
                    MaxResults: 50,
                    DatabaseName: database.DatabaseName
                }
                const listTableCommand = new ListTablesCommand(listTableParams);
                try {
                    const tableData = await writeClient.send(listTableCommand);
                    const currentTableList = tableData.Tables.map((table) => {
                        return table.TableName;
                    });
                    setTimestreamDatabaseList([
                        ...timestreamDatabaseList,
                        {
                            databaseName: database.DatabaseName,
                            tableList: currentTableList
                        }
                    ])
                } catch (error) {
                    console.log("Error while listing tables,", error);
                }
            }
        } catch (error) {
            console.log("Error while listing databases,", error);
        }
    }
     */

    return (
        <Card>
            <Heading level={4}>AWS Timestream Databases</Heading>
            <Collection
                items={timestreamDatabaseList}
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
                                {item.databaseName}
                            </Heading>
                            <ScrollView width="100%" height="200px">
                                {item.tableList.map(table => <p>{table}</p>)}
                            </ScrollView>
                        </Card>
                    </Flex>
                )}
            </Collection>
            <Button
                variation="primary"
                type="submit"
                height="3rem"
                alignSelf="flex-end"
                // ref={newSubscriptionTopicButtonRef}
                onClick={() => refreshTimestreamDatabaseList()}>
                Refresh
            </Button>
            <Card>
                <Flex
                    justifyContent="center"
                >
                    <TextField
                        variation="quiet"
                        descriptiveText="Submit a query to execute on AWS Timestream"
                        label="Timestream query"
                        alignItems="center"
                    />
                </Flex>
            </Card>
        </Card>
    )
}
