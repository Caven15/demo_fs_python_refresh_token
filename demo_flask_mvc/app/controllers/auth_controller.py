from flask import request, jsonify
from app.models.dto.utilisateur_schema import UtilisateurRegisterSchema
from werkzeug.security import check_password_hash, generate_password_hash
from app.models.db.db_model import Utilisateur
from app.services.jwt_manager import generate_jwt, verify_jwt
from app.services.session_scope import session_scope

def login():
    utilisateur_schema = UtilisateurRegisterSchema()
    errors = utilisateur_schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    username = request.json['username']
    password = request.json['password']
    
    with session_scope() as session:
        utilisateur = session.query(Utilisateur).filter_by(username=username).first()
        if utilisateur and check_password_hash(utilisateur.password, password):
            access_token = generate_jwt(utilisateur.id, utilisateur.username, None, 0.2) 
            refresh_token = generate_jwt(utilisateur.id, utilisateur.username, None, 2) 
            return jsonify({
                'access_token': access_token,
                'refresh_token': refresh_token
            }), 200
        else: 
            return jsonify({'message': 'Nom d\'utilisateur ou le mot de passe incorrect'}), 401

def refresh():
    refresh_token = request.json.get('refresh_token')
    print(f"Token to decode: {refresh_token}")
    
    # Décoder le token
    decoded_token = verify_jwt(refresh_token)
    print("------------------")
    print(decoded_token['username'])
    print("------------------")
    
    if decoded_token:
        # Récupérer le username à partir du token décodé
        username = decoded_token['username']
        
        if username:
            # Générer un nouveau access token et un nouveau refresh token avec une expiration correcte
            new_access_token = generate_jwt(None, username, None, 0.2)
            new_refresh_token = generate_jwt(None, username, None, 2)
            
            return jsonify({
                'access_token': new_access_token,
                'refresh_token': new_refresh_token
            }), 201
        else:
            return jsonify({'error': 'Username not found in token payload'}), 403
    else:
        return jsonify({'error': 'Invalid or expired refresh token'}), 401

def register():
    utilisateur_register_schema = UtilisateurRegisterSchema()
    errors = utilisateur_register_schema.validate(request.json)
    if errors:
        return jsonify({'message': f'{errors}'}), 400
    
    username = request.json['username']
    password = request.json['password']
    hashed_password = generate_password_hash(password)
    
    with session_scope() as session:
        utilisateur_existant = session.query(Utilisateur).filter_by(username=username).first()
        if utilisateur_existant:
            return jsonify({'message': 'Cet utilisateur existe déjà !'}), 400
        
        new_user = Utilisateur(username=username, password=hashed_password)
        session.add(new_user)
    return jsonify({'message': f'{username} enregistré avec succès !'}), 201