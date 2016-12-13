import json
import urllib
import urllib2
from flask import g
import sqlite3
import sys

DATABASE = 'app/hashtagRandom.db'


def communicate(url):
    response = urllib2.urlopen(url)
    data = json.load(response)

    return data


def getPrivateToken(username, password):
    values = {'login': username, 'password': password}

    url = "https://git.dei.uc.pt/api/v3/session"

    data = urllib.urlencode(values)
    req = urllib2.Request(url, data)

    return communicate(req)


def getProjects(token):
    url = "https://git.dei.uc.pt/api/v3/projects?private_token=" + token
    return communicate(url)


def getProjectInformation(token, projectID):
    url = "https://git.dei.uc.pt/api/v3/projects/" + str(projectID) + "?private_token=" + token
    return communicate(url)


def getBranches(token, projectID):
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
    currentUser = getUserInformation(token)
    res = query_db('SELECT * FROM profile WHERE username = ?', [currentUser['username']], one=True)

    if (res is None):
        userInfo = getUserInformation(token)
        query_db('INSERT INTO profile (username, name, skype, linkedin, twitter, website, bio, email, noSync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);', [userInfo['username'], userInfo['name'], userInfo['skype'], userInfo['linkedin'], userInfo['twitter'], userInfo['website_url'], userInfo['bio'], userInfo['email'], 0], one=True)
    else:
        if (res[8]): # res['noSync']
            userInfo = dict()
            userInfo['username'] = res[0]
            userInfo['name'] = res[1]
            userInfo['avatar_url'] = currentUser['avatar_url']
        else:
            userInfo = getUserInformation(token)
            query_db('UPDATE profile SET name = ?, skype = ?, linkedin = ?, twitter = ?, website = ?, bio = ?, email = ? WHERE username = ?;', [userInfo['name'], userInfo['skype'], userInfo['linkedin'], userInfo['twitter'], userInfo['website_url'], userInfo['bio'], userInfo['email'], userInfo['username']], one=True)

    return userInfo


def getRecurrentInfo(session, userInfo):
    # project chosen
    currentProject = getProjectInformation(session['token'], session['project'])

    # branches
    branchesList = getBranches(session['token'], session['project'])
    try:
        currentBranch = session['branch']
    except KeyError:
        currentBranch = None

    # team name
    teamname = dict()
    if (currentProject["owner"]["username"] == userInfo["username"]):
        teamname["owner"] = 1
    else:
        teamname["owner"] = 0
    res = query_db('SELECT name FROM team WHERE project = ?', [session['project']], one=True)
    if (res is not None):
        teamname["name"] = res[0]
    else:
        teamname["name"] = None

    return currentProject, branchesList, currentBranch, teamname



#   --------- DATABASE ---------

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.execute("CREATE TABLE IF NOT EXISTS profile (username varchar(50) primary key, name varchar(100), skype varchar(75), linkedin varchar(150), twitter varchar(75), website varchar(150), bio varchar(251), email varchar(75), noSync integer);")
        db.execute("CREATE TABLE IF NOT EXISTS notification (id_notif integer primary key autoincrement, message varchar(250), project integer, targetUsername varchar(50), isAlert integer, alertTitle varchar(50));")
        db.execute("CREATE TABLE IF NOT EXISTS team (id_team integer primary key autoincrement, name varchar(50), project integer);")
        db.commit()
        
    return db


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    get_db().commit()
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


def insertNotification(session, message, isAlert, alertTitle):    # message 250 chars MAX | alertTitle 25 chars MAX | isAlert 0 or 1 value
    if ((len(message) > 250) or (len(alertTitle) > 25) or (isAlert != 0 and isAlert != 1)):
        return False
    
    members = getMembersInformation(session['token'], session['project'])
    
    member = dict()
    for member in members:
        query_db('INSERT INTO notification (message, project, targetUsername, isAlert, alertTitle) VALUES (?, ?, ?, ?, ?);', [message, session['project'], member['username'], isAlert, alertTitle], one=True)

    return True
