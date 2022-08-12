import _prepare_script

from app.database import engine
from app.models import Base

print('[INFO] Creating tables using engine: {}'.format(engine))

engine.update_execution_options(echo=True)
Base.metadata.create_all(bind=engine, checkfirst=True)


print('[INFO] Tables created.')
