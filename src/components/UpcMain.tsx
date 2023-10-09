
import { UpcItemModel } from "../model/UpcItem";
import { UpcInvModel } from "../model/UpcInv";
import { UpcItemView } from "./UpcItem";
import { QueryView } from "./query";
import { UpcApi } from "../service/UpcApi";
import * as React from 'react';
import { DetailsList, Panel, PanelType, initializeIcons, SelectionMode, Text, Label, Image } from 'office-ui-fabric-react';
import { ServiceStatusView } from "./ServiceStatus";

export class UpcMainHeader extends React.Component {
    render() {
        return (
            <h1>UPC Inventory</h1>
        );
    }
}

export interface UpcMainProps
{
    // no props for now...
}

export interface UpcMainState
{
    Results?: Array<UpcItemModel.IItem>;
    ShowPanel: boolean;
    Item: any;
}

export class UpcMain extends React.Component<UpcMainProps, UpcMainState>
{
    private m_model?: UpcInvModel.UpcInvMain;
    private m_upcApi: UpcApi = new UpcApi("https://upcinv-api.azurewebsites.net");

    constructor(props: UpcMainProps)
    {
        super(props);

        // bind *this* to setResults method so we capture the right context for the method
        // (so we can avoid having to do (newResults)=>{this.setResults(newResults) everywhere
        this.setResults = this.setResults.bind(this);

        this.state = { Results: undefined, ShowPanel: false, Item: undefined};

        initializeIcons();
    }

    async componentDidMount()
    {
        this.m_model = new UpcInvModel.UpcInvMain(this.m_upcApi);

        // await this.m_model.fillMockData(this.setResults);
    }

    async setResults(newResults: Array<UpcItemModel.IItem>)
    {
        this.setState({ Results: newResults });
    }

    // When a new item is selected, show additional information about it
    itemSelected = async (event: any) =>
    {
        // Lookup item before setting it to state
        var item: UpcItemModel.GenericItem = new UpcItemModel.GenericItem(this.m_upcApi);
        await item.Lookup(event.ID, event.Type);

        this.setState({ Item: item.Data });
        this.setState({ ShowPanel: true });
    }

    panelClose = () =>
    {
        this.setState({ ShowPanel: false });
    }

    renderItemList()
    {
        if (!this.state.Results)
            return (<div>Empty</div>);

        var items = [];
        
        for (let i: number = 0; i < this.state.Results.length; i++)
        {
            let item: UpcItemModel.IItem = this.state.Results[i];
            items.push(item);
        }
        return (<DetailsList
            items={items}
            columns={[
                { key: 'column1', name: 'Title', fieldName: 'Title', minWidth: 100, maxWidth: 200, isResizable: true },
                { key: 'column2', name: 'Location', fieldName: 'Location', minWidth: 100, maxWidth: 200, isResizable: true },
                { key: 'column3', name: 'Scan Code', fieldName: 'Code', minWidth: 100, maxWidth: 200, isResizable: true },
            ]}
            onActiveItemChanged={this.itemSelected}
            selectionMode={SelectionMode.single}
        />);
    }

    IsValidItem(item: object) : boolean
    {
        if (item)
            return true;

        return false;
    }

    RenderItem(item: any, field: string): boolean
    {
        if (!item)
            return false;

        if (item[field] && item[field] != null && item[field] !== "")
            return true;

        return false;
    }
    
    render()
    {
        const coverSrc = this.IsValidItem(this.state.Item) ? `https://data.upcinv.thetasoft.com/${this.state.Item.CoverSrc}` : "";
        const imgSrc = coverSrc.toLowerCase().replace(".wmf", ".jpg");

        return (
            <div>
                <UpcMainHeader />
                <ServiceStatusView.ServiceStatus ApiInterop={this.m_upcApi} />
                <QueryView.Query ApiInterop={this.m_upcApi} SetResults={this.setResults}/>
                <hr/>
                {this.renderItemList()}
                <Panel
                    isBlocking={false}
                    isOpen={this.state.ShowPanel}
                    onDismiss={this.panelClose}
                    type={PanelType.medium}
                    closeButtonAriaLabel="Close"
                >
                    <Label>Title
                        <br/>
                        <Text> { this.IsValidItem(this.state.Item) ? this.state.Item.Title : null} </Text>
                    </Label>
                    <Label
                        style={{
                            display: this.RenderItem(this.state.Item, "Author") ? "block" : "none"
                        }}>
                        Author
                        <br />
                        <Text> {this.IsValidItem(this.state.Item) ? this.state.Item.Author : null} </Text>
                    </Label>
                    <Label
                        style={{
                            display: this.RenderItem(this.state.Item, "Series") ? "block" : "none"
                        }}>
                        Series
                        <br />
                        <Text> {this.IsValidItem(this.state.Item) ? this.state.Item.Series : null} </Text>
                    </Label>
                    <Label
                        style={{
                            display: this.RenderItem(this.state.Item, "ReleaseDate") ? "block" : "none"
                        }}>
                        Release Date
                        <br />
                        <Text> {this.IsValidItem(this.state.Item) ? new Date(this.state.Item.ReleaseDate).toDateString() : null} </Text>
                    </Label>
                    <Label>First Scan
                        <br />
                        <Text> {this.IsValidItem(this.state.Item) ? new Date(this.state.Item.FirstScan).toDateString() : null} </Text>
                    </Label>
                    <Label>Last Scan
                        <br />
                        <Text> {this.IsValidItem(this.state.Item) ? new Date(this.state.Item.LastScan).toDateString() : null} </Text>
                    </Label>
                    <Label
                        style={{
                            display: this.RenderItem(this.state.Item, "Location") ? "block" : "none"
                        }}>
                        Location
                        <br />
                        <Text> {this.IsValidItem(this.state.Item) ? this.state.Item.Location : null} </Text>
                    </Label>
                    <Label
                        style={{
                            display: this.RenderItem(this.state.Item, "Summary") ? "block" : "none"
                        }}>
                        Summary
                        <br />
                        <span style={{ whiteSpace: "pre-line" }}><Text>{this.IsValidItem(this.state.Item) ? this.state.Item.Summary : null}</Text></span>
                    </Label>
                    <Label>Scan Code
                        <br />
                        <Text> {this.IsValidItem(this.state.Item) ? this.state.Item.Code : null} </Text>
                    </Label>
                    <Label
                        style={{
                            display: this.RenderItem(this.state.Item, "CoverSrc") ? "block" : "none"
                        }}>
                        Cover
                        <br />
                        <Image
                            src={imgSrc}
                        />
                    </Label>
                </Panel>
            </div>
        );
    }
}