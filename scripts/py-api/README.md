# Usage

```bash

# Generate python api
python ./cli.py generate-api -i ./examples/posts_and_comments.json -l python

# Generate javascript api
python ./cli.py generate-api -i ./examples/posts_and_comments.json -l javascript

py -m pytest -vv
py -m pytest -vv --cov=./generate_api/
py -m pytest -vv --cov=./generate_api/ --cov-report=html
```