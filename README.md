# Moodifly
Moodifly is a web application that makes personalized music recommendations based on the user’s mood, using Spotify Web API, React, and Spring Boot. It provides real-time recommendation features based on emoji, text-sentiment, and listening history, using Stanford CoreNLP for sentiment analysis.

## Features
- Allows for a interactive experience with analytics of the user's listening history and trackgrid feature
- Recommendation Features
  - Listening History
![Alt Text](https://github.com/phlee6899/Moodifly/blob/master/demo/history.gif)
    - Personalized songs based on user's listening history
    - Slider feature allows users to utilize track features to filter and discover new songs
  - Text Sentiment Analysis
![Alt Text](https://github.com/phlee6899/Moodifly/blob/master/demo/text.gif)
    - Recommendation made based on the user's text input that contains the user's thoughts, feelings, and so on
    - Used Stanford CoreNLP for sentiment analysis
  - Emoji
![Alt Text](https://github.com/phlee6899/Moodifly/blob/master/demo/emoji.gif)
    - Recommends songs based on the user's selection of a single or chain of emojis
    - Recommendation algorithm utilizes the sentiment of emojis

## Service Architecture
<img width="1811" alt="Service Architecture" src="https://github.com/phlee6899/Moodifly/blob/master/demo/architecture.png">

Moodifly is composed of the frontend, which is capable of the visualization of data and music recommendation based on user mood analysis, and the backend, which contains the logic behind the recommendation algorithm. Frontend hosting is done through Netlify and deployed using its CI/CD pipeline. Backend is deployed with Heroku.

## Document
To read more about this project and in depth details about the features, architechture, and so on, refer to this [PDF](https://link-url-here.org).
