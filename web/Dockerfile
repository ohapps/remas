FROM nginx:1.15
COPY /build/ /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

# docker build -t craighausner/decitrix-web .
#
# docker run -p 80:80 --name decitrix -d craighausner/decitrix-web
#
# docker push craighausner/decitrix-web