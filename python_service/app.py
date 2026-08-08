from flask import Flask, request, jsonify

app = Flask(__name__)


# ==========================================
# ROYAL QUEST PYTHON SERVICE
# ==========================================

@app.get("/")
def home():
    return jsonify({
        "game": "Royal Quest",
        "service": "Python Game Service",
        "status": "online"
    })


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "royal-quest-python"
    })


# ==========================================
# GAME STATISTICS
# ==========================================

@app.post("/stats")
def statistics():

    data = request.get_json(silent=True) or {}

    players = data.get("players", [])

    if not isinstance(players, list):
        return jsonify({
            "error": "players must be a list"
        }), 400

    scores = []

    for player in players:

        if isinstance(player, dict):

            score = player.get("score", 0)

            try:
                score = float(score)
            except (TypeError, ValueError):
                score = 0

            scores.append(score)

    if not scores:
        return jsonify({
            "players": 0,
            "averageScore": 0,
            "highestScore": 0,
            "lowestScore": 0
        })

    average_score = sum(scores) / len(scores)

    return jsonify({
        "players": len(scores),
        "averageScore": round(average_score, 2),
        "highestScore": max(scores),
        "lowestScore": min(scores)
    })


# ==========================================
# GAME ANALYSIS
# ==========================================

@app.post("/analyze")
def analyze():

    data = request.get_json(silent=True) or {}

    players = data.get("players", [])

    if not players:
        return jsonify({
            "message": "Not enough game data."
        })

    winner = max(
        players,
        key=lambda player: player.get("score", 0)
    )

    return jsonify({
        "winner": winner.get("name", "Unknown"),
        "score": winner.get("score", 0),
        "message": "Game analysis completed."
    })


# ==========================================
# START PYTHON SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )