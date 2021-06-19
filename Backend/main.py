from fastapi import FastAPI,BackgroundTasks
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
import json
import os,time
from fastapi.middleware.cors import CORSMiddleware


cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'nft-ipfs.appspot.com'
})
bucket = storage.bucket()


app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Contract(BaseModel):
    id: int
    success: int
    sc_addr: str

class Mint(BaseModel):
    id: int
    success: int
    mint_tx_hash: str

class Ipfs(BaseModel):
    id: int
    uri: str

def createuserin(): #deal with overwritten
	time.sleep(2)
	filepath=os.path.join(os.path.dirname(__file__),'userin')
	with open(filepath, 'w') as fp:
		pass

def checkuserin(data):
	flag=1
	for i in data:
		if i["turn"]:
			pass
		else:
			flag=0
	if flag:
		filepath=os.path.join(os.path.dirname(__file__),'userin')
		os.remove(filepath)
	else:
		pass
	timestamp = int(time.time())
	filepath=os.path.join(os.path.dirname(__file__),'ipfsstatus.txt')
	with open(filepath, 'w') as fp:
		fp.write(str(timestamp))

def createipfsin(): #deal with overwritten
	filepath=os.path.join(os.path.dirname(__file__),'ipfsin')
	with open(filepath, 'w') as fp:
		pass
	time.sleep(2)
	filepath=os.path.join(os.path.dirname(__file__),'ipfsin')
	with open(filepath, 'w') as fp:
		pass

def checkipfsin(data):
	flag=1
	for i in data:
		if i["turn"]:
			flag=0
		else:
			pass
	if flag:
		filepath=os.path.join(os.path.dirname(__file__),'ipfsin')
		os.remove(filepath)
	else:
		pass
	timestamp = int(time.time())
	filepath=os.path.join(os.path.dirname(__file__),'contractstatus.txt')
	with open(filepath, 'w') as fp:
		fp.write(str(timestamp))

def createuserfile(result, success, sc_addr):
	result.update({"success":success,"sc_addr":sc_addr})
	id=result["id"]
	if success:
		blob = bucket.blob('{}d.json'.format(id))
	else:
		blob = bucket.blob('{}d.json'.format(id))
	filepath=os.path.join(os.path.dirname(__file__),'{}d.json'.format(id))
	with open(filepath, 'w') as fp:
		json.dump(result, fp)
	# with open(filepath, 'w') as fp:
	# 	pass
	blob.upload_from_filename(filepath,content_type="application/json")
	os.remove(filepath)

def createuserfilem(result, success, mint_tx_hash):
	result.update({"success":success,"mint_tx_hash":mint_tx_hash})
	id=result["id"]
	if success:
		blob = bucket.blob('{}msuccess.json'.format(id))
	else:
		blob = bucket.blob('{}mfailed.json'.format(id))
	filepath=os.path.join(os.path.dirname(__file__),'{}m.json'.format(id))
	with open(filepath, 'w') as fp:
		json.dump(result, fp)
	# with open(filepath, 'w') as fp:
	# 	pass
	blob.upload_from_filename(filepath,content_type="application/json")
	os.remove(filepath)

@app.get("/user")
async def usersubmit(background_tasks: BackgroundTasks):
	filepath=os.path.join(os.path.dirname(__file__),'userin')
	with open(filepath, 'w') as fp:
		pass
	background_tasks.add_task(createuserin)
	background_tasks.add_task(createipfsin)
	return []

@app.get("/userd")
async def userd():
	blob = bucket.blob('userdata.json')
	data = eval(blob.download_as_text())
	return data

@app.get("/ipfs")
async def ipfsget(background_tasks: BackgroundTasks):
	if os.path.isfile(os.path.join(os.path.dirname(__file__),'userin')):
		#new user data comes in
		blob = bucket.blob('userdata.json')
		data = eval(blob.download_as_text())
		background_tasks.add_task(checkuserin, data)
		return data

	else:
		timestamp = int(time.time())
		filepath=os.path.join(os.path.dirname(__file__),'ipfsstatus.txt')
		with open(filepath, 'w') as fp:
			fp.write(str(timestamp))
		return []


@app.post("/ipfs")
async def ipfspost(ipfs: Ipfs,background_tasks: BackgroundTasks):
	lock = bucket.blob('lock')
	lock2 = bucket.blob('lock')
	while(1):
		try:
			lock.delete()
			break
		except:
			pass
	try:
		blob = bucket.blob('userdata.json')
		blob2 = bucket.blob('userdata.json')
		data = eval(blob.download_as_text())
		for i in range(len(data)):
			if data[i]["id"]==ipfs.id:
				data[i]["turn"]=1
				data[i].update({"uri":ipfs.uri})
				break
			else:
				pass
		filepath=os.path.join(os.path.dirname(__file__),'{}.json'.format(ipfs.id))
		with open(filepath, 'w') as fp:
			json.dump(data, fp)
		blob2.upload_from_filename(filepath,content_type="application/json")
		os.remove(filepath)
		lock2.upload_from_string("")
		background_tasks.add_task(createipfsin)
		return {"status":"finish"}
	except:
		lock2.upload_from_string("")
		return {"status":"failed"}
	

@app.get("/contract")
async def contractget(background_tasks: BackgroundTasks):
	if os.path.isfile(os.path.join(os.path.dirname(__file__),'ipfsin')):
		#new user data comes in
		blob = bucket.blob('userdata.json')
		data = eval(blob.download_as_text())
		background_tasks.add_task(checkipfsin, data)
		return data

	else:
		timestamp = int(time.time())
		filepath=os.path.join(os.path.dirname(__file__),'contractstatus.txt')
		with open(filepath, 'w') as fp:
			fp.write(str(timestamp))
		return []

@app.post("/contract")
async def contractpost(contract: Contract,background_tasks: BackgroundTasks):
	lock = bucket.blob('lock')
	lock2 = bucket.blob('lock')
	while(1):
		try:
			lock.delete()
			break
		except:
			pass

	try:
		blob = bucket.blob('userdata.json')
		blob2 = bucket.blob('userdata.json')
		data = eval(blob.download_as_text())
		for i in range(len(data)):
			if data[i]["id"]==contract.id:
				result=data[i]
				del data[i]
				break
			else:
				pass
		filepath=os.path.join(os.path.dirname(__file__),'{}.json'.format(contract.id))
		with open(filepath, 'w') as fp:
			json.dump(data, fp)
		blob2.upload_from_filename(filepath,content_type="application/json")
		os.remove(filepath)
		lock2.upload_from_string("")
		background_tasks.add_task(createuserfile, result, contract.success, contract.sc_addr)
		return {"status":"finish"}
	except:
		lock2.upload_from_string("")
		return {"status":"failed"}


@app.post("/mint")
async def mintpost(mint: Mint,background_tasks: BackgroundTasks):
	lock = bucket.blob('lock')
	lock2 = bucket.blob('lock')
	while(1):
		try:
			lock.delete()
			break
		except:
			pass

	try:
		blob = bucket.blob('userdata.json')
		blob2 = bucket.blob('userdata.json')
		data = eval(blob.download_as_text())
		for i in range(len(data)):
			if data[i]["id"]==mint.id:
				result=data[i]
				del data[i]
				break
			else:
				pass
		filepath=os.path.join(os.path.dirname(__file__),'{}.json'.format(mint.id))
		with open(filepath, 'w') as fp:
			json.dump(data, fp)
		blob2.upload_from_filename(filepath,content_type="application/json")
		os.remove(filepath)
		lock2.upload_from_string("")
		background_tasks.add_task(createuserfilem, result, mint.success, mint.mint_tx_hash)
		return {"status":"finish"}
	except:
		lock2.upload_from_string("")
		return {"status":"failed"}


@app.get("/monitor")
async def monitor():
	timestamp = int(time.time())
	filepath=os.path.join(os.path.dirname(__file__),'ipfsstatus.txt')
	with open(filepath, 'r') as fp:
		timestamp2=int(fp.read())
	if (timestamp-timestamp2)>15:
		ipfsstatus=0
	else:
		ipfsstatus=1
	filepath=os.path.join(os.path.dirname(__file__),'contractstatus.txt')
	with open(filepath, 'r') as fp:
		timestamp2=int(fp.read())
	if (timestamp-timestamp2)>15:
		contractstatus=0
	else:
		contractstatus=1
	if os.path.isfile(os.path.join(os.path.dirname(__file__),'userin')) or os.path.isfile(os.path.join(os.path.dirname(__file__),'ipfsin')):
		#new user data comes in

		blob = bucket.blob('userdata.json')
		data = eval(blob.download_as_text())
		ip=0
		ca=0
		de=0
		for i in data:
			if i["turn"]==0:
				ip+=1
			elif i["turn"]==1:
				ca+=1
			elif i["turn"]==2:
				de+=1

		return {"ipfs":ipfsstatus,"contract":contractstatus,"iwait":ip,"cwait":ca,"dwait":de}

	else:
		return {"ipfs":ipfsstatus,"contract":contractstatus,"iwait":0,"cwait":0,"dwait":0}

# @app.get("/userwait")
# async def userswait(id: int = 0):

# 	filename = os.path.join(os.path.dirname(__file__),"{}d.json".format(id))
# 	for i in range(4):
# 		time.sleep(5)
# 		if os.path.isfile(filename):
# 			with open(filename,'r') as fp:
# 				data=json.load(fp)
# 			os.remove(filepath)
# 			return data

# 		else:
# 		  	pass
# 	return {"status":"failed"}