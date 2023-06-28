import {Card, Heading} from "@aws-amplify/ui-react";
import * as React from "react";

export default function GrafanaDashboardPanel() {
    return (
        <Card>
            <Heading level={4}>Grafana Panel</Heading>
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
        </Card>
    )
}
