from fastapi import FastAPI
from app.routes.client import router as client_router
from app.routes.representative import router as representative_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(client_router, prefix="/client", tags=["Client"])
app.include_router(representative_router, prefix="/representative", tags=["Representative"])
