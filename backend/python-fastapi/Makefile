.PHONY = install,start,start-workers,dev,list,test,audit,format,upgrade,install-service

install:
	@poetry install

# Only works on unix systems
start-workers:
	@poetry run gunicorn \
		--workers 4 \
		--worker-class uvicorn.workers.UvicornWorker \
		--bind 0.0.0.0:8000 \
		--log-level info \
		app.main:app 

# Worker in any system, but is single threaded
start:
	@poetry run uvicorn \
		--host 0.0.0.0 \
		--port 8000 \
		--log-level info \
		app.main:app

dev:
	@poetry run uvicorn app.main:app --reload

lint:
	isort --diff -c .
	blue --check --diff --color .
	flake8 .
	mypy . --ignore-missing-imports

test:
	bandit -r ai-analysis/

format:
	isort .
	blue .

upgrade:
	# https://github.com/asottile/pyupgrade
	@python -c "import glob; print(*glob.glob('app/**/*.py', recursive=True), sep='\n')" | pyupgrade --py3-only $_ 

install-service:
	cp extra/gunicorn.service /etc/systemd/system/
