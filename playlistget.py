import googleapiclient.discovery
import googleapiclient.errors
from datetime import datetime

# Remplace par ta clé API YouTube
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
                video_title = item["snippet"]["title"].replace("'", "\\'")  # Échappe les apostrophes
                
                # Vérification embeddable
                video_request = youtube.videos().list(part="status", id=video_id)
                video_response = video_request.execute()
                
                if video_response["items"] and video_response["items"][0]["status"]["embeddable"]:
                    videos.append({
                        "num": len(videos) + 1,
                        "title": video_title,
                        "videoId": video_id
                    })
            
            request = youtube.playlistItems().list_next(request, response)
        except Exception as e:
            print(f"Erreur : {e}")
            continue
    
    return videos


def generate_seasons_text(videos, output_file="seasons_data.txt"):
    content = "seasons:{\n"
    content += "    'Saison 1':[\n"
    
    for video in videos:
        content += f"        {{num:{video['num']},title:'{video['title']}',videoId:'{video['videoId']}'}},\n"
    
    # Enlever la dernière virgule
    if videos:
        content = content.rstrip(',\n') + '\n'
    
    content += "    ]\n"
    content += "},"

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"✅ {len(videos)} vidéos générées dans {output_file}")
    print("\nAperçu du contenu généré :")
    print(content[:500] + "..." if len(content) > 500 else content)


# ==================== CONFIGURATION ====================
playlist_id = "PLIVm-YyjTqSHQ4jB0HLYe0O7TD-2bWvF-"

videos = get_playlist_videos(playlist_id)
generate_seasons_text(videos, output_file="seasons_data.txt")