.PHONY = install,start,dev,list,test,audit,format,upgrade

install:
	@poetry install

start:
	@uvicorn app.main:app

dev:
	@uvicorn app.main:app --reload

lint:
	isort --diff -c .
	blue --check --diff --color .
	flake8 .
	mypy .

test:
	bandit -r ai-analysis/

format:
	isort .
	blue .

upgrade:
	# https://github.com/asottile/pyupgrade
	@python -c "import glob; print(*glob.glob('app/**/*.py', recursive=True), sep='\n')" | pyupgrade --py3-only $_ 
