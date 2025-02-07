# Use an official Python runtime as a parent image
FROM python:3.10

# Set the working directory in the container
WORKDIR /app/backend

# Copy Pipfile and Pipfile.lock first to avoid reinstalling dependencies every time the source code changes
COPY Pipfile Pipfile.lock /app/backend/

# Install pipenv and dependencies
RUN pip install pipenv
RUN pipenv install --dev --system --deploy

# Install gunicorn globally for access during runtime
RUN pip install gunicorn

# Copy the rest of the application
COPY . /app/backend/

# Expose the Flask app's port
EXPOSE 5000

# Run the application using gunicorn
CMD ["gunicorn", "-k", "eventlet", "-w", "1", "-b", "0.0.0.0:5000", "server:app"]
