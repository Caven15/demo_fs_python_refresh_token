from datetime import datetime, timedelta
from flask import jsonify
from flask_jwt_extended import get_jwt, jwt_required
from app.models.db.db_model import Utilisateur
from app.models.dto.utilisateur_schema import UtilisateurSchema
from app.services.session_scope import session_scope

@jwt_required()
def get_all():
    with session_scope() as session:
        utilisateurs = session.query(Utilisateur).all()
        utilisateur_schema = UtilisateurSchema(many=True)
        serialized_users = utilisateur_schema.dump(utilisateurs)

    # Récupération des informations du token JWT actuel
    jwt_data = get_jwt()
    exp_timestamp = jwt_data.get("exp")

    # Conversion de l'heure actuelle en heure locale
    now_utc = datetime.utcnow()
    now_local = now_utc + timedelta(hours=1)  

    # Calcul du temps restant basé sur l'heure locale
    access_token_remaining = int(exp_timestamp - now_local.timestamp()) if exp_timestamp else None

    # Affichage formaté du temps restant pour le token d'accès
    if access_token_remaining and access_token_remaining > 0:
        days, remainder = divmod(access_token_remaining, 86400)
        hours, remainder = divmod(remainder, 3600)
        minutes, seconds = divmod(remainder, 60)
        print(f"Temps access token : {days} jours, {hours} heures, {minutes} minutes, {seconds} secondes")
    else:
        print("Access token expiré ou temps restant indéterminé")

    return jsonify(serialized_users), 200
