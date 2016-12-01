from app import app
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
<<<<<<< HEAD
    
if __name__ == "__main__":
    app.run()
=======

app.secret_key = '\3Zr47jyXLwf/,?KTaF12R~X@H!jmM]'

if __name__ == "__main__":
    app.run(threaded=True)
>>>>>>> master
