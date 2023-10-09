
import fetch from 'cross-fetch';
import { UpcApi, BookInfo, UIR_BookInfoEx, DvdInfo, UIR_DvdInfo, DvdInfoEx, UIR_DvdInfoEx } from "../service/UpcApi";
var htmlencode = require('html-encoder-decoder');

export namespace UpcItemModel
{
    export interface Props
    {
        readonly Title: string;
        readonly ID: string;
        readonly key: string;
        readonly Data: object | null;
    }

    export interface IItem extends Props
    {
        Lookup(id: string, type: string): Promise<boolean>;
    }


    export class GenericItem implements IItem
    {
        private m_title: string = "";
        private m_id: string = "";
        private m_key: string = "";
        private m_data: any | null = null;
        private m_type: string = "";

        private m_upcApi: UpcApi | null;

        get Type(): string
        {
            return this.m_type;
        }

        get Title(): string
        {
            return this.m_title;
        }

        get ID(): string
        {
            return this.m_id;
        }

        get key(): string
        {
            return this.m_key;
        }

        get Data(): object | null {
            return this.m_data;
        }

        constructor(upcApi: UpcApi | null)
        {
            this.m_upcApi = upcApi;
        }

        public static CreateFromValues(id: string, title: string, type: string, data: object): GenericItem
        {
            let newItem: GenericItem = new GenericItem(null);

            newItem.m_title = title;
            newItem.m_id = id;
            newItem.m_key = id;
            newItem.m_type = type;
            newItem.m_data = data;

            return newItem;
        }

        static ConvertFormattedSQLString(sRaw: string): string
        {
            // first, double all CR
            sRaw = sRaw.replace(/\x0d\x0a/g, "\n");
            sRaw = sRaw.replace(/\n/g, "\n\n");

            // now, remove any triples and collapse to double (do this twice to get quadrupled)
            sRaw = sRaw.replace(/\n\n\n/g, "\n\n");
            sRaw = sRaw.replace(/\n\n\n/g, "\n\n");

            // now we have to get rid of HTML NCR's

            // first, &#10 becomes a CR
            sRaw = sRaw.replace(/&#10;/, "\n");

            // and replace the rest
            return htmlencode.decode(sRaw);

        }

        async Lookup(id: string, type: string): Promise<boolean>
        {
            if (this.m_upcApi == null)
                return false;

            if (type === "book")
            {
                let scanInfo: UIR_BookInfoEx = await this.m_upcApi.GetFullBookScanInfo(id);

                this.m_id = scanInfo.TheValue.Code;
                this.m_title = scanInfo.TheValue.Title;
                this.m_data = scanInfo.TheValue;

                if (this.m_data && this.m_data["Summary"])
                {
                    this.m_data["Summary"] = GenericItem.ConvertFormattedSQLString(this.m_data["Summary"]);
                }
                
                return true;
            }

            if (type === "dvd")
            {
                let scanInfo: UIR_DvdInfoEx = await this.m_upcApi.GetFullDvdScanInfo(id);

                this.m_id = scanInfo.TheValue.Code;
                this.m_title = scanInfo.TheValue.Title;
                this.m_data = scanInfo.TheValue;

                return true;
            }

            return false;
        }
    }
}