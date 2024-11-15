from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token, decode_token
from app import app
import jwt

def generate_jwt(id, utilisateur, other_claims=None, time=1):
    claims = {
        'username': utilisateur
    }
    
    if other_claims:
        claims.update(other_claims)
    
    # Passez explicitement expires_delta pour forcer l'expiration à 1 heure
    new_token = create_access_token(identity=str(id), 
                                    additional_claims=claims, 
                                    expires_delta=timedelta(minutes=time))
    return new_token

def verify_jwt(token):
    try:
        # Décodez le token en utilisant decode_token
        decoded_token = decode_token(token)
        
        print(decoded_token)
        
        # Affichez le contenu décodé pour le débogage
        if decoded_token:
            print("Contenu du token décodé:", decoded_token)
        else:
            print("----------------------")
            print("Impossible de décoder le token")
            print("----------------------")
        
        # Vérifiez l'expiration du token avec une période de grâce de 30 secondes
        if 'exp' in decoded_token:
            expiration_time = datetime.fromtimestamp(decoded_token['exp'])
            current_time = datetime.utcnow()
            print(f"Expiration du token : {expiration_time} UTC")
            print(f"Temps actuel : {current_time} UTC")
            if expiration_time < current_time - timedelta(seconds=30):  # Période de grâce
                print("Le token est expiré.")
                return None  # Le token a expiré

        return decoded_token  # Retourne le token décodé s'il est valide
    except jwt.ExpiredSignatureError:
        print("Erreur : Le token est expiré.")
        return None  # Token expiré
    except jwt.InvalidTokenError as e:
        print(f"Erreur : Token invalide ({e})")
        return None  # Token invalide