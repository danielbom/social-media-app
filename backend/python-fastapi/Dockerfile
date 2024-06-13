FROM python:3.10

WORKDIR /app

# Environment variables
ENV PYTHONFAULTHANDLER=1 \
  PYTHONHASHSEED=random \
  PYTHONUNBUFFERED=1

COPY ./requirements-prod.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY ./server ./server
COPY ./scripts.py .

EXPOSE $APP_PORT

CMD ["python3", "./scripts.py", "run"]
