import random
from typing import List, Dict

# Global state to track simulation progress
# In a production app, this might be handled by a database or cache
_request_counter = 0

def get_risk_level(people: int, capacity: int) -> str:
    """
    Determines the risk level based on people vs capacity.
    - HIGH: people > 1.5 * capacity
    - MEDIUM: people > capacity
    - LOW: otherwise
    """
    if people > 1.5 * capacity:
        return "HIGH"
    elif people > capacity:
        return "MEDIUM"
    return "LOW"

def simulate_crowd_data() -> List[Dict]:
    """
    Generates simulated crowd density data for 4 zones: A, B, C, and D.
    Simulates a time-based surge in Zone B after several calls.
    """
    global _request_counter
    _request_counter += 1
    
    zones = ["A", "B", "C", "D"]
    base_capacity = 100
    crowd_data = []
    
    for zone in zones:
        capacity = base_capacity
        
        if zone == "B":
            # Simulate a surge in Zone B
            if _request_counter <= 3:
                # Initial state: Normal
                people = random.randint(40, 60)
            elif _request_counter <= 7:
                # Surge phase: Gradually increasing
                # Linear increase based on counter: 60 + (step * 20)
                surge_step = _request_counter - 3
                people = 60 + (surge_step * 20) + random.randint(-5, 5)
            else:
                # Peak state: Sustained high density
                people = random.randint(150, 180)
        else:
            # Other zones remain relatively stable but with small fluctuations
            if zone == "A":
                people = random.randint(30, 50)
            elif zone == "C":
                people = random.randint(70, 95)
            else: # Zone D
                people = random.randint(20, 40)
            
        risk_level = get_risk_level(people, capacity)
        
        crowd_data.append({
            "zone": zone,
            "number_of_people": people,
            "capacity": capacity,
            "risk_level": risk_level,
            "sim_call_index": _request_counter # Added for debugging/tracking
        })
        
    return crowd_data
