import json
import urllib
import urllib2


def communicate(url):
    response = urllib2.urlopen(url)
    data = json.load(response)

    return data


def getPrivateToken(username, password):
    values = {'login': username, 'password': password}

    url = "https://git.dei.uc.pt/api/v3/session"

    data = urllib.urlencode(values)
    req = urllib2.Request(url, data)

    return communicate(req)['private_token']


def getProjects(token):
    url = "https://git.dei.uc.pt/api/v3/projects?private_token=" + token
    return communicate(url)


def getProjectInformation(token, projectID):
    url = "https://git.dei.uc.pt/api/v3/projects/" + str(projectID) + "?private_token=" + token
    return communicate(url)


def getUserInformation(token):
    url = "https://git.dei.uc.pt/api/v3/user?private_token=" + token
    return communicate(url)


# useless with outdated gitlab
def getProfileInformation(token, userID):
    url = "https://git.dei.uc.pt/api/v3/user/" + userID + "?private_token=" + token
    return communicate(url)

def getBranchInformation(token, projectID):
    url = "https://git.dei.uc.pt/api/v3/projects/" + str(projectID) + "/repository/branches?private_token=" + token
    return communicate(url)


def getMembersInformation(token, projectID):
    url = "https://git.dei.uc.pt/api/v3/projects/" + str(projectID) + "/members?private_token=" + token
    return communicate(url)


def getSelectedIntOption(text):
    selectedOption = raw_input(text)

    try:
        selectedOption = int(selectedOption)
    except:
        print('This is not a valid option')
        selectedOption = -1

    return selectedOption
