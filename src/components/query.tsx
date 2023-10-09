import { UIR_BookInfoEx, BookInfo, UIR_BookInfoExList, UpcApi, BookQuery, DvdQuery, UIR_DvdInfoList } from "../service/UpcApi";
import { UpcItemModel } from "../model/UpcItem";
import { SetResultsCallback } from "../model/UpcInv";
import { DefaultButton, TextField, Stack, Pivot, PivotItem, PivotLinkSize, Checkbox, Toggle, DatePicker } from 'office-ui-fabric-react';
import * as React from 'react';
import * as ReactDom from 'react-dom';

export namespace QueryView
{
    export interface Props
    {
        ApiInterop: UpcApi;
        SetResults: SetResultsCallback;
    }

    export class Query extends React.Component<QueryView.Props>
    {
        private m_upcApi: UpcApi;
        private m_setResults: SetResultsCallback;

        // don't want value of the textfields to be null
        state = {
            queryScanCode: "",
            queryTitle: "",
            queryAuthor: "",
            querySeries: "",
            querySummary: "",
            searchDetails: false,
            sinceChecked: false,
            sinceDate: new Date()
        };

        constructor(props: QueryView.Props)
        {
            super(props);

            this.m_upcApi = props.ApiInterop;
            this.m_setResults = props.SetResults;

            // bind our context to these methods
            this.BookQuery = this.BookQuery.bind(this);
            this.DvdQuery = this.DvdQuery.bind(this);
        }

        updateQueryScanCode = (event: any) =>
        {
            this.setState({ queryScanCode: event.target.value });
        }

        updateQueryTitle = (event: any) =>
        {
            this.setState({ queryTitle: event.target.value });
        }

        updateQueryAuthor = (event: any) =>
        {
            this.setState({ queryAuthor: event.target.value });
        }

        updateQuerySeries = (event: any) =>
        {
            this.setState({ querySeries: event.target.value });
        }

        updateQuerySummary = (event: any) => 
        {
            this.setState({ querySummary: event.target.value });
        }

        updateSinceChecked = (event: any, checked?: boolean) =>
        {
            this.setState({ sinceChecked: checked });
        }

        updateSinceDate = (sinceDate: Date | null | undefined) =>
        {
            this.setState({ sinceDate: sinceDate });
        }

        async BookQuery()
        {
            var query: BookQuery =
            {
                Author: this.state.queryAuthor,
                ScanCode: this.state.queryScanCode,
                Series: this.state.querySeries,
                Title: this.state.queryTitle,
                Summary: this.state.querySummary,
                ShouldQuerySinceDate: this.state.sinceChecked,
                SinceDate: this.state.sinceDate
            }

            this.m_setResults([]);

            if (query.ScanCode === "")
            {
                let scanInfo: UIR_BookInfoExList = await this.m_upcApi.QueryBookScanInfos(query);

                let newResults: UpcItemModel.IItem[] = [];
                scanInfo.TheValue.forEach((val) =>
                {
                    newResults.push(UpcItemModel.GenericItem.CreateFromValues(val.Code, val.Title, "book", val));
                });

                this.m_setResults(newResults);
                return true;
            }
            else
            {
                let scanInfo: UIR_BookInfoEx = await this.m_upcApi.GetFullBookScanInfo(this.state.queryScanCode);

                let newResults: UpcItemModel.IItem[] =
                [
                    UpcItemModel.GenericItem.CreateFromValues(scanInfo.TheValue.Code,
                        scanInfo.TheValue.Title,
                        "book",
                        scanInfo.TheValue)
                ];

                this.m_setResults(newResults);
                return true;
            }
        }

        async DvdQuery()
        {
            var query: DvdQuery =
            {
                Title: this.state.queryTitle,
                Summary: this.state.querySummary,
                ShouldQuerySinceDate: this.state.sinceChecked,
                SinceDate: this.state.sinceDate
            }

            this.m_setResults([]);

            let scanInfo: UIR_DvdInfoList = await this.m_upcApi.QueryDvdScanInfos(query);

            let newResults: UpcItemModel.IItem[] = [];
            scanInfo.TheValue.forEach((val) =>
            {
                newResults.push(UpcItemModel.GenericItem.CreateFromValues(val.Code, val.Title, "dvd", val));
            });

            this.m_setResults(newResults);
            return true;
        }

        SearchBookDetails = (event: any, isChecked: boolean) =>
        {
            console.log(isChecked);
            this.setState({ searchDetails: isChecked });
        }

        render()
        {
            // note that we initialize the value of our controls to our state, which means we can
            // stay in sync by using the update method

            //<Stack tokens={{ childrenGap: 15 }} styles={{ root: { width: 300 } }}>
            return (
                <div>
                    <Pivot linkSize={PivotLinkSize.large}>
                        <PivotItem headerText="Book">
                            <Stack horizontal wrap tokens={{ childrenGap: 's2' }} styles={{ root: {  } }}>
                                <span>
                                    <TextField label="Scan Code:" id="queryScanCode" value={this.state.queryScanCode} type="string" onChange={this.updateQueryScanCode} />
                                </span>
                                <span>
                                    <TextField label="Title:" id="queryTitle" value={this.state.queryTitle} type="string" onChange={this.updateQueryTitle} />
                                </span>
                                <span>
                                    <TextField label="Author:" id="queryAuthor" value={this.state.queryAuthor} type="string" onChange={this.updateQueryAuthor} />
                                </span>
                                <span>
                                    <TextField label="Series:" id="querySeries" value={this.state.querySeries} type="string" onChange={this.updateQuerySeries} />
                                </span>
                                <span>
                                    <TextField label="Summary:" id="querySummary" value={this.state.querySummary} type="string" onChange={this.updateQuerySummary} />
                                </span>
                                <span>
                                    <Toggle label="Date Filter" onText="Purchased Since" offText="Off" inlineLabel checked={this.state.sinceChecked} onChange={this.updateSinceChecked} />
                                </span>
                                <span>
                                    <DatePicker 
                                        disabled={!this.state.sinceChecked}
                                        isRequired={false}
                                        allowTextInput={true}
                                        value={this.state.sinceDate}
                                        onSelectDate={this.updateSinceDate} />

                                </span>
                            </Stack>
                            <br />
                            <DefaultButton text="Query" id="querySubmit" onClick={this.BookQuery} />
                            <br />
                        </PivotItem>
                        <PivotItem headerText="DVD">
                            <Stack horizontal wrap tokens={{ childrenGap: 's2' }} styles={{ root: {  } }}>
                                <span>
                                    <TextField label="Title:" id="queryTitle" value={this.state.queryTitle} type="string" onChange={this.updateQueryTitle} />
                                </span>
                                <span>
                                    <TextField label="Summary:" id="querySummary" value={this.state.querySummary} type="string" onChange={this.updateQuerySummary} />
                                </span>
                                <span>
                                    <Toggle label="Date Filter" onText="On" offText="Off" inlineLabel checked={this.state.sinceChecked} onChange={this.updateSinceChecked} />
                                </span>
                                <span>
                                    <DatePicker
                                        disabled={!this.state.sinceChecked}
                                        isRequired={false}
                                        allowTextInput={true}
                                        value={this.state.sinceDate}
                                        onSelectDate={this.updateSinceDate}

                                    />
                                </span>
                            </Stack>
                            <br />
                            <DefaultButton text="Query" id="querySubmit" onClick={this.DvdQuery} />
                            <br />
                        </PivotItem>
                        <PivotItem headerText="Wine">
                        </PivotItem>
                    </Pivot>
                </div>
            );
        }
    }
}