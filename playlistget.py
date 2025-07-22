import googleapiclient.discovery
import googleapiclient.errors

# Remplace par ta clé API YouTube (obtenue via Google Cloud Console)
API_KEY = "AIzaSyCu1tOYvw24w4ZN1FujFMH6LXLpJn7GeoM"

def get_playlist_videos(playlist_id):
    youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=API_KEY)
    videos = []
    
    request = youtube.playlistItems().list(
        part="snippet",
        playlistId=playlist_id,
        maxResults=50
    )
    
    while request:
        try:
            response = request.execute()
            for item in response["items"]:
                video_id = item["snippet"]["resourceId"]["videoId"]
                video_title = item["snippet"]["title"]
                video_url = f"https://www.youtube-nocookie.com/embed/{video_id}"  # Utilisation de youtube-nocookie
                # Vérifier si la vidéo est embeddable
                video_request = youtube.videos().list(
                    part="status",
                    id=video_id
                )
                video_response = video_request.execute()
                if video_response["items"][0]["status"]["embeddable"]:
                    videos.append({"id": video_id, "title": video_title, "url": video_url})
            
            # Pagination
            request = youtube.playlistItems().list_next(request, response)
        except (googleapiclient.errors.HttpError, IndexError) as e:
            print(f"Erreur ou vidéo non embeddable : {e}")
            continue
    
    return videos

def update_playlist_html(videos, character_name):
    # Chemin du fichier playlist.html (ajuste selon ton dossier)
    playlist_html_path = "playlist.html"
    
    # Générer le contenu complet du fichier playlist.html
    playlist_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playlist de {character_name}</title>
</head>
<body>
    <div class="playlist-section">
        <h2>Épisodes de {character_name}</h2>
        <ul class="episode-list">
"""
    for i, video in enumerate(videos, 1):
        playlist_content += f"""            <li class="episode-item">
                <span class="episode-title">Épisode {i}: {video['title']}</span>
                <button class="watch-button" data-video-id="{video['id']}">Regarder</button>
            </li>
"""
    playlist_content += """        </ul>
        <div class="video-modal" id="videoModal">
            <div class="modal-content">
                <span class="close-modal">×</span>
                <iframe id="modalVideo" width="100%" height="315" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
    </div>
</body>
</html>"""
    
    # Écrire le contenu dans playlist.html
    with open(playlist_html_path, "w", encoding="utf-8") as f:
        f.write(playlist_content)
    
    print(f"{len(videos)} vidéos embeddables insérées dans {playlist_html_path}")

# Exemple : Playlist ID 
playlist_id = "PLSER88E5c573CeR39ttl35-1htPUaqSuh"
character_name = "Adrian FLASH"

# Mettre à jour playlist.html
videos = get_playlist_videos(playlist_id)
update_playlist_html(videos, character_name)