import * as AWS from 'aws-sdk'

const cloudwatch = new AWS.CloudWatch()

const namespace = process.env.NAMESPACE

export async function createTodoDuration(duration: number): Promise<void> {
    await putTimeMetric('Create', duration)
}

export async function loadTodosDuration(duration: number): Promise<void> {
    await putTimeMetric('LoadList', duration)
}

export async function updateTodoDuration(duration: number): Promise<void> {
    await putTimeMetric('Update', duration)
}

export async function deleteTodoDuration(duration: number): Promise<void> {
    await putTimeMetric('Delete', duration)
}

export function timeInMillis(): number {
    return new Date().getTime()
}

async function putTimeMetric(operationName: string, duration: number): Promise<void> {
    await cloudwatch.putMetricData({
        MetricData: [
            {
                MetricName: 'Duration',
                Dimensions: [
                    {
                        Name: 'OperationName',
                        Value: operationName
                    }
                ],
                Unit: 'Milliseconds',
                Value: duration
            }
        ],
        Namespace: namespace
    }).promise()
}