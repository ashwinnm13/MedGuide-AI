import requests

def test_retrieval():
    url = "http://127.0.0.1:8000/retrieve"
    
    # Trigger a rebuild of BM25 if the server doesn't auto-reload it
    # We can also just send requests and see if pages are > 20
    
    req1 = {"query": "recommendation 11", "top_k": 5}
    req2 = {"query": "opioid tapering", "top_k": 5}
    
    try:
        r1 = requests.post(url, json=req1)
        print("Query: recommendation 11")
        for res in r1.json().get("results", []):
            print(f"Page: {res.get('page')}, Score: {res.get('score')}")
            
        r2 = requests.post(url, json=req2)
        print("\nQuery: opioid tapering")
        for res in r2.json().get("results", []):
            print(f"Page: {res.get('page')}, Score: {res.get('score')}")
    except Exception as e:
        print(f"Error testing retrieval: {e}")

if __name__ == "__main__":
    test_retrieval()
