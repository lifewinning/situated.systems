# Super Basic Tile Picker

A still-unstable, no frills interface for taking tile data and, tile by tile, downloading it as SVGs. Made by basically [cannibalizing a Mapzen demo](http://mapzen.github.io/d3-vector-tiles/), because that was faster (hey guise hey thanks for that). 

###Why Would I Need Just Individual Tiles and Not The Full Map On My Screen?

- [Binx is already on the full map downloader problem](https://github.com/mapzen/svg-export). (Also, Binx I used your hashing function it's really great you're great)
- In this case, I needed to make a large mixed media map installation which would use a grid system for the map itself, and this method broke everything into tiles for me!
- Also I'm a masochist
- OK maybe I just want to lasercut some coasters, OK maybe I *want that* don't judge me

###Yes, I Need To Do This

- don't download extra crufty things (i.e. if fill, stroke, and strokeWidth don't exist why am I adding them, lazy bum)
- something for keeping track of what tiles you've downloaded or to gather and bulk download all tiles at once (although like, again, Binx is on it)
- style selectors in browser would be cool I guess but at what point am I literally making GIS software 