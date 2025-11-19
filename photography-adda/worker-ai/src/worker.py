import boto3
import os, time, json
from botocore.exceptions import ClientError

SQS_URL = os.environ.get('SQS_URL')
AWS_REGION = os.environ.get('AWS_REGION','ap-south-1')
s3 = boto3.client('s3', region_name=AWS_REGION)
sqs = boto3.client('sqs', region_name=AWS_REGION)

def process_message(msg):
    body = json.loads(msg.get('Body','{}'))
    bucket = body.get('bucket')
    key = body.get('key')
    print('Processing', bucket, key)
    # placeholder: download, run detection, compute score, move to processed bucket
    time.sleep(1)
    return True

def poll():
    while True:
        resp = sqs.receive_message(QueueUrl=SQS_URL, MaxNumberOfMessages=1, WaitTimeSeconds=10)
        msgs = resp.get('Messages', [])
        if not msgs:
            time.sleep(1)
            continue
        for m in msgs:
            try:
                ok = process_message(m)
                if ok:
                    sqs.delete_message(QueueUrl=SQS_URL, ReceiptHandle=m['ReceiptHandle'])
            except Exception as e:
                print('worker error', e)

if __name__ == '__main__':
    print('Worker starting...')
    poll()
