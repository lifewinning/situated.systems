# script for revising the 
import json, csv

sites = open('sites.geojson').read()

annotations = open('annotations.json').read()

anno = json.loads(annotations)

data = json.loads(sites)

joined = {}

joined['type'] = 'FeatureCollection'

joined['features'] = []


for s in data['features']:
	# deduplicate trick
	if s['properties']['placename'] not in featurelist:
		featurelist.append(s['properties']['placename'])
		# join files
		for a in anno:
			if a['placename'] == s['properties']['placename']:
				s['properties']['text'] = a['text']
				opt = ['photo','superfund', 'military','redeveloper']
				for o in opt:
					if a[o] == 'y':
						s['properties'][o] = a[o]
					else:
						pass
				joined['features'].append(s)
			else:
				pass

with open('joined.geojson', 'w') as outfile:
	json.dump(joined, outfile)