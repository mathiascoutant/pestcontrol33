#!/bin/bash

# Créer un dossier temporaire
mkdir -p temp

# Télécharger les drapeaux avec des options supplémentaires
echo "Téléchargement du drapeau français..."
curl -L -o temp/fr.png https://flagcdn.com/w80/fr.png

echo "Téléchargement du drapeau anglais..."
curl -L -o temp/en.png https://flagcdn.com/w80/gb.png

echo "Téléchargement du drapeau espagnol..."
curl -L -o temp/es.png https://flagcdn.com/w80/es.png

# Vérifier si les fichiers ont été téléchargés correctement
if [ -f temp/fr.png ] && [ -f temp/en.png ] && [ -f temp/es.png ]; then
  # Déplacer les fichiers du dossier temporaire vers le dossier flags
  mv temp/fr.png .
  mv temp/en.png .
  mv temp/es.png .
  
  # Supprimer le dossier temporaire
  rm -rf temp
  
  echo "Drapeaux téléchargés avec succès !"
else
  echo "Erreur lors du téléchargement des drapeaux."
  exit 1
fi 