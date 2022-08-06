import sys
import os

# https://stackoverflow.com/questions/16981921/relative-imports-in-python-3

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))
