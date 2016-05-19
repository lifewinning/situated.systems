# a dumb little Flask app to push URLs from our library Slack channel to Pinboard
from flask import Flask, request
import pinboard, urllib2
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route("/",methods=["POST"])
def slackin():
        data = request.form
        url = []
        tagses = []
        desc = []
        #parse slack message text with lazy queries
        
        list_text = data['text'].encode('utf-8').split(' ')
        for l in list_text:
                if l.startswith('<http'):
                        l = l.replace('<','').replace('>','')
                        url.append(l)
                #hacky way to add tags
                if l.startswith('#'):
                        l = l.replace('#','').encode('utf-8')
                        tagses.append(l)
                else:
                    desc.append()
        soup = BeautifulSoup(urllib2.urlopen(url[0]))
        if soup.title.name is None:
                title = url[0]
        else:
                title = soup.title.string
        tagses.append(data['user_name'].encode('utf-8'))
        pin_key = "YOUR PINBOARD KEY HERE KIND STRANGER READING MY CODE"

        pb = pinboard.Pinboard(pin_key)
        addpost = pb.posts.add(url = url[0], description = title, tags = tagses, extended = data['text'].encode('utf-8'))
        
        # to do: actually send a response back to slack to confirm posting but for now this is fine, like a dog drinking coffee surrounded by fire
        if addpost:
                return 'added! also you won a free bird'
        else:
                return 'not added, you are a bad human being'

if __name__ == "__main__":
    app.run()