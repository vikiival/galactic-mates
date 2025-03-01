import requests

def get_random_seed():
    """Fetch a random seed from the specified API."""
    url = "https://op.spacecoin.xyz/api/v1/rand_seed"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching random seed: {e}")
        return None
    
seed = get_random_seed()
print(seed["value"])