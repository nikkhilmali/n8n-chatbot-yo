// import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

// export class DashboardSummary implements INodeType {
//     description: INodeTypeDescription = {
//         // Basic node details will go here
        
//         displayName: 'Dashboard Summary',
//         name: 'DashboardSummary',
//         icon: 'file:yo-logo.png',
//         group: ['transform'],
//         version: 1,
//         subtitle: 'Get Yocharge Dashboard Summary Data',
//         description: 'Get data from Yocharge Dashboard API',
//         defaults: {
//             name: 'Dashboard Summary default',
//         },
//         inputs: [NodeConnectionType.Main],
//         outputs: [NodeConnectionType.Main],
//         credentials: [
//             {
//                 name: 'DashboardSummaryAPI',
//                 required: true,
//             },
//         ],
//         requestDefaults: {
//             baseURL: 'https://api.yocharge.com/v3/summary/',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//             },
//         },

//         properties: [
//             // {
//             //     displayName: 'Resource',
//             //     name: 'resource',
//             //     type: 'options',
//             //     noDataExpression: true,
//             //     options: [
//             //         {
//             //             name: 'Astronomy Picture of the Day',
//             //             value: 'astronomyPictureOfTheDay',
//             //         },
//             //         {
//             //             name: 'Mars Rover Photos',
//             //             value: 'marsRoverPhotos',
//             //         },
//             //     ],
//             //     default: 'astronomyPictureOfTheDay',
//             // },
//             // Operations will go here

//         ]
//     };
// }


import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeConnectionType,
} from 'n8n-workflow';

export class DashboardSummary implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Dashboard Summary',
        name: 'DashboardSummary',
        icon: 'file:yo-logo.png',
        group: ['transform'],
        version: 1,
        subtitle: 'Get Yocharge Dashboard Summary or Transaction Data',
        description: 'Fetch data from Yocharge Dashboard API (Summary or Transaction)',
        defaults: {
            name: 'Dashboard Summary default',
        },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [
            {
                name: 'DashboardSummaryAPI',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'API Type',
                name: 'apiType',
                type: 'options',
                options: [
                    {
                        name: 'Summary',
                        value: 'summary',
                    },
                    {
                        name: 'Transaction',
                        value: 'transactions',
                    },
                ],
                default: 'summary',
                description: 'Choose whether to fetch summary or transaction data',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            const apiType = this.getNodeParameter('apiType', i) as string;

            // Construct endpoint based on selected API type
            const endpoint = `/v3/${apiType}`;

            const response = await this.helpers.httpRequestWithAuthentication.call(
                this,
                'DashboardSummaryAPI',
                {
                    method: 'GET',
                    url: `https://api.yocharge.com${endpoint}`,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );

            returnData.push({
                json: response,
            });
        }

        return [returnData];
    }
}
