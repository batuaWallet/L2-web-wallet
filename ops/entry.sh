#!/bin/bash

# Set default email & domain name
domain="${DOMAINNAME:-localhost}"
email="${EMAIL:-noreply@gmail.com}"

echo "domain=$domain email=$email"

########################################
# Setup SSL Certs

letsencrypt=/etc/letsencrypt/live
devcerts=$letsencrypt/localhost
mkdir -p $devcerts
mkdir -p /etc/certs
mkdir -p /var/www/letsencrypt

if [[ "$domain" == "localhost" && ! -f "$devcerts/privkey.pem" ]]
then
  echo "Developing locally, generating self-signed certs"
  openssl req -x509 -newkey rsa:4096 -keyout $devcerts/privkey.pem -out $devcerts/fullchain.pem -days 365 -nodes -subj '/CN=localhost'
fi

if [[ ! -f "$letsencrypt/$domain/privkey.pem" ]]
then
  echo "Couldn't find certs for $domain, using certbot to initialize those now.."
  certbot certonly --standalone -m "$email" --agree-tos --no-eff-email -d "$domain" -n
  [[ $? -eq 0 ]] || sleep 9999 # FREEZE! Don't pester eff & get throttled
fi

echo "Using certs for $domain"
ln -sf "$letsencrypt/$domain/privkey.pem" /etc/certs/privkey.pem
ln -sf "$letsencrypt/$domain/fullchain.pem" /etc/certs/fullchain.pem

# Hack way to implement variables in the nginx.conf file
# shellcheck disable=SC2016
sed -i 's/$hostname/'"$domain"'/' /etc/nginx/nginx.conf

# periodically fork off & see if our certs need to be renewed
function renewcerts {
  while true
  do
    echo -n "Preparing to renew certs... "
    if [[ -d "/etc/letsencrypt/live/$domain" ]]
    then
      echo -n "Found certs to renew for $domain... "
      certbot renew --webroot -w /var/www/letsencrypt/ -n
      echo "Done!"
    fi
    sleep 48h
  done
}

if [[ "$domain" != "localhost" ]]
then renewcerts &
fi

sleep 3 # give renewcerts a sec to do it's first check

echo "Entrypoint finished, executing nginx..."; echo
exec nginx
