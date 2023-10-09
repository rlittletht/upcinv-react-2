import * as React from 'react';
import { UpcApi, DiagnosticResult, UIR_DiagnosticResult } from "../service/UpcApi";

export namespace ServiceStatusView
{
    import Unknown = DiagnosticResult.Unknown;

    export interface Props
    {
        ApiInterop: UpcApi;
    }

    export class ServiceStatus extends React.Component<ServiceStatusView.Props>
    {
        state = { serviceStatus: Unknown };

        constructor(props: ServiceStatusView.Props)
        {
            super(props);
        }

        async componentDidMount()
        {
            let result: UIR_DiagnosticResult = await this.props.ApiInterop.Heartbeat();

            this.setState({ serviceStatus: result });
        }

        ServiceStatusString(): string
        {
            if (this.state.serviceStatus === DiagnosticResult.Unknown)
                return "Checking...";
            else
                return "Running";
        }

        render()
        {
            return (<span>
                        Service Status: { this.ServiceStatusString() }
                    </span>
            );
        }
    }
}
