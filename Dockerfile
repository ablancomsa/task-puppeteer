FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome \
  CHROME_PATH=/usr/bin/google-chrome

USER root

RUN rm -rf /var/lib/apt/lists/* && apt-get clean && apt-get update \
  && apt-get install -y \
  libx11-xcb1 \
  libxcb1 \
  libxcb-dri3-0 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxi6 \
  libxtst6 \
  libnss3 \
  libcups2 \
  libxss1 \
  libxrandr2 \
  libgconf-2-4 \
  libasound2 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libgtk-3-0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
EXPOSE 4000

COPY . .

CMD [ "node", "index.js" ]

