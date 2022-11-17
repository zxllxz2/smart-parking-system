from flask import Flask
from flask_cors import CORS
from mysql.connector import connect
from flask import request

app = Flask(__name__)
CORS(app)

# database connection
cnx = connect(user='root', password='root', host='localhost', database='smart_parking_db')
cursor = cnx.cursor()


def resp(code=200, msg="", obj=None):
    return {
        "code": code,
        "message": msg,
        "object": obj
    }
        

###### Toby's section

@app.route('/lot/all/', methods=['GET'])
def get_all_lots():
    query = "SELECT LID FROM Parking_Lot"
    cursor.execute(query)
    return resp(obj=cursor.fetchall())
# 10, 11


###### Eric's section
# 1~7

@app.route('/lot/listSpace/', methods=['GET'])
def list_space():
    LID = request.args.get('LID')
    query = "SELECT Space_no, Type, Is_occupied FROM Parking_Space WHERE LID=" + str(LID)
    print(query)
    cursor.execute(query)
    return resp(obj=cursor.fetchall())

@app.route('/lot/computeIdle/', methods=['GET'])
def compute_idle():
    LID = request.args.get('LID')
    query = "SELECT COUNT(Space_no) FROM Parking_Space WHERE Is_occupied=false AND LID=" + str(LID)
    print(query)
    cursor.execute(query)
    return resp(obj=cursor.fetchall())



###### Gloria's section
# sql files for creation and insertion
# 8,9,12,13







if __name__ == '__main__':
    app.run(debug=True)