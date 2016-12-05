from pprint import pprint
from flask import Blueprint, render_template, url_for, request, redirect, Response, session, abort
import functions
import json

views = Blueprint('views', __name__)

MAX_NOTIFICATION = 30
HOST = 'http://localhost:5000'

privateToken = 'qxzH6TqLBS1kZstjiCMN'
# TAyfsEzcXYZNH-sdkyNC lr
# qxzH6TqLBS1kZstjiCMN lc



#@views.route("/")
@views.route("/login.html")
@views.route("/login.html/")
def login():
    try:
        token = session['token']
        return redirect('/index.html')
    except KeyError:
        temp = None

    return render_template()


@views.route("/")
@views.route("/index.html")
@views.route("/index.html/")
def index():
    # temp while without login
    session['token'] = privateToken

    try:
        userInfo = functions.updateInfo(session['token'])
        projectsList = functions.getProjects(session['token'])
    except KeyError:
        return redirect('/login.html')

    teamname = dict()
    teamname["name"] = None
    teamname["owner"] = 0

    try:
        projectID = session['project']

        currentProject, branchesList, currentBranch, teamname = functions.getRecurrentInfo(session, userInfo)

    except KeyError:
        currentProject = None
        branchesList = None
        currentBranch = None

        projectID = None

    return render_template("index.html", host = HOST, page = 'index', teamname = teamname, projectsList = projectsList, branchesList = branchesList, currentUser = userInfo, currentProject = currentProject, currentBranch = currentBranch)


@views.route("/<page>.html/<type>/<text>", methods=['GET'])
@views.route("/<page>.html/<type>/<text>/", methods=['GET'])
def changeProjectOrBranch(page, type, text):
    if (type == 'project'):
        try:
            projects = functions.getProjects(session['token'])
        except KeyError:
            return redirect('/login.html')
        for project in projects:
            if (project['id'] == int(text)):
                session['project'] = int(text)
                break
    elif (type == 'branch'):
        try:
            branches = functions.getBranches(session['token'], session['project'])
        except KeyError:
            return redirect('/index.html')
        for branch in branches:
            if (branch['name'] == text):
                session['branch'] = text
                break
    else:
        return abort(404)

    res = page.split('-')

    if (res[0] == 'profile'):
        return redirect('/profile-inside.html/' + res[1])
    else:
        return redirect('/' + res[0] + '.html')


@views.route("/members.html")
@views.route("/members.html/")
def members():
    try:
        userInfo = functions.updateInfo(session['token'])
        projectsList = functions.getProjects(session['token'])
    except KeyError:
        return redirect('/login.html')

    try:
        projectID = session['project']
    except KeyError:
        return redirect('/index.html')

    currentProject, branchesList, currentBranch, teamname = functions.getRecurrentInfo(session, userInfo)

    # members
    membersList = functions.getMembersInformation(session['token'], projectID)

    return render_template("members.html", host = HOST, page = 'members', teamname = teamname, projectsList = projectsList, branchesList = branchesList, currentUser = userInfo, currentProject = currentProject, currentBranch = currentBranch, membersList = membersList)


@views.route("/profile-inside.html/<username>", methods=['GET'])
@views.route("/profile-inside.html/<username>/", methods=['GET'])
def profile(username):
    try:
        userInfo = functions.updateInfo(session['token'])
        projectsList = functions.getProjects(session['token'])
    except KeyError:
        return redirect('/login.html')

    try:
        projectID = session['project']
    except KeyError:
        return redirect('/index.html')

    currentProject, branchesList, currentBranch, teamname = functions.getRecurrentInfo(session, userInfo)

    # profile
    found = False
    members = functions.getMembersInformation(session['token'], projectID)
    for member in members:
        if (member["username"] == username):
            found = True
            break

    if (not found):
        return abort(404)

    res = functions.query_db('SELECT * FROM profile WHERE username = ?', [username], one=True)

    if (res is None):
        memberInfo = None
    else:
        memberInfo = dict()
        memberInfo['skype'] = res[2]
        memberInfo['linkedin'] = res[3]
        memberInfo['twitter'] = res[4]
        memberInfo['website'] = res[5]
        memberInfo['bio'] = res[6]
        memberInfo['email'] = res[7]
        memberInfo['username'] = res[0]

    return render_template("profile-inside.html", host = HOST, page = 'profile-'+member['username'], teamname = teamname, projectsList = projectsList, branchesList = branchesList, currentUser = userInfo, currentProject = currentProject, currentBranch = currentBranch, memberInfo = memberInfo, member = member)


@views.route("/profile-edit.html")
@views.route("/profile-edit.html/")
def profileEdit():
    try:
        userInfo = functions.updateInfo(session['token'])
        projectsList = functions.getProjects(session['token'])
    except KeyError:
        return redirect('/login.html')

    try:
        projectID = session['project']
    except KeyError:
        return redirect('/index.html')

    currentProject, branchesList, currentBranch, teamname = functions.getRecurrentInfo(session, userInfo)

    # profile edit
    user = functions.getUserInformation(session['token'])['username']
    res = functions.query_db('SELECT * FROM profile WHERE username = ?', [user], one=True)

    info = dict()
    info['skype'] = res[2]
    info['linkedin'] = res[3]
    info['twitter'] = res[4]
    info['website'] = res[5]
    info['bio'] = res[6]
    info['noSync'] = res[8]

    return render_template("profile-edit.html", host = HOST, page = 'profile-'+userInfo['username'], teamname = teamname, projectsList = projectsList, branchesList = branchesList, currentUser = userInfo, currentProject = currentProject, currentBranch = currentBranch, userInfoDB = info)


@views.route("/profile-inside.html/<username>", methods=['POST'])
@views.route("/profile-inside.html/<username>/", methods=['POST'])
def editPOST(username):
    try:
        userInfo = functions.updateInfo(session['token'])
    except KeyError:
        return redirect('/login.html')

    if (userInfo['username'] != username):
        return abort(401)  # unauthorized

    try:
        members = functions.getMembersInformation(session['token'], session['project'])
    except KeyError:
        return redirect('/index.html')

    # edit
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
    member = dict()
    for member in members:
        if (member['username'] != userInfo['username']):
            functions.query_db('INSERT INTO notification (message, project, targetUsername, isAlert) VALUES (?, ?, ?, ?);', [message, session['project'], member['username'], 0], one=True)

    return redirect('/profile-inside.html/' + username)


@views.route("/request/getNotification/<username>/<project>")
@views.route("/request/getNotification/<username>/<project>/")
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
    try:
        members = functions.getMembersInformation(session['token'], session['project'])
    except KeyError:
        return abort(401)

    message = request.form['message']
    isAlert = request.form['isAlert']
    alertTitle = request.form['alertTitle'][:25]

    member = dict()
    for member in members:
        functions.query_db('INSERT INTO notification (message, project, targetUsername, isAlert, alertTitle) VALUES (?, ?, ?, ?, ?);', [message, session['project'], member['username'], isAlert, alertTitle], one=True)

    return Response("",  mimetype='application/text')


@views.route("/request/postTeamName", methods=['POST'])
def httpPostTeamName():
    print 'entrei team'
    try:
        projectID = session['project']
    except KeyError:
        return abort(401)

    teamname = request.form['teamName'][:30]

    functions.query_db('INSERT INTO team (project, name) VALUES (?, ?);', [projectID, teamname], one=True)

    return Response("",  mimetype='application/text')


# if needed for login
@views.route("/request/postSession", methods=['POST'])
def httpPostSession():
    session['token'] = request.form['token']

    return Response("",  mimetype='application/text')


@views.route("/example.html")
def example():
    #session contents & protection
    try:
        token = session['token']
        projectID = session['project']
        branchName = session['branch']
    except KeyError:
        print("Session doesn't have all info")
        return abort(418)



    # protections & required vars for when implementing UC1
    try:
        userInfo = functions.updateInfo(session['token'])
        projectsList = functions.getProjects(session['token'])
    except KeyError:
        return redirect('/login.html')

    try:
        projectID = session['project']
    except KeyError:
        return redirect('/index.html')

    currentProject, branchesList, currentBranch, teamname = functions.getRecurrentInfo(session, userInfo)

    # return page with required vars for when implementing UC1
    # 'page' var is required for when changing project or branch - have a look at changeProjectOrBranch() function
    return render_template("example.html", host = HOST, page = 'example', teamname = teamname, projectsList = projectsList, branchesList = branchesList, currentUser = userInfo, currentProject = currentProject, currentBranch = currentBranch)
