
import { UpcItemModel } from "../model/UpcItem";
import * as React from 'react';

export namespace UpcItemView
{
    export class Item extends React.Component<UpcItemModel.Props>
    {
        constructor(props: UpcItemModel.Props)
        {
            super(props);
        }

        render()
        {
            return (<div>
                Item ID: {this.props.ID} <br/>
                Item Title: {this.props.Title}
                </div>
            );
        }
    }
}