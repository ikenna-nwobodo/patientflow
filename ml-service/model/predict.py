import numpy as np

def predict_discharge_readiness(age, length_of_stay, temperature, heart_rate, diagnosis):
    """
    Predicts discharge readiness score (0-100) based on patient data.
    
    This is a rule-based model that simulates ML predictions.
    In production, you would load a trained scikit-learn model here.
    
    Args:
        age (int): Patient age
        length_of_stay (int): Days since admission
        temperature (float): Body temperature in Celsius
        heart_rate (int): Heart rate in BPM
        diagnosis (str): Patient diagnosis
        
    Returns:
        tuple: (score, recommendation)
    """
    
    # Initialize base score
    score = 50.0
    
    # Age factor (older patients may need more care)
    if age < 18:
        score += 10  # Young, usually recover faster
    elif age < 50:
        score += 5
    elif age < 70:
        score += 0
    else:
        score -= 10  # Elderly may need longer care
    
    # Length of stay factor
    if length_of_stay < 3:
        score -= 20  # Too early for discharge
    elif 3 <= length_of_stay <= 7:
        score += 15  # Optimal recovery period
    elif 7 < length_of_stay <= 14:
        score += 10  # Extended but acceptable
    else:
        score += 20  # Long stay, likely ready if vitals are stable
    
    # Temperature factor (normal: 36.5-37.5°C)
    if 36.5 <= temperature <= 37.5:
        score += 15  # Normal temperature
    elif 37.5 < temperature <= 38.0:
        score += 5   # Slight fever
    elif temperature > 38.0:
        score -= 20  # Fever, not ready
    else:
        score -= 10  # Hypothermia concern
    
    # Heart rate factor (normal: 60-100 BPM)
    if 60 <= heart_rate <= 100:
        score += 15  # Normal heart rate
    elif 50 <= heart_rate < 60 or 100 < heart_rate <= 110:
        score += 5   # Slightly abnormal
    else:
        score -= 15  # Concerning heart rate
    
    # Diagnosis factor (simplified categories)
    diagnosis_lower = diagnosis.lower()
    
    high_risk_conditions = ['stroke', 'heart attack', 'myocardial infarction', 'sepsis']
    medium_risk_conditions = ['pneumonia', 'copd', 'asthma', 'diabetes']
    low_risk_conditions = ['fracture', 'appendicitis', 'infection']
    
    if any(condition in diagnosis_lower for condition in high_risk_conditions):
        score -= 15  # High-risk conditions need more time
    elif any(condition in diagnosis_lower for condition in medium_risk_conditions):
        score -= 5   # Medium-risk conditions
    elif any(condition in diagnosis_lower for condition in low_risk_conditions):
        score += 10  # Low-risk conditions recover faster
    
    # Ensure score is between 0-100
    score = max(0, min(100, score))
    
    # Round to nearest integer
    score = int(round(score))
    
    # Generate recommendation based on score
    if score >= 80:
        recommendation = "Patient is highly ready for discharge. All indicators are positive."
    elif score >= 70:
        recommendation = "Patient is ready for discharge review. Consider discharge planning."
    elif score >= 50:
        recommendation = "Patient may need additional monitoring. Reassess in 24-48 hours."
    elif score >= 30:
        recommendation = "Patient requires continued care. Vitals or recovery not optimal."
    else:
        recommendation = "Patient not ready for discharge. Immediate medical attention may be needed."
    
    return score, recommendation
