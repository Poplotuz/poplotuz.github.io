import re
import csv

def generateFile(title, seasons, years,imdb_url, country, runtime, tags, description, video, e_count ):
  undercaseTitle = re.sub("[^a-zA-Z0-9.-]+","_", title.strip())
  undercaseTitle = re.sub("[._]$","", undercaseTitle)
  cloudinaryImage = f"https://res.cloudinary.com/special-e/c_scale,w_550,q_auto/f_auto/Series%20posters/{undercaseTitle}.png"
  imdb_code = imdb_url.split('/')[4]
  tags_encoded = "\n- " +  tags.join("\n- ")
  text = f"""---
layout: post
title: {title.strip()}
seasons: {seasons}
years: {years.strip()}
image: {cloudinaryImage}
tags: {tags_encoded}
imdb_url: {imdb_url.strip()}
imdb_code: {imdb_code}
video: {video}
description: {description}
e_count: {e_count}
---
"""
  return text


with open("_data/series.tsv", 'r') as seriesFile:
  csvreader = csv.reader(seriesFile, delimiter='\t')
  next(csvreader)
  for row in csvreader:
    series = generateFile(row[0], row[1], row[2], row[3],row[4],row[5],row[6],row[7],row[8],row[9] )
    fileName = row[0].replace(" ","-")
    fileName = re.sub("[.-]$","", fileName)
    f = open(f"_posts/2023-01-14-{ fileName }.md", "w")
    f.write(series)
    f.close()
