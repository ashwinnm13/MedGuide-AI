from app.graph.router import route_query


def test_local_route():
    state = {"query": "acute pain"}

    state = route_query(state)

    assert state["route"] == "local"


def test_web_route():
    state = {"query": "latest WHO hypertension guideline"}

    state = route_query(state)

    assert state["route"] == "web"
