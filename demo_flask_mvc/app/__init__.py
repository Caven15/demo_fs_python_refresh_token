from datetime import timedelta
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from config import URL_DB, JWT_SECRET
from sqlalchemy.exc import SQLAlchemyError
from app.models.db.db_model import base
from flask_cors import CORS  # Importez Flask-CORS

# Inititalisation de l'application Flask
app = Flask(__name__)

# Configurez CORS pour autoriser uniquement les requêtes depuis localhost:4200
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

# mise en place du jeton d'accès (formulaire)
app.config['SQLALCHEMY_DATABASE_URI'] = URL_DB
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = JWT_SECRET

jwt = JWTManager(app)

# Définir la variable pour vérifier la connexion a la base de donnée
db_connected = False

# Esssayer de se connecter à la base de donnée
try:
    # Inititialisation de SQLAlchemy avec l'application Flask
    db = SQLAlchemy(app)
    
    # Céation d'un moteur de de basse de donnée SQLAlchemy à partir de L'url de la base de donnée
    engine = create_engine(URL_DB)
    
    # Récupération des métadonnée de la base de données à partir du modèle de donnée Base
    metadata = base.metadata
    
    db_connected = True
except SQLAlchemyError as error:
    # En cas d'erreur SQLAlchemy, affichage du message d'erreur 
    print(f"Erreur de connexion à la base de données : \n {error}")

if db_connected:
    # Suppresion de la db
    # metadata.drop_all(bind=engine)
    # metadata.create_all(bind=engine)
    
    # Ajouter l'import des routes
    from app.routes import auth, utilisateur
    print("----------------------")
    print("Connexion db établie !")
    print("----------------------")