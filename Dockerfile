# Stage 1: Build the SvelteKit frontend
FROM node:18 AS frontend-builder
WORKDIR /src/spotiguess
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build the Flask Python backend
FROM python:3.9 AS backend-builder
WORKDIR /src/backend
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Stage 3: Combine the frontend and backend into a single image
FROM python:3.9
WORKDIR /app
COPY --from=frontend-builder /app/build ./frontend
COPY --from=backend-builder /app .
CMD [ "python", "app.py" ]

# TODO finalize the specifics here
