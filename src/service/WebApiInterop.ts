
export class WebApiInterop
{
    private m_sApiRoot : string;

    constructor(sApiRoot: string)
    {
        this.m_sApiRoot = sApiRoot;
    }

    async FetchJson(sApi: string, args: any[]): Promise<any>
    {
        let rgs: string[] = [];

        for (var arg of args) {
            for (var key in arg) {
                rgs.push(`${key}=${arg[key]}`);
            }
        }

        let sCall = this.m_sApiRoot.concat("/", sApi, "?", rgs.join("&"));

        let result: Response = await fetch(
            sCall,
            {
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'// ,
                }
            });

        if (result.status >= 400)
            throw new Error(`FetchJson failed: (${result.status})`);

        return await result.json();
    }

    async Fetch<T>(sApi: string, args: any[]): Promise<T>
    {
        var json = await this.FetchJson(sApi, args);

        return json as T;
    }
}