FROM alpine:3.10

RUN apk add --update --no-cache bash certbot curl iputils nginx openssl && \
    openssl dhparam -out /etc/ssl/dhparam.pem 2048 && \
    ln -fs /dev/stdout /var/log/nginx/access.log && \
    ln -fs /dev/stdout /var/log/nginx/error.log

RUN curl https://raw.githubusercontent.com/vishnubob/wait-for-it/ed77b63706ea721766a62ff22d3a251d8b4a6a30/wait-for-it.sh > /bin/wait-for && chmod +x /bin/wait-for

COPY ops/nginx.conf /etc/nginx/nginx.conf
COPY ops/entry.sh /root/entry.sh
COPY build /var/www/html

ENTRYPOINT ["bash", "/root/entry.sh"]
