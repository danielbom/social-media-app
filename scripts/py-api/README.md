# Usage

```bash

# Generate python api
python ./cli.py generate-api -i ./examples/posts_and_comments.json -l python

# Generate javascript api
python ./cli.py generate-api -i ./examples/posts_and_comments.json -l javascript

# Generate endpoints swagger
python ./cli.py extract-endpoints -i ./examples/social-midia-nestjs-swagger.json -o ./endpoints.json
python ./cli.py generate-api --multiple-files -l typescript -i ./endpoints.json -o ./api/ --et export # Process the swagger output
python ./cli.py generate-api -l python -i ./endpoints.json -o ./api --et export # Process the swagger output

# Generate types swagger
python ./cli.py extract-types -i ./examples/social-midia-nestjs-swagger.json -o ./types.json
python ./cli.py generate-types -l typescript -i ./types.json -o ./_types # Process the swagger output

# Generate typescript api with types
python ./cli.py extract-endpoints -i ./examples/social-midia-nestjs-swagger.json -o ./endpoints.json
python ./cli.py extract-types -i ./examples/social-midia-nestjs-swagger.json -o ./types.json
python ./cli.py generate-api --multiple-files -l typescript -i ./endpoints.json -o ./api/ -t types.json --et export # Process the swagger output

# Tests
py -m pytest -vv
py -m pytest -vv --cov=./generate_api/
py -m pytest -vv --cov=./generate_api/ --cov-report=html
py -m pytest -vv -k test_generate_api
py -m pytest -vv --capture=no
```
