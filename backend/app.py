from fastapi import FastAPI
from pydantic import BaseModel
from predictor import predict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PondData(BaseModel):
    temperature: float
    dissolved_oxygen: float
    ph: float
    turbidity: float


@app.get("/")
def home():
    return {"message": "FinGuard API Running 🚀"}


@app.post("/predict")
def predict_health(data: PondData):
    return predict(data.model_dump())