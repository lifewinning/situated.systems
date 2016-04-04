import csv,json,os,requests
# sometimes you just need to geocode a bunch of csvs
# maybe they should have stayed csvs, oh well, yolo

for file in os.listdir('csv'):
	if file.endswith('.csv'):
		new_geojson = {}
		new_geojson['type'] = 'FeatureCollection'
		features = []
		new_geojson['features'] = features
		openfile = open('csv/'+file)
		read = csv.DictReader(openfile)
		for r in read:
			obj = {}
			api_key= "HELLO STRANGER HERE IS AN API KEY"
			api = requests.get("https://search.mapzen.com/v1/search", params = { 'api_key':api_key,'text':r['address']+","+r['city']+",CA"})
			if r['address']:
				print r
				result = json.loads(api.text)
				obj['type'] = 'Feature'
				obj['properties'] = {
					'company':r['company'],
					'confidence': result['features'][0]['properties']['confidence'],
					'api_address': result['features'][0]['properties']['name'],
					'original_address':r['address']+', '+r['city']+' CA'
				}
				obj['geometry'] = {
					'type': 'Point',
					'coordinates': [result['features'][0]['geometry']['coordinates'][0], result['features'][0]['geometry']['coordinates'][1]]
				}
				features.append(obj)
		with open(str(file).replace('.csv','') +'.geojson','w') as of:
			json.dump(new_geojson, of)
		print 'geojson of '+ str(file)
