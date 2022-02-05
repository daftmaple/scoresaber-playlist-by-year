#!/bin/bash

# 210 to 210 (index starts at 1, 211 returns empty array) by 12PM UTC 5 February 2022
# YOU SHOULD NOT GET ANYTHING BELOW 210 unless scoresaber unrank a map and you want to regenerate the playlist
for i in {210..210}
do 
    curl -X 'GET' \
    "https://scoresaber.com/api/leaderboards?ranked=true&sort=1&page=$i" \
    -H 'accept: application/json' > score/$i.json

    sleep 1
done