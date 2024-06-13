import logging
import sys
from types import FrameType

from loguru import logger

# https://pawamoy.github.io/posts/unify-logging-for-a-gunicorn-uvicorn-app/

LOG_LEVEL = logging.getLevelName("INFO")
LOG_JSON = False


class AppLogging(logging.Handler):
    def emit(self, record: logging.LogRecord) -> None:
        # Get corresponding Loguru level if it exists
        try:
            level: str | int = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # Find caller from where originated the logged message
        frame: FrameType = logging.currentframe()
        depth = 2
        while frame.f_code.co_filename == logging.__file__:
            if frame.f_back is None:
                break
            frame = frame.f_back
            depth += 1

        logger.opt(depth=0, exception=record.exc_info).log(
            level, record.getMessage()
        )


def configure() -> None:
    # intercept everything at the root logger
    logging.root.handlers = [AppLogging()]
    # logging.root.setLevel(LOG_LEVEL)

    # remove every other logger's handlers
    # and propagate to root logger
    for name in logging.root.manager.loggerDict.keys():
        logging.getLogger(name).handlers = []
        logging.getLogger(name).propagate = True

    # configure loguru
    # https://github.com/Delgan/loguru/blob/f40fa311d3/loguru/_colorizer.py
    logger.configure(
        handlers=[
            {
                'sink': sys.stdout,
                'serialize': LOG_JSON,
                'format': '<b><g>{time:YYYY-MM-DD HH:mm:ss.SSS}</g></b> | <b>{level: <8}</b> | <lc>{message}</lc>',
            }
        ],
    )
