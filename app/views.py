# import getpass
# import os
from pprint import pprint
from flask import Blueprint, render_template, url_for, g, request
# import copy
import functions
import sqlite3

views = Blueprint('views', __name__)

DATABASE = 'app/es.db'

privateToken = 'qxzH6TqLBS1kZstjiCMN'

projectID = None
curP = None
curB = None
user = functions.getUserInformation(privateToken)['username']

@views.route("/")
@views.route("/index.html")
def index():
    userInfo = updateInfo()

    projName = 'nnnn'
    branches = None

    userInfo = functions.getUserInformation(privateToken)
    projects = functions.getProjects(privateToken)
    if (projectID is not None):
        branches = functions.getBranchInformation(privateToken, projectID)
        projName = functions.getProjectInformation(privateToken, projectID)["path"]

    return render_template("index.html", projectName = projName, projectsList = projects, branchesList = branches, currentUser = userInfo, currentProject = curP, currentBranch = curB)


@views.route("/index.html/<page>/<type>/<text>", methods=['GET'])
def changeProjectOrBranch(page, type, text):

    if (type == 'project'):
        projects = functions.getProjects(privateToken)
        for project in projects:
            if (project["id"] == int(text)):
                global curP
                curP = project
                global projectID
                projectID = int(text)
                break
    else:
        branches = functions.getBranchInformation(privateToken, projectID)
        for branch in branches:
            if (branch["name"] == text):
                global curB
                curB = text
                break

    res = page.split('-')

    if (res[0] == 'index'):
        return index()
    elif (res[0] == 'members'):
        return members()
    elif (res[0] == 'profile'):
        return profile(res[1])


@views.route("/members.html")
def members():
    userInfo = updateInfo()

    projects = functions.getProjects(privateToken)
    branches = functions.getBranchInformation(privateToken, projectID)
    projName = functions.getProjectInformation(privateToken, projectID)["path"]

    members = functions.getMembersInformation(privateToken, projectID)

    return render_template("members.html", projectName = projName, projectsList = projects, branchesList = branches, currentUser = userInfo, currentProject = curP, currentBranch = curB, membersList = members)


@views.route("/profile-inside.html/<username>")
def profile(username):
    userInfo = updateInfo()

    members = functions.getMembersInformation(privateToken, projectID)
    member = dict()
    for member in members:
        if (member["username"] == username):
            break

    res = query_db('SELECT * FROM perfil WHERE username = ?', [username], one=True)

    if (res is None):
        check = None
    else:
        check = dict()
        check['skype'] = res[2]
        check['linkedin'] = res[3]
        check['twitter'] = res[4]
        check['website'] = res[5]
        check['bio'] = res[6]
        check['email'] = res[7]
        check['username'] = res[0]

    projects = functions.getProjects(privateToken)
    branches = functions.getBranchInformation(privateToken, projectID)
    projName = functions.getProjectInformation(privateToken, projectID)["path"]

    return render_template("profile-inside.html", projectName = projName, projectsList = projects, branchesList = branches, currentUser = userInfo, currentProject = curP, currentBranch = curB, userInfoDB = check, userInfo = member)


@views.route("/profile-edit.html")
def profileEdit():
    userInfo = updateInfo()

    res = query_db('SELECT * FROM perfil WHERE username = ?', [user], one=True)

    info = dict()
    info['skype'] = res[2]
    info['linkedin'] = res[3]
    info['twitter'] = res[4]
    info['website'] = res[5]
    info['bio'] = res[6]

    projects = functions.getProjects(privateToken)
    branches = functions.getBranchInformation(privateToken, projectID)
    projName = functions.getProjectInformation(privateToken, projectID)["path"]

    return render_template("profile-edit.html", projectName = projName, projectsList = projects, branchesList = branches, currentUser = userInfo, currentProject = curP, currentBranch = curB, userInfoDB = info)


@views.route("/profile-inside.html/" + user, methods=['POST'])
def editPOST():
    userInfo = updateInfo()

    if (int(request.form['choice'])):
        skype = request.form['skype']
        linkedin = request.form['linkedin']
        twitter = request.form['twitter']
        website = request.form['website']
        bio = request.form['bio']
        query_db('UPDATE perfil SET skype = ?, linkedin = ?, twitter = ?, website = ?, bio = ?, noSync = ? WHERE username = ?;', [skype, linkedin, twitter, website, bio, 1, user], one=True)
    else:
        query_db('UPDATE perfil SET noSync = ? WHERE username = ?;', [0, user], one=True)

    return profile(user)


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

# @views.do_teardown_appcontext
# def close_connection(exception):
#    db = getattr(g, '_database', None)
#    if db is not None:
#        db.close()


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    get_db().commit()
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


def updateInfo():
    res = query_db('SELECT * FROM perfil WHERE username = ?', [user], one=True)

    if (res is None):
        # print('TRUE: ' + str(res2))
        userInfo = functions.getUserInformation(privateToken)
        query_db('INSERT INTO perfil (username, name, skype, linkedin, twitter, website, bio, email, noSync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);', [userInfo['username'], userInfo['name'], userInfo['skype'], userInfo['linkedin'], userInfo['twitter'], userInfo['website_url'], userInfo['bio'], userInfo['email'], 0], one=True)
    else:
        # print('FALSE: ' + str(res2))
        if (res[8]): # res['noSync']
            userInfo = dict()
            userInfo['username'] = res[0]
            userInfo['nome'] = res[1]
        else:
            userInfo = functions.getUserInformation(privateToken)
            query_db('UPDATE perfil SET name = ?, skype = ?, linkedin = ?, twitter = ?, website = ?, bio = ?, email = ? WHERE username = ?;', [userInfo['name'], userInfo['skype'], userInfo['linkedin'], userInfo['twitter'], userInfo['website_url'], userInfo['bio'], userInfo['email'], userInfo['username']], one=True)

    return userInfo



#########
# for user in query_db('select * from users'):
#    print user['username'], 'has the id', user['user_id']

# user = query_db('select * from users where username = ?',
#                [the_username], one=True)
# if user is None:
#    print 'No such user'
# else:
#    print the_username, 'has the id', user['user_id']
###################

# CREATE TABLE perfil (user varchar(75) primary key, skype varchar(150), linkedin varchar(150), twitter varchar(150), website varchar(150), bio varchar(251), email varchar(150));
