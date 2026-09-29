import joblib
import pandas as pd

# Load model once
model = joblib.load("model/health_model.pkl")


def predict(data: dict):

    df = pd.DataFrame([{
        "Temperature (°C)": data["temperature"],
        "Dissolved Oxygen (mg/L)": data["dissolved_oxygen"],
        "pH": data["ph"],
        "Turbidity (NTU)": data["turbidity"]
    }])

    prediction = model.predict(df)[0]
    probability = model.predict_proba(df)[0]

    # Convert NumPy values to Python types
    prediction = int(prediction)
    confidence = float(max(probability) * 100)

    status = "At Risk" if prediction == 1 else "Stable"

    health_index = (100 - confidence) if status == "At Risk" else confidence

    return {
        "status": status,
        "health_index": round(float(health_index), 2),
        "confidence": round(float(confidence), 2)
    }