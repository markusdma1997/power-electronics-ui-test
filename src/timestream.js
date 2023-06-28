import {Button, Card, Collection, Flex, Heading, ScrollView, Text} from "@aws-amplify/ui-react";
import * as React from "react";
import {useState} from "react";

import { TimestreamQueryClient, QueryCommand } from "@aws-sdk/client-timestream-query";
import { TimestreamWriteClient, ListDatabasesCommand, ListTablesCommand } from "@aws-sdk/client-timestream-write";
const writeClient = new TimestreamWriteClient({ region: "eu-west-1" });

export default function AWSTimestreamManagementPanel() {
    const [timestreamDatabaseList, setTimestreamDatabaseList] = useState([
        {
            databaseName: '',
            tableList: []
        }
    ]);

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
                    console.log("Error while listing tables, ", error);
                }
            }
        } catch (error) {
            console.log("Error while listing databases, ", error);
        }
    }

    return (
        <Card>
            <Heading level={4}>AWS Timestream Management</Heading>
            <Flex>
                <Card>
                    <Heading level={5}>AWS Timestream Databases</Heading>
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
                </Card>
                <Card>
                    <Card>
                        <Heading>Submit a query to execute on a regular base</Heading>
                    </Card>
                    <Card>
                        <Heading>Query result</Heading>
                    </Card>
                </Card>
            </Flex>
        </Card>
    )
}
