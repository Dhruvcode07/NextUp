from sqlmodel import SQLModel, create_engine, Session
from pymongo import MongoClient
import os

# PostgreSQL Setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://qms_user:securepassword@localhost/qms_db")
engine = create_engine(DATABASE_URL)

def get_db():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# MongoDB Setup
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
mongo_client = MongoClient(MONGO_URL)
mongo_db = mongo_client["qms_logs"]