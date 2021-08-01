# Moodifly
Moodifly is a web application that makes personalized music recommendations based on the user’s mood, using Spotify Web API, React, and Spring Boot. It provides real-time recommendation features based on emoji, text-sentiment, and listening history, using Stanford CoreNLP for sentiment analysis.

## Features
- Allows for a interactive experience with analytics of the user's listening history and trackgrid feature
- Recommendation Features
  - Listening History
    - Personalized songs based on user's listening history
    - Slider feature allows users to utilize track features to filter and discover new songs
  - Text Sentiment Analysis
    - Recommendation made based on the user's text input that contains the user's thoughts, feelings, and so on
    - Used Stanford CoreNLP for sentiment analysis
  - Emoji
    - Recommends songs based on the user's selection of a single or chain of emojis
    - Recommendation algorithm utilizes the sentiment of emojis
