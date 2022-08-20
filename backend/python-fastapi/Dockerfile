FROM python:3.10

WORKDIR /app

# Environment variables
ENV PYTHONFAULTHANDLER=1 \
  PYTHONHASHSEED=random \
  PYTHONUNBUFFERED=1

# Install dependencies
RUN pip install "poetry==1.1.11"

# Poetry production install
COPY poetry.lock pyproject.toml ./
RUN poetry install --no-dev

# Copy source code
COPY ./app ./app
COPY Makefile .

# Temporary solution for database setup
COPY ./alembic ./alembic
COPY alembic.ini .
RUN poetry run alembic upgrade head

EXPOSE 8000
CMD ["make", "start"]
