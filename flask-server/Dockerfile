# Use official Python image
FROM python:3.10

# Set working directory
WORKDIR /app/backend

# Copy app files
COPY . .

# Install dependencies
RUN pip install pipenv
RUN pipenv install --dev --system --deploy

# Expose Flask's local port (Render dynamically assigns one)
EXPOSE 5000

# Run Gunicorn for production & local testing
CMD ["gunicorn", "-k", "eventlet", "-w", "1", "-b", "0.0.0.0:5000", "server:app"]
