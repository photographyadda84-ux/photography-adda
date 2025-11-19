import boto3, os, time, json, hashlib, base64
from PIL import Image, ImageStat
import io

SQS_URL = os.environ.get('SQS_URL')
AWS_REGION = os.environ.get('AWS_REGION','ap-south-1')
s3 = boto3.client('s3', region_name=AWS_REGION)
sqs = boto3.client('sqs', region_name=AWS_REGION)

def calc_phash(image_bytes):
    # placeholder: use simple hash for demo. Replace with pHash implementation.
    h = hashlib.sha256(image_bytes).hexdigest()
    return h[:16]

def detect_blur(image):
    # naive blur detection via variance of Laplacian could be used. Placeholder using PIL variance.
    stat = ImageStat.Stat(image)
    return {'variance': sum(stat.var) / len(stat.var)}

def process_message(msg):
    body = json.loads(msg.get('Body','{}'))
    bucket = body.get('bucket')
    key = body.get('key')
    print('Worker processing', bucket, key)
    obj = s3.get_object(Bucket=bucket, Key=key)
    data = obj['Body'].read()
    img = Image.open(io.BytesIO(data)).convert('RGB')
    phash = calc_phash(data)
    blur = detect_blur(img)
    # store metadata as json to processed bucket or metadata DB (placeholder)
    meta = {'key': key, 'phash': phash, 'blur': blur}
    print('Result', meta)
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
                time.sleep(2)

if __name__ == '__main__':
    print('Worker starting...')
    poll()
