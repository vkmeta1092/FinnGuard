export interface PredictionRequest {
  temperature: number;
  dissolved_oxygen: number;
  ph: number;
  turbidity: number;
}

export interface PredictionResponse {
  status: string;
  health_index: number;
  confidence: number;
}

export async function predictHealth(
  data: PredictionRequest
): Promise<PredictionResponse> {

  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Prediction failed");
  }

  return await response.json();
}