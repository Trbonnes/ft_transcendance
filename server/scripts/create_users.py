import requests as rq
from collections import namedtuple

baseurl = 'http://localhost:3000'
endpoint = '/auth/testuser'

users = list()
usernames = [ "mario", "luigi", "dimitri", "albert", "gaben", "bowser", "qwerty", "azerty", "mireille", "dylan"]

fails = 0

for n in usernames:
    #rep = rq.post(baseurl + endpoint, data = { "email" : n + '@' + n, "password" : "123", "name" : n })
    rep = rq.post(baseurl + endpoint + "?user=" + n)
    if rep.status_code != 200:
        fails += 1
        print("Can't add user " + n + " error : ", rep.status_code)

print("Success : ", len(usernames) - fails, " Fails : ", fails)
if fails > 0:
    print("Fails can occur if users already exist")
