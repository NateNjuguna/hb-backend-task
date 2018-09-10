# Configure NodeJS Engine version
FROM node:8.11.4
# Make and move to a working directory
WORKDIR /opt/hb-backend-task
# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install
# Copy source
COPY . /opt/hb-backend-task
# Set environment variables
ENV NODE_ENV production
ENV HB_PORT 3000
#ENV HB_SECRET <JWT secret here>
ENV HB_SECRET iZ2Qm%N*#@qr|Q4_a`HzuEF1V^E2=?b/}<y*ldp`9ayzt&H(-<wBB}OFBSoI%6A
#Run the application
EXPOSE 3000
CMD npm start
