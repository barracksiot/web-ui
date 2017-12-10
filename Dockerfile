FROM nginx:1.9
MAINTAINER      Brice Argenson <brice@barracks.io>

COPY            nginx.conf              /etc/nginx/nginx.conf
COPY            dist                    /usr/share/nginx/html/app
COPY            public                  /usr/share/nginx/html/public
