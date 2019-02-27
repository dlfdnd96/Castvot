#!/bin/sh

CDN_MAXAGE=31536000

echo "--------Start---------"
pushd /home/ec2-user/castvot-front

date

echo " * git pull"

git pull

if [ $? -ne 0 ] ; then
	echo "!!!!!!! check error !!!!!!!!!"
	exit 1
fi

echo " * Sync public/ to CloudFront CDN"
aws s3 sync ./public/img/ s3://img1.castvot.com/public/img/ --acl public-read --delete --cache-control max-age=${CDN_MAXAGE}
aws s3 sync ./public/css/ s3://img1.castvot.com/public/css/ --acl public-read --delete --cache-control max-age=${CDN_MAXAGE}
aws s3 sync ./public/js/ s3://img1.castvot.com/public/js/ --acl public-read --delete --cache-control max-age=${CDN_MAXAGE}

echo " * Deploy"

time eb deploy

popd

echo "---------End----------"
