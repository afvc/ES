import json
import urllib
import urllib2
from flask import g
import sqlite3

DATABASE = 'app/hashtagRandom.db'


def communicate(url):
    response = urllib2.urlopen(url)
    data = json.load(response)

    return data

"""
def getPrivateToken(username, password):
    values = {'login': username, 'password': password}

    url = "https://git.dei.uc.pt/api/v3/session"

    data = urllib.urlencode(values)
    req = urllib2.Request(url, data)

    return communicate(req)['private_token']
"""

def getProjects(token):
    url = "https://git.dei.uc.pt/api/v3/projects?private_token=" + token
    return communicate(url)


def getProjectInformation(token, projectID):
    url = "https://git.dei.uc.pt/api/v3/projects/" + str(projectID) + "?private_token=" + token
    return communicate(url)


def getBranchInformation(token, projectID):
    url = "https://git.dei.uc.pt/api/v3/projects/" + str(projectID) + "/repository/branches?private_token=" + token
    return communicate(url)


def getMembersInformation(token, projectID):
    url = "https://git.dei.uc.pt/api/v3/projects/" + str(projectID) + "/members?private_token=" + token
    return communicate(url)


def getUserInformation(token):
    url = "https://git.dei.uc.pt/api/v3/user?private_token=" + token
    return communicate(url)


# useless with outdated gitlab
def getProfileInformation(token, userID):
    url = "https://git.dei.uc.pt/api/v3/user/" + userID + "?private_token=" + token
    return communicate(url)


def updateInfo(token):
    user = getUserInformation(token)['username']
    res = query_db('SELECT * FROM profile WHERE username = ?', [user], one=True)

    if (res is None):
        userInfo = getUserInformation(token)
        query_db('INSERT INTO profile (username, name, skype, linkedin, twitter, website, bio, email, noSync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);', [userInfo['username'], userInfo['name'], userInfo['skype'], userInfo['linkedin'], userInfo['twitter'], userInfo['website_url'], userInfo['bio'], userInfo['email'], 0], one=True)
    else:
        if (res[8]): # res['noSync']
            userInfo = dict()
            userInfo['username'] = res[0]
            userInfo['name'] = res[1]
        else:
            userInfo = getUserInformation(token)
            query_db('UPDATE profile SET name = ?, skype = ?, linkedin = ?, twitter = ?, website = ?, bio = ?, email = ? WHERE username = ?;', [userInfo['name'], userInfo['skype'], userInfo['linkedin'], userInfo['twitter'], userInfo['website_url'], userInfo['bio'], userInfo['email'], userInfo['username']], one=True)

    return userInfo



#   --------- DATABASE ---------

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.execute("CREATE TABLE IF NOT EXISTS profile (username varchar(50) primary key, name varchar(100), skype varchar(75), linkedin varchar(150), twitter varchar(75), website varchar(150), bio varchar(251), email varchar(75), noSync integer);")
        db.execute("CREATE TABLE IF NOT EXISTS notification (id_notif integer primary key autoincrement, message varchar(250), project integer, targetUsername varchar(50), isAlert integer);")
        db.execute("CREATE TABLE IF NOT EXISTS team (id_team integer primary key autoincrement, name varchar(50), project integer);")
        db.commit()
        
    return db


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    get_db().commit()
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

