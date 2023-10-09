import { WebApiInterop } from "./WebApiInterop";
import { QueryView } from '../components/query'

// Interop layer for UpcApi service. These are the specific types and apis for UpcApi
export interface TUpcInvResult<T>
{
    CorrelationID: string;
    Reason: string;
    TheValue: T;
}

export interface ScanInfo
{
    Code: string;
    FirstScan: Date;
    LastScan: Date;
    Location: string;
    Title: string;
}

export interface DvdInfo
{
    Code: string;
    Title: string;
    FirstScan: Date;
    LastScan: Date;
}

export interface DvdInfoEx extends DvdInfo
{
    Summary: string;
    MediaType: string;
    Classification: string;
    CoverSrc: string;
}

export interface BookInfo
{
    Code: string;
    Title: string;
    Location: string;
    FirstScan: Date;
    LastScan: Date;
}

export interface BookInfoEx extends BookInfo
{
    Author: string;
    Summary: string;
    CoverSrc: string;
    Series: string;
    ReleaseDate: Date;
}

export interface WineInfo
{
    Code: string;
    Wine: string;
    Notes: string;
    Vintage: string;
    FirstScan: Date;
    LastScan: Date;
}

export interface BookQuery
{
    ScanCode: string;
    Title: string;
    Author: string;
    Series: string;
    Summary: string;
    ShouldQuerySinceDate: boolean;
    SinceDate: Date;
}

export interface DvdQuery
{
    Title: string;
    Summary: string;
    ShouldQuerySinceDate: boolean;
    SinceDate: Date;
}

export enum DiagnosticResult
{
    Unknown = -1,
    ServiceRunning = 0,
}

export interface UIR_ScanInfo extends TUpcInvResult<ScanInfo> { }

export interface UIR_DvdInfo extends TUpcInvResult<DvdInfo> { }

export interface UIR_DvdInfoEx extends TUpcInvResult<DvdInfoEx> { }

export interface UIR_DvdInfoList extends TUpcInvResult<DvdInfo[]> { }

export interface UIR_BookInfo extends TUpcInvResult<BookInfo> { }

export interface UIR_BookInfoEx extends TUpcInvResult<BookInfoEx> { }

export interface UIR_BookInfoExList extends TUpcInvResult<BookInfoEx[]> { }

export interface UIR_BookInfoList extends TUpcInvResult<BookInfo[]> { }

export interface UIR_WineInfo extends TUpcInvResult<WineInfo> { }

export interface UIR_String extends TUpcInvResult<string> { }

export interface UIR_DiagnosticResult extends TUpcInvResult<DiagnosticResult> { };


export class UpcApi {
    private m_apiInterop: WebApiInterop;

    constructor(sApiRoot: string) {
        this.m_apiInterop = new WebApiInterop(sApiRoot);
    }

    async Heartbeat(): Promise<UIR_DiagnosticResult>
    {
        let heartbeat: UIR_DiagnosticResult = await this.m_apiInterop.Fetch<TUpcInvResult<DiagnosticResult>>(
            "api/diagnostics/heartbeat",
            []);

        return heartbeat;
    }

    async GetBookScanInfo(ScanCode: string): Promise<UIR_BookInfo> {
        var scanInfo: UIR_BookInfo;

        scanInfo = await this.m_apiInterop.Fetch<TUpcInvResult<ScanInfo>>(
            "api/book/GetBookScanInfo",
            [{ "ScanCode": ScanCode }]);

        return scanInfo;
    }

    async GetFullBookScanInfo(ScanCode: string): Promise<UIR_BookInfoEx> {
        var scanInfo: UIR_BookInfoEx;

        scanInfo = await this.m_apiInterop.Fetch<TUpcInvResult<BookInfoEx>>(
            "api/book/GetFullBookScanInfo",
            [{ "ScanCode": ScanCode }]);

        return scanInfo;
    }

    async QueryBookScanInfos(Query: BookQuery): Promise<UIR_BookInfoExList> {
        var scanInfo: UIR_BookInfoExList;

        // there are two api's, switched by whether there is a SinceDate
        if (Query.ShouldQuerySinceDate)
        {
            scanInfo = await this.m_apiInterop.Fetch<TUpcInvResult<BookInfoEx[]>>(
                "api/book/QueryBookScanInfosSince",
                [
                    { "Title": Query.Title },
                    { "Author": Query.Author },
                    { "Series": Query.Series },
                    { "Summary": Query.Summary },
                    { "SinceDate": Query.SinceDate.toISOString() }
                ]);
        }
        else
        {
            scanInfo = await this.m_apiInterop.Fetch<TUpcInvResult<BookInfoEx[]>>(
                "api/book/QueryBookScanInfos",
                [
                    { "Title": Query.Title },
                    { "Author": Query.Author },
                    { "Series": Query.Series },
                    { "Summary": Query.Summary },
                ]);
        }
        return scanInfo;
    }

    async QueryDvdScanInfos(Query: DvdQuery): Promise<UIR_DvdInfoList>
    {
        var scanInfo: UIR_DvdInfoList;

        // there are two api's, switched by whether there is a SinceDate
        scanInfo = await this.m_apiInterop.Fetch<TUpcInvResult<DvdInfo[]>>(
            "api/dvd/QueryDvdScanInfos",
            [
                { "Title": Query.Title },
                { "Summary": Query.Summary },
                { "Since": Query.ShouldQuerySinceDate ? Query.SinceDate.toISOString() : "" }
            ]);
        return scanInfo;
    }

    async GetDvdScanInfosFromTitle(Query: DvdQuery): Promise<UIR_DvdInfoList>
    {
        var scanInfo: UIR_DvdInfoList;

        scanInfo = await this.m_apiInterop.Fetch<TUpcInvResult<DvdInfo[]>>(
            "api/dvd/GetDvdScanInfosFromTitle",
            [
                { "Title": Query.Title },
            ]);

        return scanInfo;
    }

    async GetFullDvdScanInfo(ScanCode: string): Promise<UIR_DvdInfoEx>
    {
        var scanInfo: UIR_DvdInfoEx;

        scanInfo = await this.m_apiInterop.Fetch<TUpcInvResult<DvdInfoEx>>(
            "api/dvd/GetFullDvdScanInfo",
            [{ "ScanCode": ScanCode }]);

        return scanInfo;
    }

}