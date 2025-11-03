import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

def generate_synthetic_data(n_samples=1000):
    """
    Generate synthetic patient data for demonstration.
    In production, use real anonymized patient data.
    """
    np.random.seed(42)
    
    data = {
        'age': np.random.randint(18, 90, n_samples),
        'length_of_stay': np.random.randint(1, 30, n_samples),
        'temperature': np.random.normal(37.0, 0.8, n_samples),
        'heart_rate': np.random.randint(50, 130, n_samples),
        'diagnosis': np.random.choice(
            ['Pneumonia', 'Fracture', 'Stroke', 'Infection', 'COPD', 'Diabetes'],
            n_samples
        )
    }
    
    df = pd.DataFrame(data)
    
    # Generate target: discharge_ready (1 = ready, 0 = not ready)
    # Simple logic: ready if stay > 3 days, temp normal, heart rate normal
    df['discharge_ready'] = (
        (df['length_of_stay'] > 3) & 
        (df['temperature'] < 38.0) & 
        (df['heart_rate'] >= 60) & 
        (df['heart_rate'] <= 100)
    ).astype(int)
    
    return df

def train_model():
    """
    Train a Random Forest classifier for discharge prediction.
    """
    print("Generating synthetic training data...")
    df = generate_synthetic_data(1000)
    
    # Encode categorical features
    le = LabelEncoder()
    df['diagnosis_encoded'] = le.fit_transform(df['diagnosis'])
    
    # Features and target
    X = df[['age', 'length_of_stay', 'temperature', 'heart_rate', 'diagnosis_encoded']]
    y = df['discharge_ready']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train model
    print("Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"Training Accuracy: {train_score:.3f}")
    print(f"Testing Accuracy: {test_score:.3f}")
    
    # Save model and encoder
    joblib.dump(model, 'discharge_model.pkl')
    joblib.dump(le, 'diagnosis_encoder.pkl')
    
    print("Model saved as 'discharge_model.pkl'")
    print("Encoder saved as 'diagnosis_encoder.pkl'")
    
    return model, le

if __name__ == '__main__':
    train_model()