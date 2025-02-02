# Use an official Python runtime as a parent image
FROM python:3.10

# Set the working directory in the container
WORKDIR /app/backend

# Copy the current directory contents into the container at /app
COPY . .

# Install pipenv
RUN pip install pipenv

# Install dependencies using pipenv (uses Pipfile.lock to ensure exact versions)
RUN pipenv install --dev --system --deploy

# Expose the Flask app's port
EXPOSE 5000

# Run the application using the virtual environment's python
CMD ["python", "server.py"]