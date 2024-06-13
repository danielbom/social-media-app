# Social Media App API

TODO: Write a description of the API here.

## Get Started

See the Makefile for instructions on how to run the API. The basic flow is:

```bash
python3 scripts.py venv

source .venv/bin/activate # Linux
.venv\Scripts\activate # Windows

python3 scripts.py install

alembic upgrade head

python3 scripts.py run
```

Using docker:
  
```bash
# Build
docker build --tag social-midia-api:latest .

# Run
docker run --detach --rm --interactive --tty --env-file .env --env PYTHON_ENV=production --name api --publish 3000:3000 social-midia-api:latest
```

## Using alembic migration

```bash
alembic history

alembic upgrade head
alembic downgrade base

alembic revision --autogenerate -m "new migration"

alembic upgrade +n
alembic downgrade -n

alembic upgrade [hash]
alembic downgrade [hash]

alembic --help
```

## References

* [Video base](https://www.youtube.com/watch?v=0sOvCWFmrtA&ab_channel=freeCodeCamp.org)
* [Dockerfile base](https://github.com/k2bd/action-python-poetry)
* [Unify logging](https://github.com/Delgan/loguru/blob/f40fa311d3/loguru/_colorizer.py)