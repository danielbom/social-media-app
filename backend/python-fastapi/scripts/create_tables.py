import _prepare_script
import app.models as models
from app.database import Base, engine

print("[INFO] Creating tables using engine: {}".format(engine))

engine.update_execution_options(echo=True)
Base.metadata.create_all(bind=engine, checkfirst=True)


print("[INFO] Tables created.")
