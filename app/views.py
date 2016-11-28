from pprint import pprint
from flask import Blueprint, render_template, url_for, request, redirect, Response
import functions
import json

MAX_NOTIFICATION = 30
host = 'http://localhost:5000'

views = Blueprint('views', __name__)

privateToken = 'qxzH6TqLBS1kZstjiCMN'
# zg5dppdxZKH2BkE24ujw
# qxzH6TqLBS1kZstjiCMN lc

projectID = None
curP = None
curB = None

@views.route("/")
@views.route("/index.html")
def index():
    userInfo = functions.updateInfo(privateToken)

    projName = 'nnnn'
    branches = None

    teamname = dict()
    teamname["name"] = None
    teamname["owner"] = 0
    userInfo = functions.getUserInformation(privateToken)
    projects = functions.getProjects(privateToken)
    if (projectID is not None):
        branches = functions.getBranchInformation(privateToken, projectID)
        projInfo = functions.getProjectInformation(privateToken, projectID)
        projName = projInfo["path"]
        res = functions.query_db('SELECT name FROM team WHERE project = ?', [projectID], one=True)
        if (res is not None):
            teamname["name"] = res[0]
        if (projInfo["owner"]["username"] == userInfo["username"]):
            teamname["owner"] = 1
        else:
            teamname["owner"] = 0


    return render_template("index.html", host = host, projectID = projectID, teamname = teamname, projectName = projName, projectsList = projects, branchesList = branches, currentUser = userInfo, currentProject = curP, currentBranch = curB)


@views.route("/<page>.html/<type>/<text>", methods=['GET'])
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
        return redirect('/')
    elif (res[0] == 'members'):
        return redirect('/members.html')
    elif (res[0] == 'profile'):
        return redirect('/profile-inside.html/' + res[1])


@views.route("/members.html")
def members():
    userInfo = functions.updateInfo(privateToken)

    projects = functions.getProjects(privateToken)
    branches = functions.getBranchInformation(privateToken, projectID)
    projName = functions.getProjectInformation(privateToken, projectID)["path"]

    members = functions.getMembersInformation(privateToken, projectID)

    return render_template("members.html", host = host, projectID = projectID, projectName = projName, projectsList = projects, branchesList = branches, currentUser = userInfo, currentProject = curP, currentBranch = curB, membersList = members)


@views.route("/profile-inside.html/<username>", methods=['GET'])
def profile(username):
    userInfo = functions.updateInfo(privateToken)

    members = functions.getMembersInformation(privateToken, projectID)
    member = dict()
    for member in members:
        if (member["username"] == username):
            break

    res = functions.query_db('SELECT * FROM profile WHERE username = ?', [username], one=True)

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

    return render_template("profile-inside.html", host = host, projectID = projectID, projectName = projName, projectsList = projects, branchesList = branches, currentUser = userInfo, currentProject = curP, currentBranch = curB, userInfoDB = check, userInfo = member)


@views.route("/profile-edit.html")
def profileEdit():
    userInfo = functions.updateInfo(privateToken)

    user = functions.getUserInformation(privateToken)['username']
    res = functions.query_db('SELECT * FROM profile WHERE username = ?', [user], one=True)

    info = dict()
    info['skype'] = res[2]
    info['linkedin'] = res[3]
    info['twitter'] = res[4]
    info['website'] = res[5]
    info['bio'] = res[6]
    info['noSync'] = res[8]
    print info['noSync']

    projects = functions.getProjects(privateToken)
    branches = functions.getBranchInformation(privateToken, projectID)
    projName = functions.getProjectInformation(privateToken, projectID)["path"]

    return render_template("profile-edit.html", host = host, projectID = projectID, projectName = projName, projectsList = projects, branchesList = branches, currentUser = userInfo, currentProject = curP, currentBranch = curB, userInfoDB = info)


@views.route("/profile-inside.html/<username>", methods=['POST'])
def editPOST(username):
    userInfo = functions.updateInfo(privateToken)

    if (int(request.form['choice'])):
        skype = request.form['skype']
        linkedin = request.form['linkedin']
        twitter = request.form['twitter']
        website = request.form['website']
        bio = request.form['bio']
        functions.query_db('UPDATE profile SET skype = ?, linkedin = ?, twitter = ?, website = ?, bio = ?, noSync = ? WHERE username = ?;', [skype, linkedin, twitter, website, bio, 1, username], one=True)
    else:
        functions.query_db('UPDATE profile SET noSync = ? WHERE username = ?;', [0, username], one=True)

    message = userInfo['name'] + ' has changed his/her profile information'
    members = functions.getMembersInformation(privateToken, projectID)
    member = dict()
    for member in members:
        if (member['username'] != userInfo['username']):
            functions.query_db('INSERT INTO notification (message, project, targetUsername, isAlert) VALUES (?, ?, ?, ?);', [message, projectID, member['username'], 0], one=True)

    return redirect('/profile-inside.html/' + username)


@views.route("/request/getNotification/<username>/<project>")
def httpGetNotification(username, project):
    lista = list()
    i = 0;
    for notification in functions.query_db('SELECT id_notif, message, isAlert, alertTitle FROM notification WHERE project = ? AND targetUsername = ? ORDER BY id_notif DESC', [project, username]):
        d = dict()
        d['id_notif'] = notification[0]
        d['message'] = notification[1]
        d['isAlert'] = notification[2]
        d['alertTitle'] = notification[3]
        lista.append(d)

        i += 1
        if (i == MAX_NOTIFICATION):
            break
    
    return Response(json.dumps(lista),  mimetype='application/json')

@views.route("/request/postNotification", methods=['POST'])
def httpPostNotification():
    username = request.form['username']
    project = request.form['projectID']
    message = request.form['message']
    isAlert = request.form['isAlert']
    alertTitle = request.form['alertTitle']

    alertTitle = alertTitle[:25]

    members = functions.getMembersInformation(privateToken, project)
    member = dict()
    for member in members:
        if (member['username'] != username):
            functions.query_db('INSERT INTO notification (message, project, targetUsername, isAlert, alertTitle) VALUES (?, ?, ?, ?, ?);', [message, project, member['username'], isAlert, alertTitle], one=True)

    return Response("",  mimetype='application/text')

@views.route("/request/postTeamName", methods=['POST'])
def httpPostTeamName():
    username = request.form['username']
    project = request.form['projectID']
    teamname = request.form['teamName']

    teamname = teamname[:30]

    functions.query_db('INSERT INTO team (project, name) VALUES (?, ?);', [project, teamname], one=True)

    return Response("",  mimetype='application/text')