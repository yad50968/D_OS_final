import ipfshttpclient, time, os, requests, json, hashlib


# Add to IPFS
def file2ipfs(path):
    """
    Agrs:
        path : target file path
    Return:
        url : ipfs url which is the url of target file
    """
    # check if file path is available
    if os.path.isfile(path):
        try :
            api = ipfshttpclient.connect()
            ret = api.add(path)
            hash = ret['Hash']
            address =  hash
            # print('Successfully add file !')
            # print('ipfs file url : ', address, '\n')
            # print(address)
            return address
        except:
            raise Exception('IPFS fail to add file. Be sure you\'re running daemon !')
    else:
        raise Exception('File path does not exist : ', path)

def _add_attribute(existing, attribute_name, attribute_value):
    trait = {
        'trait_type': attribute_name,
        'value': attribute_value
    }

    existing.append(trait)

def photo2ipfs(url):
    photo = requests.get(url)
    with open("images/" + "image" + ".jpg", "wb") as file:
        file.write(photo.content)
    return file2ipfs("images/" + "image" + ".jpg")

def music2ipfs(url):
    music = requests.get(url)
    with open("music/" + "music" + "" + ".mp3", "wb") as file:
        file.write(music.content)
    return file2ipfs("music/" + "music" + "" + ".mp3")

def file2sha256(url):
    file = requests.get(url)
    sha = hashlib.sha256()
    sha.update(file.content)
    hash = sha.hexdigest()
    return hash


def creature(data):
    attributes = []
    id = []
    for i in data:
        temp = []
        if i['turn'] == 0:
            _add_attribute(temp, 'nft_name', i['nftNam'])
            _add_attribute(temp, 'token_name', i['tokenNam'])
            _add_attribute(temp, 'description', i['desc'])
            _add_attribute(temp, 'cover_url', i['coverType'])
            cover_url = "https://ipfs.io/ipfs/" + photo2ipfs(i['coverUrl'])
            _add_attribute(temp, 'cover_url', cover_url)
            _add_attribute(temp, 'asset_type', i['assetType'])
            if(i['assetType']=="image/png" or i['assetType']=="image/jpg" or i['assetType']=="image/jpeg"):
                asset_url = "https://ipfs.io/ipfs/" + photo2ipfs(i['assetUrl'])
            elif(i['assetType']=="audio/wav" or i['assetType']=="audio/mp3" or i['assetType']=="audio/mpeg"):
                asset_url = "https://ipfs.io/ipfs/" + music2ipfs(i['assetUrl'])
            else:print("沒有這個type")
            _add_attribute(temp, 'asset_url', asset_url)
            _add_attribute(temp, 'creator', i['creator'])
            # _add_attribute(temp, 'total_supply', i['supply'])
            _add_attribute(temp, 'signature_type', "sha256")
            _add_attribute(temp, 'signature', file2sha256(i['assetUrl']))

            id.append(i['id'])

            attributes.append({
                'title': i['nftNam'],
                'name': i['tokenNam'],
                'description': i['desc'],
                'image': cover_url,
                'external_url': "",
                'attributes': temp,
            })

    return attributes, id

if __name__ == '__main__':

    while(True):
        resourse_path = "https://nftipfs.herokuapp.com/ipfs?fbclid=IwAR2C2oehGFdorSPxntB6OuqptBx_jEvccUgwRCDKAqUpbiOiJ9YPuqaAGS0"
        r = requests.get(resourse_path)
        attributes, id = creature(r.json())
        for i in range(len(attributes)):
            with open("temp" + "" + ".json", "w") as file:
                json.dump(attributes[i], file)
            uri = file2ipfs("temp.json")
            print("https://ipfs.io/ipfs/" + uri)
            post_data = {"uri": uri, "id": str(id[i])}
            post_data = json.dumps(post_data)

            re = requests.post(resourse_path, data=post_data)

        time.sleep(5)

