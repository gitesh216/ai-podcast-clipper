# from pytubefix import YouTube
# from pytubefix.cli import on_progress

# url1 = "https://www.youtube.com/watch?v=SOG0GmKts_I"
# url2 = "https://www.youtube.com/watch?v=-vMgbJ6WqN4"
# url3 = "https://www.youtube.com/watch?v=ke3Pb9_oMrg"

# urls = [
#     "https://www.youtube.com/watch?v=ULvplwBTbQk",
#     "https://www.youtube.com/watch?v=9QXCkMTbrSk",
#     "https://www.youtube.com/watch?v=DQqVr0obReo",
#     "https://www.youtube.com/watch?v=bY1EQ6HD-ao"
# ]

# for url in urls:
#     try:
#         yt = YouTube(url)
#         print("Downloading:", yt.title)

#         ys = yt.streams.get_highest_resolution()
#         ys.download()

#         print("Download completed\n")

#     except Exception as e:
#         print("Failed to download:", url)
#         print("Error:", e)

# # yt = YouTube(url3, on_progress_callback=on_progress)
# # print(yt.title)

# # ys = yt.streams.get_highest_resolution()
# # ys.download()


import yt_dlp

url = "https://www.youtube.com/watch?v=9QXCkMTbrSk"

ydl_opts = {
    'format': 'bv*+ba/b',
    'download_sections': ['*00:00:00-00:30:30'],
    'merge_output_format': 'mp4',
    'outtmpl': '%(title)s_clip.%(ext)s'
}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    ydl.download([url])