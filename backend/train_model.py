import os
import joblib
import pandas as pd

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

from xgboost import XGBClassifier

# =====================================
# LOAD DATA
# =====================================

print("=" * 60)
print("Loading Dataset...")
print("=" * 60)

df = pd.read_csv("data/water_quality.csv", encoding="cp1252")

print(df.head())

# =====================================
# DROP UNUSED COLUMNS
# =====================================

drop_columns = [
    "Datetime",
    "Month",
    "Month_Num",
    "month_x",
    "month_y",
    "day",
    "hour",
    "oxigeno_scaled",
    "ph",
    "turbidez"
]

df = df.drop(columns=drop_columns)

# =====================================
# ENCODE CATEGORICAL COLUMNS
# =====================================

encoders = {}

for col in df.select_dtypes(include="object").columns:
    encoder = LabelEncoder()
    df[col] = encoder.fit_transform(df[col].astype(str))
    encoders[col] = encoder

# =====================================
# FEATURES & TARGET
# =====================================

X = df[
    [
        "Temperature (°C)",
        "Dissolved Oxygen (mg/L)",
        "pH",
        "Turbidity (NTU)"
    ]
]

y = df["Health Status"]

# =====================================
# TRAIN TEST SPLIT
# =====================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# =====================================
# MODEL
# =====================================

model = XGBClassifier(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=5,
    eval_metric="logloss",
    random_state=42
)

print("\nTraining Model...\n")

model.fit(X_train, y_train)

# =====================================
# EVALUATION
# =====================================

pred = model.predict(X_test)

print("=" * 60)
print("Accuracy")
print("=" * 60)

print(accuracy_score(y_test, pred))
print()

print(classification_report(y_test, pred))

# =====================================
# SAVE MODEL
# =====================================

os.makedirs("model", exist_ok=True)

joblib.dump(model, "model/health_model.pkl")
joblib.dump(encoders, "model/encoders.pkl")

print("\nModel Saved Successfully.")