import boto3, os, time, json, hashlib, io
from PIL import Image, ImageStat, ImageFilter

SQS_URL = os.environ.get('SQS_URL')
AWS_REGION = os.environ.get('AWS_REGION','ap-south-1')
UPLOAD_BUCKET = os.environ.get('UPLOAD_BUCKET','photos-upload-dev')
PROCESSED_BUCKET = os.environ.get('PROCESSED_BUCKET','photos-processed-dev')

s3 = boto3.client('s3', region_name=AWS_REGION)
sqs = boto3.client('sqs', region_name=AWS_REGION)

def calc_phash(image_bytes):
    # placeholder: use SHA256 trimmed as pseudo-hash for demo
    h = hashlib.sha256(image_bytes).hexdigest()
    return h[:16]

def detect_blur_pil(img):
    # rough blur metric: variance of Laplacian via edge detection (simulate)
    edges = img.filter(ImageFilter.FIND_EDGES).convert('L')
    stat = ImageStat.Stat(edges)
    var = stat.var[0] if stat.var else 0
    return {'variance': var}

def detect_closed_eyes_placeholder(img):
    # placeholder classifier: check average brightness of eye-region heuristically
    # In production, run pre-trained model on face crop
    w,h = img.size
    box = (w*0.3, h*0.2, w*0.7, h*0.5)
    crop = img.crop(box).convert('L').resize((50,20))
    stat = ImageStat.Stat(crop)
    avg = stat.mean[0]
    closed = avg < 60  # arbitrary threshold for demo
    return {'closed_eyes_prob': 0.9 if closed else 0.1}

def move_to_processed(bucket,key):
    copy_source = {'Bucket': bucket, 'Key': key}
    dest_key = key.replace('uploads/','processed/')
    s3.copy_object(Bucket=PROCESSED_BUCKET, CopySource=copy_source, Key=dest_key)
    s3.delete_object(Bucket=bucket, Key=key)
    return dest_key

def process_message(msg):
    body = json.loads(msg.get('Body','{}'))
    bucket = body.get('bucket', UPLOAD_BUCKET)
    key = body.get('key')
    print('Processing', bucket, key)
    obj = s3.get_object(Bucket=bucket, Key=key)
    data = obj['Body'].read()
    img = Image.open(io.BytesIO(data)).convert('RGB')
    phash = calc_phash(data)
    blur = detect_blur_pil(img)
    closed = detect_closed_eyes_placeholder(img)
    meta = {'key': key, 'phash': phash, 'blur': blur, 'closed': closed}
    print('Meta', meta)
    # store metadata to a datastore or object metadata (placeholder using S3 tag)
    s3.put_object_tagging(Bucket=bucket, Key=key, Tagging={'TagSet':[{'Key':'phash','Value':phash}]})
    # move to processed bucket
    try:
        dest = move_to_processed(bucket,key)
        print('Moved to', dest)
    except Exception as e:
        print('move error', e)
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
