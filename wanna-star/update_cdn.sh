#!/bin/sh

aws cloudfront create-invalidation --distribution-id EKULH5EJWKF57 --paths "/js/*" "/css/*" "/img/*"
