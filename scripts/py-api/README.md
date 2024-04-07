# Usage

```bash

# Generate python api
python ./cli.py generate-api -i ./examples/posts_and_comments.json -l python

# Generate javascript api
python ./cli.py generate-api -i ./examples/posts_and_comments.json -l javascript

# Generate endpoints swagger
python ./cli.py extract-endpoints -i ./examples/social-midia-nestjs-swagger.json -o ./endpoints.json
python ./cli.py generate-api --multiple-files -l typescript -i ./endpoints.json -o ./api/ --et export # Process the swagger output
python ./cli.py generate-api -l python -i ./endpoints.json -o ./api/ --et export # Process the swagger output

# Generate types swagger
py ./cli.py extract-types -l swagger -i ./examples/social-midia-nestjs-swagger.json -o ./types.json

# Tests
py -m pytest -vv
py -m pytest -vv --cov=./generate_api/
py -m pytest -vv --cov=./generate_api/ --cov-report=html
```