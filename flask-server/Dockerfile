FROM python:3.10

WORKDIR /app/backend

COPY Pipfile* ./
RUN pip install pipenv && pipenv install --deploy --system

COPY . .

EXPOSE 5000
CMD ["python", "server.py"]
