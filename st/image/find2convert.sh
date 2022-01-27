#!/bin/bash

#USAGE:
#cd picture
#find . | ../find2convert.sh

#fullfilename=$1
#filename=$(basename "$fullfilename")
#fname="${filename%.*}"
#ext="${filename##*.}"

#echo "Input File: $fullfilename"
#echo "Filename without Path: $filename"
#echo "Filename without Extension: $fname"
#echo "File Extension without Name: $ext"

#cwebp $filename -o $fname.webp $@

WidthXs=640
PathSrc="../../dist/picture/src"
PathWebp="../../dist/picture/webp"
PathJp2="../../dist/picture/jp2"
PathXs="../../dist/picture/xs/src"
PathXsWebp="../../dist/picture/xs/webp"
PathXsJp2="../../dist/picture/xs/jp2"

mkdir -p $PathSrc
mkdir -p $PathXs

while read LINE; do

  #echo $LINE
  if [[ -d $LINE ]]; then
    #echo "$LINE is a directory"
    mkdir -p $PathSrc/$LINE
    mkdir -p $PathWebp/$LINE
    mkdir -p $PathJp2/$LINE
    mkdir -p $PathXs/$LINE
    mkdir -p $PathXsWebp/$LINE
    mkdir -p $PathXsJp2/$LINE
  else
    #fname="${LINE%.*}"
    #echo "../webp/$fname.webp"    # do something with it here
    cp $LINE $PathSrc/$LINE
    cwebp -m 6 -q 100 -mt -af -progress $LINE -o $PathWebp/$LINE.webp
    magick $LINE -monitor -quality 0 $PathJp2/$LINE.jp2
    magick $LINE -resize $WidthXs $PathXs/$LINE
    cwebp -m 6 -q 100 -mt -af -progress $PathXs/$LINE -o $PathXsWebp/$LINE.webp
    magick $PathXs/$LINE -monitor -quality 0 $PathXsJp2/$LINE.jp2
  fi

done

exit 0
