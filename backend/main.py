from fastapi import FastAPI
from api import api_router

app = FastAPI(
    title="CEO AI Backend"
)

app.include_router(
    api_router,
    prefix="/api/v1"
)