# script for revising the 
import json, csv

sites = open('sites.geojson').read()

annotations = open('annotations-final.json').read()

anno = json.loads(annotations)

data = json.loads(sites)

joined = {}

joined['type'] = 'FeatureCollection'

joined['features'] = []

featurelist = []

for s in data['features']:
	# deduplicate trick
	if s['properties']['placename'] not in featurelist:
		featurelist.append(s['properties']['placename'])
		# join files
		for a in anno:
			if a['placename'] == s['properties']['placename']:
				s['properties']['text'] = a['text']
				s['properties']['military_text'] = a['military_text']
				s['properties']['photo'] = a['photo']
				s['properties']['superfund'] = a['superfund']
				s['properties']['military'] = a['military']
				
				joined['features'].append(s)
			else:
				pass

with open('joined-final.geojson', 'w') as outfile:
	json.dump(joined, outfile)